-- =====================================================
-- WASTE MANAGEMENT SAAS PLATFORM - DATABASE SCHEMA
-- PostgreSQL Database Schema
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CORE ORGANIZATION & TENANCY TABLES
-- =====================================================

-- Organizations (Business Managers' companies)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    website VARCHAR(255),
    
    -- Branding & Customization
    logo_url VARCHAR(500),
    primary_color VARCHAR(7) DEFAULT '#2563eb',
    secondary_color VARCHAR(7) DEFAULT '#1e40af',
    font_family VARCHAR(50) DEFAULT 'Inter',
    
    -- Features & Settings
    enabled_features JSONB DEFAULT '{}',
    dashboard_layout JSONB DEFAULT '{}',
    
    -- Status & Metadata
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_organizations_slug (slug),
    INDEX idx_organizations_status (status)
);

-- Subscription Tiers (Pricing Plans)
CREATE TABLE subscription_tiers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    billing_cycle VARCHAR(20) NOT NULL CHECK (billing_cycle IN ('monthly', 'annual')),
    
    -- Limits
    max_customers INTEGER DEFAULT 100,
    max_managers INTEGER DEFAULT 2,
    max_zones INTEGER DEFAULT 5,
    
    -- Features
    features JSONB DEFAULT '[]',
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Subscriptions (Organization subscriptions)
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    tier_id INTEGER NOT NULL REFERENCES subscription_tiers(id),
    
    -- Subscription Details
    status VARCHAR(20) DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'suspended', 'cancelled', 'expired')),
    trial_start_date TIMESTAMP WITH TIME ZONE,
    trial_end_date TIMESTAMP WITH TIME ZONE,
    billing_start_date TIMESTAMP WITH TIME ZONE,
    billing_end_date TIMESTAMP WITH TIME ZONE,
    
    -- Billing
    next_billing_date TIMESTAMP WITH TIME ZONE,
    auto_renew BOOLEAN DEFAULT true,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_subscriptions_organization (organization_id),
    INDEX idx_subscriptions_status (status)
);

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users (All users in the system)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    
    -- Basic Info
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    
    -- Role & Permissions
    role VARCHAR(20) NOT NULL CHECK (role IN ('super_admin', 'business_manager', 'regional_manager', 'customer', 'staff')),
    permissions JSONB DEFAULT '{}',
    
    -- Status & Security
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    created_by UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_users_organization (organization_id),
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
);

-- =====================================================
-- ZONE & TERRITORY MANAGEMENT
-- =====================================================

-- Zones (Geographic areas managed by Regional Managers)
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Geographic Info
    area_polygon JSONB, -- GeoJSON polygon
    center_lat DECIMAL(10, 8),
    center_lng DECIMAL(11, 8),
    
    -- Manager Assignment
    regional_manager_id UUID REFERENCES users(id),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_zones_organization (organization_id),
    INDEX idx_zones_manager (regional_manager_id)
);

-- =====================================================
-- CUSTOMER & SERVICE MANAGEMENT
-- =====================================================

-- Customers (End Users)
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id),
    
    -- Basic Info
    email VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Address Info
    address TEXT NOT NULL,
    house_type VARCHAR(50),
    number_of_flats INTEGER DEFAULT 1,
    number_of_occupants INTEGER DEFAULT 1,
    
    -- Service Info
    monthly_fee DECIMAL(10,2) NOT NULL,
    pickup_frequency VARCHAR(20) DEFAULT 'weekly',
    service_start_date DATE,
    service_end_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_customers_organization (organization_id),
    INDEX idx_customers_zone (zone_id),
    INDEX idx_customers_email (email)
);

-- =====================================================
-- PICKUP & SERVICE MANAGEMENT
-- =====================================================

-- Pickup Schedules
CREATE TABLE pickups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id),
    
    -- Schedule Info
    scheduled_date DATE NOT NULL,
    scheduled_time TIME NOT NULL,
    pickup_type VARCHAR(20) DEFAULT 'regular' CHECK (pickup_type IN ('regular', 'special', 'emergency')),
    
    -- Status & Tracking
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled', 'missed')),
    actual_pickup_time TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    
    -- Metadata
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_pickups_organization (organization_id),
    INDEX idx_pickups_customer (customer_id),
    INDEX idx_pickups_zone (zone_id),
    INDEX idx_pickups_scheduled_date (scheduled_date)
);

-- =====================================================
-- PAYMENT & BILLING MANAGEMENT
-- =====================================================

-- Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Invoice Details
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    description TEXT,
    
    -- Dates
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_invoices_organization (organization_id),
    INDEX idx_invoices_customer (customer_id),
    INDEX idx_invoices_status (status)
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    invoice_id UUID REFERENCES invoices(id),
    
    -- Payment Details
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'NGN',
    payment_method VARCHAR(50) NOT NULL,
    payment_reference VARCHAR(100),
    
    -- Status
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    -- Metadata
    processed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_payments_organization (organization_id),
    INDEX idx_payments_customer (customer_id),
    INDEX idx_payments_invoice (invoice_id)
);

-- =====================================================
-- COMMUNICATION & NOTIFICATIONS
-- =====================================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    
    -- Notification Details
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    
    -- Status
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_notifications_organization (organization_id),
    INDEX idx_notifications_user (user_id),
    INDEX idx_notifications_customer (customer_id),
    INDEX idx_notifications_is_read (is_read)
);

-- =====================================================
-- AUDIT & COMPLIANCE
-- =====================================================

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    -- Action Details
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    old_values JSONB,
    new_values JSONB,
    
    -- Context
    ip_address INET,
    user_agent TEXT,
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_audit_logs_organization (organization_id),
    INDEX idx_audit_logs_user (user_id),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_created_at (created_at)
);

-- =====================================================
-- COMPLAINTS & SUPPORT
-- =====================================================

-- Complaints
CREATE TABLE complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    zone_id UUID REFERENCES zones(id),
    
    -- Complaint Details
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Status
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    resolution TEXT,
    
    -- Assignment
    assigned_to UUID REFERENCES users(id),
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE,
    
    -- Indexes
    INDEX idx_complaints_organization (organization_id),
    INDEX idx_complaints_customer (customer_id),
    INDEX idx_complaints_status (status),
    INDEX idx_complaints_assigned_to (assigned_to)
);

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON zones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_pickups_updated_at BEFORE UPDATE ON pickups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_complaints_updated_at BEFORE UPDATE ON complaints FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default subscription tiers
INSERT INTO subscription_tiers (name, description, price, billing_cycle, max_customers, max_managers, max_zones, features) VALUES
('Starter', 'Perfect for small waste management companies', 99.00, 'monthly', 100, 2, 3, '["basic_reporting", "email_support", "custom_branding"]'),
('Professional', 'Ideal for growing businesses', 199.00, 'monthly', 500, 5, 10, '["advanced_analytics", "priority_support", "api_access", "custom_domain"]'),
('Enterprise', 'For large organizations', 399.00, 'monthly', -1, -1, -1, '["custom_features", "dedicated_support", "white_label", "sla_guarantee"]');

-- Insert super admin user (you)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified) VALUES
('admin@wastemanagement-saas.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8QZ8K2K', 'Super', 'Admin', 'super_admin', true, true);
