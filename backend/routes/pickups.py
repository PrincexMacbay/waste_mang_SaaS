"""
Pickup Management Routes
Handles waste pickup scheduling and tracking
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Pickup, Customer, Organization, User, Zone
from utils.decorators import audit_log, regional_manager_required
import uuid
from datetime import datetime, date, time

pickups_bp = Blueprint('pickups', __name__)

@pickups_bp.route('/schedule', methods=['GET'])
@jwt_required()
def get_pickups():
    """Get pickup schedule"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        status = request.args.get('status')
        
        query = Pickup.query.filter_by(organization_id=user.organization_id)
        
        if status:
            query = query.filter_by(status=status)
        
        pickups = query.order_by(Pickup.scheduled_date.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': pickup.id,
                    'customer_id': pickup.customer_id,
                    'zone_id': pickup.zone_id,
                    'scheduled_date': pickup.scheduled_date.isoformat(),
                    'scheduled_time': pickup.scheduled_time.isoformat(),
                    'pickup_type': pickup.pickup_type,
                    'status': pickup.status,
                    'actual_pickup_time': pickup.actual_pickup_time.isoformat() if pickup.actual_pickup_time else None,
                    'notes': pickup.notes,
                    'created_at': pickup.created_at.isoformat()
                }
                for pickup in pickups.items
            ],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': pickups.total,
                'pages': pickups.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pickups_bp.route('/schedule', methods=['POST'])
@jwt_required()
@regional_manager_required
@audit_log('pickup_creation', 'pickup')
def create_pickup():
    """Create new pickup schedule"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['customer_id', 'scheduled_date', 'pickup_time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Check if customer exists
        customer = Customer.query.filter_by(
            id=data['customer_id'],
            organization_id=user.organization_id
        ).first()
        
        if not customer:
            return jsonify({'error': 'Customer not found'}), 404
        
        # Create pickup
        pickup = Pickup(
            id=str(uuid.uuid4()),
            organization_id=user.organization_id,
            customer_id=data['customer_id'],
            zone_id=data.get('zone_id'),
            scheduled_date=datetime.strptime(data['scheduled_date'], '%Y-%m-%d').date(),
            scheduled_time=datetime.strptime(data['pickup_time'], '%H:%M').time(),
            pickup_type=data.get('pickup_type', 'regular'),
            notes=data.get('notes'),
            created_by=user_id
        )
        
        db.session.add(pickup)
        db.session.commit()
        
        return jsonify({
            'message': 'Pickup scheduled successfully',
            'data': {
                'id': pickup.id,
                'scheduled_date': pickup.scheduled_date.isoformat(),
                'scheduled_time': pickup.scheduled_time.isoformat(),
                'status': pickup.status
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pickups_bp.route('/upcoming', methods=['GET'])
@jwt_required()
def get_upcoming_pickups():
    """Get upcoming pickups"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        today = date.today()
        
        pickups = Pickup.query.filter(
            Pickup.organization_id == user.organization_id,
            Pickup.scheduled_date >= today,
            Pickup.status.in_(['scheduled', 'in_progress'])
        ).order_by(Pickup.scheduled_date.asc(), Pickup.scheduled_time.asc()).limit(10).all()
        
        return jsonify({
            'data': [
                {
                    'id': pickup.id,
                    'customer_id': pickup.customer_id,
                    'zone_id': pickup.zone_id,
                    'scheduled_date': pickup.scheduled_date.isoformat(),
                    'scheduled_time': pickup.scheduled_time.isoformat(),
                    'pickup_type': pickup.pickup_type,
                    'status': pickup.status,
                    'notes': pickup.notes
                }
                for pickup in pickups
            ]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pickups_bp.route('/<pickup_id>/status', methods=['PUT'])
@jwt_required()
@regional_manager_required
@audit_log('pickup_status_update', 'pickup')
def update_pickup_status(pickup_id):
    """Update pickup status"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        pickup = Pickup.query.filter_by(
            id=pickup_id,
            organization_id=user.organization_id
        ).first()
        
        if not pickup:
            return jsonify({'error': 'Pickup not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        pickup.status = new_status
        
        if new_status == 'completed':
            pickup.actual_pickup_time = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Pickup status updated successfully',
            'data': {
                'id': pickup.id,
                'status': pickup.status,
                'actual_pickup_time': pickup.actual_pickup_time.isoformat() if pickup.actual_pickup_time else None
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
