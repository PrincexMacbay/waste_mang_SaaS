"""
Customer Management Routes
Handles end user (customer) operations
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Customer, Organization, User, Notification
from utils.decorators import audit_log, regional_manager_required
import uuid
from datetime import datetime

customers_bp = Blueprint('customers', __name__)

@customers_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_customer_profile():
    """Get current customer profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403
        
        customer = Customer.query.filter_by(organization_id=user.organization_id).first()
        if not customer:
            return jsonify({'error': 'Customer profile not found'}), 404
        
        return jsonify({
            'data': {
                'id': customer.id,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'email': customer.email,
                'phone': customer.phone,
                'address': customer.address,
                'house_type': customer.house_type,
                'number_of_flats': customer.number_of_flats,
                'number_of_occupants': customer.number_of_occupants,
                'monthly_fee': float(customer.monthly_fee),
                'pickup_frequency': customer.pickup_frequency,
                'service_start_date': customer.service_start_date.isoformat() if customer.service_start_date else None,
                'service_end_date': customer.service_end_date.isoformat() if customer.service_end_date else None,
                'status': customer.status,
                'created_at': customer.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@customers_bp.route('/profile', methods=['PUT'])
@jwt_required()
@audit_log('customer_profile_update', 'customer')
def update_customer_profile():
    """Update customer profile"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403
        
        customer = Customer.query.filter_by(organization_id=user.organization_id).first()
        if not customer:
            return jsonify({'error': 'Customer profile not found'}), 404
        
        data = request.get_json()
        
        # Update customer fields
        if 'first_name' in data:
            customer.first_name = data['first_name']
        if 'last_name' in data:
            customer.last_name = data['last_name']
        if 'phone' in data:
            customer.phone = data['phone']
        if 'address' in data:
            customer.address = data['address']
        if 'house_type' in data:
            customer.house_type = data['house_type']
        if 'number_of_flats' in data:
            customer.number_of_flats = data['number_of_flats']
        if 'number_of_occupants' in data:
            customer.number_of_occupants = data['number_of_occupants']
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully',
            'data': {
                'id': customer.id,
                'first_name': customer.first_name,
                'last_name': customer.last_name,
                'email': customer.email,
                'phone': customer.phone,
                'address': customer.address
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@customers_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    """Get customer notifications"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        
        notifications = Notification.query.filter_by(
            organization_id=user.organization_id,
            customer_id=user.id
        ).order_by(Notification.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': notif.id,
                    'title': notif.title,
                    'message': notif.message,
                    'type': notif.type,
                    'priority': notif.priority,
                    'is_read': notif.is_read,
                    'read_at': notif.read_at.isoformat() if notif.read_at else None,
                    'created_at': notif.created_at.isoformat()
                }
                for notif in notifications.items
            ],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': notifications.total,
                'pages': notifications.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@customers_bp.route('/notifications/<int:notification_id>/read', methods=['PUT'])
@jwt_required()
@audit_log('notification_read', 'notification')
def mark_notification_read(notification_id):
    """Mark notification as read"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'customer':
            return jsonify({'error': 'Customer access required'}), 403
        
        notification = Notification.query.filter_by(
            id=notification_id,
            organization_id=user.organization_id,
            customer_id=user.id
        ).first()
        
        if not notification:
            return jsonify({'error': 'Notification not found'}), 404
        
        notification.is_read = True
        notification.read_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Notification marked as read',
            'data': {
                'id': notification.id,
                'is_read': notification.is_read,
                'read_at': notification.read_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
