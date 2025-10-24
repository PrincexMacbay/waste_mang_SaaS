"""
Subscription Management Routes
Handles subscription tiers, billing, and usage limits
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Subscription, SubscriptionTier, Organization, User
from utils.decorators import audit_log, super_admin_required, business_manager_required
from utils.limits import get_usage_stats, check_customer_limit, check_manager_limit
import uuid

subscriptions_bp = Blueprint('subscriptions', __name__)

@subscriptions_bp.route('/tiers', methods=['GET'])
def get_subscription_tiers():
    """Get all available subscription tiers"""
    try:
        tiers = SubscriptionTier.query.filter_by(is_active=True).all()
        
        return jsonify({
            'data': [
                {
                    'id': tier.id,
                    'name': tier.name,
                    'description': tier.description,
                    'price': float(tier.price),
                    'billing_cycle': tier.billing_cycle,
                    'max_customers': tier.max_customers,
                    'max_managers': tier.max_managers,
                    'max_zones': tier.max_zones,
                    'features': tier.features
                }
                for tier in tiers
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/tiers', methods=['POST'])
@jwt_required()
@super_admin_required
@audit_log('subscription_tier_creation', 'subscription_tier')
def create_subscription_tier():
    """Create a new subscription tier (Super Admin only)"""
    try:
        data = request.get_json()
        
        tier = SubscriptionTier(
            name=data['name'],
            description=data.get('description'),
            price=data['price'],
            billing_cycle=data['billing_cycle'],
            max_customers=data.get('max_customers', 100),
            max_managers=data.get('max_managers', 2),
            max_zones=data.get('max_zones', 5),
            features=data.get('features', [])
        )
        
        db.session.add(tier)
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription tier created successfully',
            'data': {
                'id': tier.id,
                'name': tier.name,
                'price': float(tier.price),
                'billing_cycle': tier.billing_cycle
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/my-subscription', methods=['GET'])
@jwt_required()
def get_my_subscription():
    """Get current user's subscription details"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        subscription = Subscription.query.filter_by(organization_id=user.organization_id).first()
        if not subscription:
            return jsonify({'error': 'No subscription found'}), 404
        
        tier = SubscriptionTier.query.get(subscription.tier_id)
        if not tier:
            return jsonify({'error': 'Subscription tier not found'}), 404
        
        # Get usage statistics
        usage_stats = get_usage_stats(user.organization_id)
        
        return jsonify({
            'data': {
                'subscription': {
                    'id': subscription.id,
                    'status': subscription.status,
                    'trial_start_date': subscription.trial_start_date.isoformat() if subscription.trial_start_date else None,
                    'trial_end_date': subscription.trial_end_date.isoformat() if subscription.trial_end_date else None,
                    'billing_start_date': subscription.billing_start_date.isoformat() if subscription.billing_start_date else None,
                    'billing_end_date': subscription.billing_end_date.isoformat() if subscription.billing_end_date else None,
                    'next_billing_date': subscription.next_billing_date.isoformat() if subscription.next_billing_date else None,
                    'auto_renew': subscription.auto_renew
                },
                'tier': {
                    'id': tier.id,
                    'name': tier.name,
                    'description': tier.description,
                    'price': float(tier.price),
                    'billing_cycle': tier.billing_cycle,
                    'max_customers': tier.max_customers,
                    'max_managers': tier.max_managers,
                    'max_zones': tier.max_zones,
                    'features': tier.features
                },
                'usage': usage_stats
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/subscription/upgrade', methods=['POST'])
@jwt_required()
@business_manager_required
@audit_log('subscription_upgrade', 'subscription')
def upgrade_subscription():
    """Upgrade organization subscription"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        data = request.get_json()
        tier_id = data.get('tier_id')
        
        if not tier_id:
            return jsonify({'error': 'tier_id is required'}), 400
        
        # Check if tier exists
        tier = SubscriptionTier.query.get(tier_id)
        if not tier:
            return jsonify({'error': 'Subscription tier not found'}), 404
        
        # Get current subscription
        subscription = Subscription.query.filter_by(organization_id=user.organization_id).first()
        if not subscription:
            return jsonify({'error': 'No subscription found'}), 404
        
        # Update subscription
        subscription.tier_id = tier_id
        subscription.status = 'active'
        subscription.billing_start_date = db.func.now()
        subscription.next_billing_date = db.func.now() + db.func.interval('1 month')
        
        db.session.commit()
        
        return jsonify({
            'message': 'Subscription upgraded successfully',
            'data': {
                'tier_name': tier.name,
                'price': float(tier.price),
                'billing_cycle': tier.billing_cycle
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/subscription/check-limits', methods=['GET'])
@jwt_required()
def check_subscription_limits():
    """Check if organization has hit subscription limits"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        # Get usage statistics
        usage_stats = get_usage_stats(user.organization_id)
        
        # Check limits
        customer_limit_hit = check_customer_limit(user.organization_id)
        manager_limit_hit = check_manager_limit(user.organization_id)
        
        return jsonify({
            'data': {
                'usage': usage_stats,
                'limits': {
                    'customer_limit_hit': customer_limit_hit,
                    'manager_limit_hit': manager_limit_hit
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@subscriptions_bp.route('/invoices', methods=['GET'])
@jwt_required()
def get_invoices():
    """Get organization invoices"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 10, type=int)
        
        # This would need to be implemented with Invoice model
        # For now, return empty list
        return jsonify({
            'data': [],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': 0
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
