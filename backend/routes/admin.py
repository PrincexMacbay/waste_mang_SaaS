"""
Admin Routes
Handles super admin operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Organization, User, Subscription, SubscriptionTier, AuditLog
from utils.decorators import audit_log, super_admin_required
from utils.limits import get_usage_stats
import uuid
from datetime import datetime, timedelta

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/organizations', methods=['GET'])
@jwt_required()
@super_admin_required
def list_all_organizations():
    """List all organizations (Super Admin only)"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        status = request.args.get('status')
        
        query = Organization.query
        
        if status:
            query = query.filter_by(status=status)
        
        organizations = query.order_by(Organization.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': org.id,
                    'name': org.name,
                    'slug': org.slug,
                    'email': org.email,
                    'phone': org.phone,
                    'status': org.status,
                    'created_at': org.created_at.isoformat(),
                    'updated_at': org.updated_at.isoformat()
                }
                for org in organizations.items
            ],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': organizations.total,
                'pages': organizations.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/organizations/<org_id>/suspend', methods=['PUT'])
@jwt_required()
@super_admin_required
@audit_log('organization_suspension', 'organization')
def suspend_organization(org_id):
    """Suspend an organization (Super Admin only)"""
    try:
        org = Organization.query.get(org_id)
        
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        org.status = 'suspended'
        db.session.commit()
        
        return jsonify({
            'message': 'Organization suspended successfully',
            'data': {
                'id': org.id,
                'name': org.name,
                'status': org.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/organizations/<org_id>/activate', methods=['PUT'])
@jwt_required()
@super_admin_required
@audit_log('organization_activation', 'organization')
def activate_organization(org_id):
    """Activate an organization (Super Admin only)"""
    try:
        org = Organization.query.get(org_id)
        
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        org.status = 'active'
        db.session.commit()
        
        return jsonify({
            'message': 'Organization activated successfully',
            'data': {
                'id': org.id,
                'name': org.name,
                'status': org.status
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/organizations/<org_id>/details', methods=['GET'])
@jwt_required()
@super_admin_required
def get_organization_details(org_id):
    """Get detailed organization information (Super Admin only)"""
    try:
        org = Organization.query.get(org_id)
        
        if not org:
            return jsonify({'error': 'Organization not found'}), 404
        
        # Get subscription details
        subscription = Subscription.query.filter_by(organization_id=org_id).first()
        tier = None
        if subscription:
            tier = SubscriptionTier.query.get(subscription.tier_id)
        
        # Get usage statistics
        usage_stats = get_usage_stats(org_id)
        
        return jsonify({
            'data': {
                'organization': {
                    'id': org.id,
                    'name': org.name,
                    'slug': org.slug,
                    'email': org.email,
                    'phone': org.phone,
                    'address': org.address,
                    'website': org.website,
                    'status': org.status,
                    'created_at': org.created_at.isoformat(),
                    'updated_at': org.updated_at.isoformat()
                },
                'subscription': {
                    'id': subscription.id if subscription else None,
                    'status': subscription.status if subscription else None,
                    'tier_name': tier.name if tier else None,
                    'trial_end_date': subscription.trial_end_date.isoformat() if subscription and subscription.trial_end_date else None
                } if subscription else None,
                'usage': usage_stats
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/audit-logs', methods=['GET'])
@jwt_required()
@super_admin_required
def get_all_audit_logs():
    """Get all audit logs (Super Admin only)"""
    try:
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        action = request.args.get('action')
        resource_type = request.args.get('resource_type')
        
        query = AuditLog.query
        
        if action:
            query = query.filter_by(action=action)
        if resource_type:
            query = query.filter_by(resource_type=resource_type)
        
        logs = query.order_by(AuditLog.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': log.id,
                    'organization_id': log.organization_id,
                    'user_id': log.user_id,
                    'action': log.action,
                    'resource_type': log.resource_type,
                    'resource_id': log.resource_id,
                    'old_values': log.old_values,
                    'new_values': log.new_values,
                    'ip_address': log.ip_address,
                    'created_at': log.created_at.isoformat()
                }
                for log in logs.items
            ],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': logs.total,
                'pages': logs.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@super_admin_required
def get_admin_stats():
    """Get admin dashboard statistics"""
    try:
        # Get total organizations
        total_organizations = Organization.query.count()
        active_organizations = Organization.query.filter_by(status='active').count()
        trial_organizations = Organization.query.filter_by(status='trial').count()
        suspended_organizations = Organization.query.filter_by(status='suspended').count()
        
        # Get total users
        total_users = User.query.count()
        business_managers = User.query.filter_by(role='business_manager').count()
        regional_managers = User.query.filter_by(role='regional_manager').count()
        customers = User.query.filter_by(role='customer').count()
        
        # Get total subscriptions
        total_subscriptions = Subscription.query.count()
        active_subscriptions = Subscription.query.filter_by(status='active').count()
        trial_subscriptions = Subscription.query.filter_by(status='trial').count()
        
        return jsonify({
            'data': {
                'organizations': {
                    'total': total_organizations,
                    'active': active_organizations,
                    'trial': trial_organizations,
                    'suspended': suspended_organizations
                },
                'users': {
                    'total': total_users,
                    'business_managers': business_managers,
                    'regional_managers': regional_managers,
                    'customers': customers
                },
                'subscriptions': {
                    'total': total_subscriptions,
                    'active': active_subscriptions,
                    'trial': trial_subscriptions
                }
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
