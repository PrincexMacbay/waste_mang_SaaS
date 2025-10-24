"""
Database Models for Waste Management SaaS Platform
Multi-tenant architecture with organization-based data isolation
"""

from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid

db = SQLAlchemy()

class Organization(db.Model):
    """Business Manager organizations"""
    __tablename__ = 'organizations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(255))
    address = db.Column(db.Text)
    website = db.Column(db.String(255))
    
    # Branding & Customization
    logo_url = db.Column(db.String(500))
    primary_color = db.Column(db.String(7), default='#2563eb')
    secondary_color = db.Column(db.String(7), default='#1e40af')
    font_family = db.Column(db.String(50), default='Inter')
    
    # Features & Settings
    enabled_features = db.Column(db.JSON, default={})
    dashboard_layout = db.Column(db.JSON, default={})
    
    # Status & Metadata
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='organization', lazy=True)
    customers = db.relationship('Customer', backref='organization', lazy=True)
    zones = db.relationship('Zone', backref='organization', lazy=True)
    subscriptions = db.relationship('Subscription', backref='organization', lazy=True)
    pickups = db.relationship('Pickup', backref='organization', lazy=True)
    invoices = db.relationship('Invoice', backref='organization', lazy=True)
    payments = db.relationship('Payment', backref='organization', lazy=True)
    notifications = db.relationship('Notification', backref='organization', lazy=True)
    audit_logs = db.relationship('AuditLog', backref='organization', lazy=True)
    complaints = db.relationship('Complaint', backref='organization', lazy=True)

class SubscriptionTier(db.Model):
    """Pricing plans for organizations"""
    __tablename__ = 'subscription_tiers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Numeric(10, 2), nullable=False)
    billing_cycle = db.Column(db.String(20), nullable=False)
    
    # Limits
    max_customers = db.Column(db.Integer, default=100)
    max_managers = db.Column(db.Integer, default=2)
    max_zones = db.Column(db.Integer, default=5)
    
    # Features
    features = db.Column(db.JSON, default=[])
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    subscriptions = db.relationship('Subscription', backref='tier', lazy=True)

