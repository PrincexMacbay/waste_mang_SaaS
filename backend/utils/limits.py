"""
Usage Limits and Enforcement
Handles subscription tier limits and feature access
"""

from models import db, Organization, User, Customer, Zone, Pickup, Payment
from datetime import datetime, timedelta
from sqlalchemy import func

def check_customer_limit(organization_id):
    """Check if organization has hit customer limit"""
    try:
        org = Organization.query.get(organization_id)
        if not org:
            return False
        
        # Get current subscription
        from models import Subscription, SubscriptionTier
        subscription = Subscription.query.filter_by(organization_id=organization_id).first()
        if not subscription:
            return False
        
        tier = SubscriptionTier.query.get(subscription.tier_id)
        if not tier:
            return False
        
        # Check if tier has unlimited customers
        if tier.max_customers == -1:
            return False
        
        # Count current customers
        customer_count = Customer.query.filter_by(organization_id=organization_id).count()
        
        return customer_count >= tier.max_customers
        
    except Exception:
        return False

def check_manager_limit(organization_id):
    """Check if organization has hit manager limit"""
    try:
        org = Organization.query.get(organization_id)
        if not org:
            return False
        
        # Get current subscription
        from models import Subscription, SubscriptionTier
        subscription = Subscription.query.filter_by(organization_id=organization_id).first()
        if not subscription:
            return False
        
        tier = SubscriptionTier.query.get(subscription.tier_id)
        if not tier:
            return False
        
        # Check if tier has unlimited managers
        if tier.max_managers == -1:
            return False
        
        # Count current managers (regional managers)
        manager_count = User.query.filter_by(
            organization_id=organization_id,
            role='regional_manager'
        ).count()
        
        return manager_count >= tier.max_managers
        
    except Exception:
        return False

def check_zone_limit(organization_id):
    """Check if organization has hit zone limit"""
    try:
        org = Organization.query.get(organization_id)
        if not org:
            return False
        
        # Get current subscription
        from models import Subscription, SubscriptionTier
        subscription = Subscription.query.filter_by(organization_id=organization_id).first()
        if not subscription:
            return False
        
        tier = SubscriptionTier.query.get(subscription.tier_id)
        if not tier:
            return False
        
        # Check if tier has unlimited zones
        if tier.max_zones == -1:
            return False
        
        # Count current zones
        zone_count = Zone.query.filter_by(organization_id=organization_id).count()
        
        return zone_count >= tier.max_zones
        
    except Exception:
        return False

def check_feature_enabled(organization_id, feature_name):
    """Check if a specific feature is enabled for the organization"""
    try:
        org = Organization.query.get(organization_id)
        if not org:
            return False
        
        enabled_features = org.enabled_features or {}
        return enabled_features.get(feature_name, False)
        
    except Exception:
        return False

def get_usage_stats(organization_id):
    """Get comprehensive usage statistics for an organization"""
    try:
        # Customer count
        customer_count = Customer.query.filter_by(organization_id=organization_id).count()
        
        # Manager count (regional managers)
        manager_count = User.query.filter_by(
            organization_id=organization_id,
            role='regional_manager'
        ).count()
        
        # Zone count
        zone_count = Zone.query.filter_by(organization_id=organization_id).count()
        
        # Pickups this month
        start_of_month = datetime.utcnow().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        pickups_this_month = Pickup.query.filter(
            Pickup.organization_id == organization_id,
            Pickup.created_at >= start_of_month
        ).count()
        
        # Revenue this month
        revenue_this_month = db.session.query(func.sum(Payment.amount)).filter(
            Payment.organization_id == organization_id,
            Payment.status == 'completed',
            Payment.created_at >= start_of_month
        ).scalar() or 0
        
        return {
            'customers': customer_count,
            'managers': manager_count,
            'zones': zone_count,
            'pickups_this_month': pickups_this_month,
            'revenue_this_month': float(revenue_this_month)
        }
        
    except Exception as e:
        return {
            'customers': 0,
            'managers': 0,
            'zones': 0,
            'pickups_this_month': 0,
            'revenue_this_month': 0.0
        }

def enforce_limits_middleware(organization_id, action, resource_type):
    """Middleware to enforce subscription limits before operations"""
    try:
        # Check if organization is active
        org = Organization.query.get(organization_id)
        if not org or org.status not in ['active', 'trial']:
            return {
                'allowed': False,
                'error': 'Organization is not active',
                'status_code': 402
            }
        
        # Check subscription status
        from models import Subscription
        subscription = Subscription.query.filter_by(organization_id=organization_id).first()
        if not subscription or subscription.status not in ['active', 'trial']:
            return {
                'allowed': False,
                'error': 'No active subscription',
                'status_code': 402
            }
        
        # Check specific limits based on action
        if action == 'create_customer':
            if check_customer_limit(organization_id):
                return {
                    'allowed': False,
                    'error': 'Customer limit reached. Please upgrade your subscription.',
                    'status_code': 402
                }
        
        elif action == 'create_manager':
            if check_manager_limit(organization_id):
                return {
                    'allowed': False,
                    'error': 'Manager limit reached. Please upgrade your subscription.',
                    'status_code': 402
                }
        
        elif action == 'create_zone':
            if check_zone_limit(organization_id):
                return {
                    'allowed': False,
                    'error': 'Zone limit reached. Please upgrade your subscription.',
                    'status_code': 402
                }
        
        return {'allowed': True}
        
    except Exception as e:
        return {
            'allowed': False,
            'error': str(e),
            'status_code': 500
        }
