"""
Scheduled Jobs
Background tasks for the waste management SaaS platform
"""

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
from models import db, Organization, Subscription, User
from utils.email_service import (
    send_trial_expiry_reminder_email,
    send_trial_expired_email,
    send_subscription_confirmation_email,
    send_invoice_email,
    send_payment_failed_email
)
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()

def check_trial_expiry():
    """Check for trials expiring in 3 days and send reminders"""
    try:
        logger.info("Checking for trials expiring in 3 days...")
        
        # Get trials expiring in 3 days
        expiry_date = datetime.utcnow() + timedelta(days=3)
        start_date = expiry_date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_date = expiry_date.replace(hour=23, minute=59, second=59, microsecond=999999)
        
        expiring_trials = Subscription.query.filter(
            Subscription.status == 'trial',
            Subscription.trial_end_date >= start_date,
            Subscription.trial_end_date <= end_date
        ).all()
        
        for subscription in expiring_trials:
            # Get organization and manager details
            org = Organization.query.get(subscription.organization_id)
            if not org:
                continue
                
            manager = User.query.filter_by(
                organization_id=org.id,
                role='business_manager'
            ).first()
            
            if not manager:
                continue
            
            # Calculate days left
            days_left = (subscription.trial_end_date - datetime.utcnow()).days
            
            # Send reminder email
            send_trial_expiry_reminder_email(
                manager.email,
                f"{manager.first_name} {manager.last_name}",
                org.name,
                days_left
            )
            
            logger.info(f"Sent trial expiry reminder to {manager.email} for {org.name}")
        
        logger.info(f"Processed {len(expiring_trials)} expiring trials")
        
    except Exception as e:
        logger.error(f"Error checking trial expiry: {e}")

def expire_trials():
    """Mark expired trials as expired and suspend organizations"""
    try:
        logger.info("Processing expired trials...")
        
        # Get expired trials
        expired_trials = Subscription.query.filter(
            Subscription.status == 'trial',
            Subscription.trial_end_date < datetime.utcnow()
        ).all()
        
        for subscription in expired_trials:
            # Update subscription status
            subscription.status = 'expired'
            
            # Suspend organization
            org = Organization.query.get(subscription.organization_id)
            if org:
                org.status = 'suspended'
                
                # Send expiry email to manager
                manager = User.query.filter_by(
                    organization_id=org.id,
                    role='business_manager'
                ).first()
                
                if manager:
                    send_trial_expired_email(
                        manager.email,
                        f"{manager.first_name} {manager.last_name}",
                        org.name
                    )
                    
                    logger.info(f"Sent trial expired email to {manager.email} for {org.name}")
        
        db.session.commit()
        logger.info(f"Processed {len(expired_trials)} expired trials")
        
    except Exception as e:
        logger.error(f"Error processing expired trials: {e}")
        db.session.rollback()

def generate_monthly_invoices():
    """Generate monthly invoices for active subscriptions"""
    try:
        logger.info("Generating monthly invoices...")
        
        # Get active subscriptions
        active_subscriptions = Subscription.query.filter_by(status='active').all()
        
        for subscription in active_subscriptions:
            # Get organization and tier details
            org = Organization.query.get(subscription.organization_id)
            if not org:
                continue
            
            # Get tier details
            from models import SubscriptionTier
            tier = SubscriptionTier.query.get(subscription.tier_id)
            if not tier:
                continue
            
            # Create invoice (this would integrate with your billing system)
            # For now, we'll just log the action
            logger.info(f"Generated invoice for {org.name} - ₦{tier.price}")
            
            # Send invoice email
            manager = User.query.filter_by(
                organization_id=org.id,
                role='business_manager'
            ).first()
            
            if manager:
                due_date = datetime.utcnow() + timedelta(days=7)
                send_invoice_email(
                    manager.email,
                    f"{manager.first_name} {manager.last_name}",
                    org.name,
                    f"INV-{datetime.utcnow().strftime('%Y%m%d')}-{org.id[:8]}",
                    tier.price,
                    due_date.strftime('%Y-%m-%d')
                )
                
                logger.info(f"Sent invoice email to {manager.email} for {org.name}")
        
        logger.info(f"Generated invoices for {len(active_subscriptions)} active subscriptions")
        
    except Exception as e:
        logger.error(f"Error generating monthly invoices: {e}")

def cleanup_old_logs():
    """Clean up audit logs older than 90 days"""
    try:
        logger.info("Cleaning up old audit logs...")
        
        # Get logs older than 90 days
        cutoff_date = datetime.utcnow() - timedelta(days=90)
        
        from models import AuditLog
        old_logs = AuditLog.query.filter(
            AuditLog.created_at < cutoff_date
        ).all()
        
        # Delete old logs
        for log in old_logs:
            db.session.delete(log)
        
        db.session.commit()
        logger.info(f"Cleaned up {len(old_logs)} old audit logs")
        
    except Exception as e:
        logger.error(f"Error cleaning up old logs: {e}")
        db.session.rollback()

def start_scheduler():
    """Start the background scheduler"""
    try:
        # Add jobs
        scheduler.add_job(
            check_trial_expiry,
            trigger=CronTrigger(hour=9, minute=0),  # Daily at 9 AM
            id='check_trial_expiry',
            name='Check Trial Expiry',
            replace_existing=True
        )
        
        scheduler.add_job(
            expire_trials,
            trigger=CronTrigger(hour=10, minute=0),  # Daily at 10 AM
            id='expire_trials',
            name='Expire Trials',
            replace_existing=True
        )
        
        scheduler.add_job(
            generate_monthly_invoices,
            trigger=CronTrigger(day=1, hour=8, minute=0),  # 1st of month at 8 AM
            id='generate_monthly_invoices',
            name='Generate Monthly Invoices',
            replace_existing=True
        )
        
        scheduler.add_job(
            cleanup_old_logs,
            trigger=CronTrigger(day_of_week=6, hour=3, minute=0),  # Sunday at 3 AM
            id='cleanup_old_logs',
            name='Cleanup Old Logs',
            replace_existing=True
        )
        
        # Start scheduler
        scheduler.start()
        logger.info("Background scheduler started successfully")
        
    except Exception as e:
        logger.error(f"Error starting scheduler: {e}")

def stop_scheduler():
    """Stop the background scheduler"""
    try:
        scheduler.shutdown()
        logger.info("Background scheduler stopped")
    except Exception as e:
        logger.error(f"Error stopping scheduler: {e}")

# Initialize scheduler when module is imported
if __name__ == '__main__':
    start_scheduler()