class Subscription(db.Model):
    """Organization subscriptions"""
    __tablename__ = 'subscriptions'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    tier_id = db.Column(db.Integer, db.ForeignKey('subscription_tiers.id'), nullable=False)
    
    # Subscription Details
    status = db.Column(db.String(20), default='trial')
    trial_start_date = db.Column(db.DateTime)
    trial_end_date = db.Column(db.DateTime)
    billing_start_date = db.Column(db.DateTime)
    billing_end_date = db.Column(db.DateTime)
    
    # Billing
    next_billing_date = db.Column(db.DateTime)
    auto_renew = db.Column(db.Boolean, default=True)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(db.Model):
    """All users in the system"""
    __tablename__ = 'users'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'))
    
    # Basic Info
    email = db.Column(db.String(255), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    
    # Role & Permissions
    role = db.Column(db.String(20), nullable=False)
    permissions = db.Column(db.JSON, default={})
    
    # Status & Security
    is_active = db.Column(db.Boolean, default=True)
    email_verified = db.Column(db.Boolean, default=False)
    last_login = db.Column(db.DateTime)
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Zone(db.Model):
    """Geographic areas managed by Regional Managers"""
    __tablename__ = 'zones'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    
    # Geographic Info
    area_polygon = db.Column(db.JSON)
    center_lat = db.Column(db.Numeric(10, 8))
    center_lng = db.Column(db.Numeric(11, 8))
    
    # Manager Assignment
    regional_manager_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    
    # Status
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    customers = db.relationship('Customer', backref='zone', lazy=True)
    pickups = db.relationship('Pickup', backref='zone', lazy=True)
    complaints = db.relationship('Complaint', backref='zone', lazy=True)

class Customer(db.Model):
    """End users (waste management service customers)"""
    __tablename__ = 'customers'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    zone_id = db.Column(db.String(36), db.ForeignKey('zones.id'))
    
    # Basic Info
    email = db.Column(db.String(255), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    
    # Address Info
    address = db.Column(db.Text, nullable=False)
    house_type = db.Column(db.String(50))
    number_of_flats = db.Column(db.Integer, default=1)
    number_of_occupants = db.Column(db.Integer, default=1)
    
    # Service Info
    monthly_fee = db.Column(db.Numeric(10, 2), nullable=False)
    pickup_frequency = db.Column(db.String(20), default='weekly')
    service_start_date = db.Column(db.Date)
    service_end_date = db.Column(db.Date)
    
    # Status
    status = db.Column(db.String(20), default='active')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    pickups = db.relationship('Pickup', backref='customer', lazy=True)
    invoices = db.relationship('Invoice', backref='customer', lazy=True)
    payments = db.relationship('Payment', backref='customer', lazy=True)
    notifications = db.relationship('Notification', backref='customer', lazy=True)
    complaints = db.relationship('Complaint', backref='customer', lazy=True)

class Pickup(db.Model):
    """Waste pickup scheduling and tracking"""
    __tablename__ = 'pickups'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    customer_id = db.Column(db.String(36), db.ForeignKey('customers.id'), nullable=False)
    zone_id = db.Column(db.String(36), db.ForeignKey('zones.id'))
    
    # Schedule Info
    scheduled_date = db.Column(db.Date, nullable=False)
    scheduled_time = db.Column(db.Time, nullable=False)
    pickup_type = db.Column(db.String(20), default='regular')
    
    # Status & Tracking
    status = db.Column(db.String(20), default='scheduled')
    actual_pickup_time = db.Column(db.DateTime)
    notes = db.Column(db.Text)
    
    # Metadata
    created_by = db.Column(db.String(36), db.ForeignKey('users.id'))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Invoice(db.Model):
    """Customer billing invoices"""
    __tablename__ = 'invoices'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    customer_id = db.Column(db.String(36), db.ForeignKey('customers.id'))
    
    # Invoice Details
    invoice_number = db.Column(db.String(50), unique=True, nullable=False)
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='NGN')
    description = db.Column(db.Text)
    
    # Dates
    issue_date = db.Column(db.Date, nullable=False)
    due_date = db.Column(db.Date, nullable=False)
    paid_date = db.Column(db.Date)
    
    # Status
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    payments = db.relationship('Payment', backref='invoice', lazy=True)

class Payment(db.Model):
    """Payment transactions"""
    __tablename__ = 'payments'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    customer_id = db.Column(db.String(36), db.ForeignKey('customers.id'))
    invoice_id = db.Column(db.String(36), db.ForeignKey('invoices.id'))
    
    # Payment Details
    amount = db.Column(db.Numeric(10, 2), nullable=False)
    currency = db.Column(db.String(3), default='NGN')
    payment_method = db.Column(db.String(50), nullable=False)
    payment_reference = db.Column(db.String(100))
    
    # Status
    status = db.Column(db.String(20), default='pending')
    processed_at = db.Column(db.DateTime)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Notification(db.Model):
    """System notifications to users"""
    __tablename__ = 'notifications'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    customer_id = db.Column(db.String(36), db.ForeignKey('customers.id'))
    
    # Notification Details
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text, nullable=False)
    type = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), default='normal')
    
    # Status
    is_read = db.Column(db.Boolean, default=False)
    read_at = db.Column(db.DateTime)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class AuditLog(db.Model):
    """Complete audit trail of all actions"""
    __tablename__ = 'audit_logs'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('users.id'))
    
    # Action Details
    action = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(50), nullable=False)
    resource_id = db.Column(db.String(36))
    old_values = db.Column(db.JSON)
    new_values = db.Column(db.JSON)
    
    # Context
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.Text)
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Complaint(db.Model):
    """Customer complaints and support tickets"""
    __tablename__ = 'complaints'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    organization_id = db.Column(db.String(36), db.ForeignKey('organizations.id'), nullable=False)
    customer_id = db.Column(db.String(36), db.ForeignKey('customers.id'), nullable=False)
    zone_id = db.Column(db.String(36), db.ForeignKey('zones.id'))
    
    # Complaint Details
    subject = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    priority = db.Column(db.String(20), default='medium')
    
    # Status
    status = db.Column(db.String(20), default='open')
    resolution = db.Column(db.Text)
    
    # Assignment
    assigned_to = db.Column(db.String(36), db.ForeignKey('users.id'))
    
    # Metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    resolved_at = db.Column(db.DateTime)
