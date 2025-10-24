"""
Organization Management Routes
Handles organization creation, management, and settings
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, User, Subscription, SubscriptionTier
from utils.decorators import audit_log, super_admin_required, business_manager_required
import uuid
from datetime import datetime, timedelta

organizations_bp = Blueprint('organizations', __name__)

@organizations_bp.route('/register-manager', methods=['POST'])
@jwt_required()
@super_admin_required
@audit_log('manager_registration', 'organization')
def register_manager():
    """Register a new business manager and create their organization"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['company_name', 'email', 'password', 'first_name', 'last_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create organization
        org = Organization(
            id=str(uuid.uuid4()),
            name=data['company_name'],
            slug=data['company_name'].lower().replace(' ', '-'),
            email=data['email'],
            phone=data.get('phone'),
            address=data.get('address'),
            status='trial'
        )
        
        db.session.add(org)
        db.session.flush()  # Get the org ID
        
        # Create business manager user
        from werkzeug.security import generate_password_hash
        manager = User(
            id=str(uuid.uuid4()),
            organization_id=org.id,
            email=data['email'],
            password_hash=generate_password_hash(data['password']),
            first_name=data['first_name'],
            last_name=data['last_name'],
            phone=data.get('phone'),
            role='business_manager',
            is_active=True,
            email_verified=True
        )
        
        db.session.add(manager)
        
        # Create trial subscription
        trial_tier = SubscriptionTier.query.filter_by(name='Starter').first()
        if trial_tier:
            trial_subscription = Subscription(
                id=str(uuid.uuid4()),
                organization_id=org.id,
                tier_id=trial_tier.id,
                status='trial',
                trial_start_date=datetime.utcnow(),
                trial_end_date=datetime.utcnow() + timedelta(days=14)
            )
            db.session.add(trial_subscription)
        
        db.session.commit()
        
        return jsonify({
            'message': 'Manager registered successfully',
            'data': {
                'organization_id': org.id,
                'manager_id': manager.id,
                'trial_end_date': trial_subscription.trial_end_date.isoformat() if trial_subscription else None
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@organizations_bp.route('/my-organization', methods=['GET'])
@jwt_required()
def get_my_organization():
    """Get current user's organization details"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        org = Organization.query.get(user.organization_id)
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        # Get subscription details
        subscription = Subscription.query.filter_by(organization_id=org.id).first()
        tier = None
        if subscription:
            tier = SubscriptionTier.query.get(subscription.tier_id)
        
        return jsonify({
            'data': {
                'organization': {
                    'id': org.id,
                    'name': org.name,
                    'slug': org.slug,
                    'phone': org.phone,
                    'email': org.email,
                    'address': org.address,
                    'website': org.website,
                    'logo_url': org.logo_url,
                    'primary_color': org.primary_color,
                    'secondary_color': org.secondary_color,
                    'font_family': org.font_family,
                    'enabled_features': org.enabled_features,
                    'dashboard_layout': org.dashboard_layout,
                    'status': org.status,
                    'created_at': org.created_at.isoformat()
                },
                'subscription': {
                    'id': subscription.id if subscription else None,
                    'status': subscription.status if subscription else None,
                    'trial_end_date': subscription.trial_end_date.isoformat() if subscription and subscription.trial_end_date else None,
                    'next_billing_date': subscription.next_billing_date.isoformat() if subscription and subscription.next_billing_date else None
                } if subscription else None,
                'tier': {
                    'id': tier.id if tier else None,
                    'name': tier.name if tier else None,
                    'price': float(tier.price) if tier else None,
                    'billing_cycle': tier.billing_cycle if tier else None,
                    'max_customers': tier.max_customers if tier else None,
                    'max_managers': tier.max_managers if tier else None,
                    'max_zones': tier.max_zones if tier else None,
                    'features': tier.features if tier else []
                } if tier else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@organizations_bp.route('/organization', methods=['PUT'])
@jwt_required()
@business_manager_required
@audit_log('organization_update', 'organization')
def update_organization():
    """Update organization details"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        org = Organization.query.get(user.organization_id)
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        data = request.get_json()
        
        # Update organization fields
        if 'name' in data:
            org.name = data['name']
            org.slug = data['name'].lower().replace(' ', '-')
        if 'phone' in data:
            org.phone = data['phone']
        if 'address' in data:
            org.address = data['address']
        if 'logo_url' in data:
            org.logo_url = data['logo_url']
        if 'primary_color' in data:
            org.primary_color = data['primary_color']
        if 'secondary_color' in data:
            org.secondary_color = data['secondary_color']
        if 'font_family' in data:
            org.font_family = data['font_family']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Organization updated successfully',
            'data': {
                'id': org.id,
                'name': org.name,
                'slug': org.slug,
                'phone': org.phone,
                'email': org.email,
                'address': org.address,
                'logo_url': org.logo_url,
                'primary_color': org.primary_color,
                'secondary_color': org.secondary_color,
                'font_family': org.font_family
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@organizations_bp.route('/organization/features', methods=['PUT'])
@jwt_required()
@business_manager_required
@audit_log('organization_features_update', 'organization')
def update_organization_features():
    """Update organization features and dashboard layout"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        org = Organization.query.get(user.organization_id)
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        data = request.get_json()
        
        # Update features and layout
        if 'enabled_features' in data:
            org.enabled_features = data['enabled_features']
        if 'dashboard_layout' in data:
            org.dashboard_layout = data['dashboard_layout']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Organization features updated successfully',
            'data': {
                'enabled_features': org.enabled_features,
                'dashboard_layout': org.dashboard_layout
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
