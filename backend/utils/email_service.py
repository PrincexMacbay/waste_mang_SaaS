"""
Email Service
Handles email notifications and templates
"""

from flask_mail import Mail, Message
from flask import current_app
import os

mail = Mail()

def send_email(to, subject, body, html=None):
    """Send email to recipient"""
    try:
        msg = Message(
            subject=subject,
            recipients=[to],
            body=body,
            html=html,
            sender=current_app.config['MAIL_DEFAULT_SENDER']
        )
        mail.send(msg)
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_trial_welcome_email(manager_email, manager_name, organization_name, trial_end_date):
    """Send welcome email to new trial manager"""
    subject = f"Welcome to Waste Management SaaS - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Welcome to Waste Management SaaS!</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>Congratulations! Your organization <strong>{organization_name}</strong> has been successfully set up on our platform.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">Your Trial Details:</h3>
                <ul style="margin: 0;">
                    <li><strong>Trial Period:</strong> 14 days</li>
                    <li><strong>Trial Ends:</strong> {trial_end_date}</li>
                    <li><strong>Features:</strong> Full platform access</li>
                </ul>
            </div>
            
            <h3>What's Next?</h3>
            <ol>
                <li>Log in to your dashboard</li>
                <li>Set up your organization branding</li>
                <li>Create your first regional manager</li>
                <li>Start managing your waste collection zones</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/login" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Access Your Dashboard
                </a>
            </div>
            
            <p>If you have any questions, our support team is here to help!</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)

def send_trial_expiry_reminder_email(manager_email, manager_name, organization_name, days_left):
    """Send trial expiry reminder email"""
    subject = f"Trial Expiring Soon - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">Trial Expiring Soon</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>Your trial for <strong>{organization_name}</strong> will expire in <strong>{days_left} days</strong>.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626; margin-top: 0;">Important:</h3>
                <p>To continue using our platform, you'll need to upgrade to a paid subscription before your trial expires.</p>
            </div>
            
            <h3>Upgrade Benefits:</h3>
            <ul>
                <li>Uninterrupted service</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
                <li>Custom branding</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/subscription" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Upgrade Now
                </a>
            </div>
            
            <p>Don't let your trial expire! Upgrade today to continue managing your waste collection operations.</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)

def send_trial_expired_email(manager_email, manager_name, organization_name):
    """Send trial expired email"""
    subject = f"Trial Expired - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">Trial Expired</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>Your trial for <strong>{organization_name}</strong> has expired.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626; margin-top: 0;">Service Suspended</h3>
                <p>Your organization's access to the platform has been suspended. To restore access, please upgrade to a paid subscription.</p>
            </div>
            
            <h3>Upgrade to Restore Access:</h3>
            <ul>
                <li>Immediate service restoration</li>
                <li>All your data preserved</li>
                <li>Priority support</li>
                <li>Advanced features</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/subscription" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Upgrade Now
                </a>
            </div>
            
            <p>We're here to help you succeed. Contact our support team if you need assistance.</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)

def send_subscription_confirmation_email(manager_email, manager_name, organization_name, plan_name, amount):
    """Send subscription confirmation email"""
    subject = f"Subscription Activated - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #059669;">Subscription Activated!</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>Congratulations! Your subscription for <strong>{organization_name}</strong> has been successfully activated.</p>
            
            <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #059669;">
                <h3 style="color: #059669; margin-top: 0;">Subscription Details:</h3>
                <ul style="margin: 0;">
                    <li><strong>Plan:</strong> {plan_name}</li>
                    <li><strong>Amount:</strong> ₦{amount}/month</li>
                    <li><strong>Status:</strong> Active</li>
                    <li><strong>Billing:</strong> Monthly</li>
                </ul>
            </div>
            
            <h3>What's Included:</h3>
            <ul>
                <li>Full platform access</li>
                <li>Priority support</li>
                <li>Advanced analytics</li>
                <li>Custom branding</li>
                <li>API access</li>
            </ul>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/dashboard" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Access Your Dashboard
                </a>
            </div>
            
            <p>Thank you for choosing our platform. We're excited to help you grow your waste management business!</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)

def send_invoice_email(manager_email, manager_name, organization_name, invoice_number, amount, due_date):
    """Send monthly invoice email"""
    subject = f"Monthly Invoice - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Monthly Invoice</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>Your monthly invoice for <strong>{organization_name}</strong> is ready.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin-top: 0;">Invoice Details:</h3>
                <ul style="margin: 0; list-style: none; padding: 0;">
                    <li style="margin-bottom: 8px;"><strong>Invoice #:</strong> {invoice_number}</li>
                    <li style="margin-bottom: 8px;"><strong>Amount:</strong> ₦{amount}</li>
                    <li style="margin-bottom: 8px;"><strong>Due Date:</strong> {due_date}</li>
                    <li style="margin-bottom: 8px;"><strong>Status:</strong> Pending</li>
                </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/billing" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    View Invoice
                </a>
            </div>
            
            <p>Payment will be automatically processed on the due date. No action is required from you.</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)

def send_payment_failed_email(manager_email, manager_name, organization_name, amount, retry_date):
    """Send payment failed email"""
    subject = f"Payment Failed - {organization_name}"
    
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #dc2626;">Payment Failed</h2>
            
            <p>Dear {manager_name},</p>
            
            <p>We were unable to process your payment for <strong>{organization_name}</strong>.</p>
            
            <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #dc2626;">
                <h3 style="color: #dc2626; margin-top: 0;">Payment Details:</h3>
                <ul style="margin: 0;">
                    <li><strong>Amount:</strong> ₦{amount}</li>
                    <li><strong>Retry Date:</strong> {retry_date}</li>
                    <li><strong>Status:</strong> Failed</li>
                </ul>
            </div>
            
            <h3>What to do:</h3>
            <ol>
                <li>Check your payment method</li>
                <li>Update your billing information if needed</li>
                <li>Contact your bank if necessary</li>
            </ol>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{os.getenv('FRONTEND_URL', 'http://localhost:3000')}/billing" 
                   style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                    Update Payment Method
                </a>
            </div>
            
            <p>We'll automatically retry the payment on {retry_date}. If you need immediate assistance, please contact our support team.</p>
            
            <p>Best regards,<br>
            The Waste Management SaaS Team</p>
        </div>
    </body>
    </html>
    """
    
    return send_email(manager_email, subject, None, html)
