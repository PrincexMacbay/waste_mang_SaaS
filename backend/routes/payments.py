"""
Payment Management Routes
Handles payment processing and transaction history
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Payment, Customer, Organization, User, Invoice
from utils.decorators import audit_log
import uuid
from datetime import datetime

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/transactions', methods=['GET'])
@jwt_required()
def get_transactions():
    """Get payment transactions"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 20, type=int)
        status = request.args.get('status')
        
        query = Payment.query.filter_by(organization_id=user.organization_id)
        
        if user.role == 'customer':
            query = query.filter_by(customer_id=user.id)
        
        if status:
            query = query.filter_by(status=status)
        
        payments = query.order_by(Payment.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': payment.id,
                    'customer_id': payment.customer_id,
                    'invoice_id': payment.invoice_id,
                    'amount': float(payment.amount),
                    'currency': payment.currency,
                    'payment_method': payment.payment_method,
                    'payment_reference': payment.payment_reference,
                    'status': payment.status,
                    'processed_at': payment.processed_at.isoformat() if payment.processed_at else None,
                    'created_at': payment.created_at.isoformat()
                }
                for payment in payments.items
            ],
            'pagination': {
                'page': page,
                'limit': limit,
                'total': payments.total,
                'pages': payments.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/make-payment', methods=['POST'])
@jwt_required()
@audit_log('payment_creation', 'payment')
def make_payment():
    """Process a payment"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['amount', 'payment_method']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'{field} is required'}), 400
        
        # Create payment
        payment = Payment(
            id=str(uuid.uuid4()),
            organization_id=user.organization_id,
            customer_id=user.id if user.role == 'customer' else None,
            invoice_id=data.get('invoice_id'),
            amount=data['amount'],
            currency=data.get('currency', 'NGN'),
            payment_method=data['payment_method'],
            payment_reference=data.get('payment_reference'),
            status='pending'
        )
        
        db.session.add(payment)
        db.session.commit()
        
        # In a real implementation, you would integrate with payment gateway here
        # For demo purposes, we'll simulate successful payment
        payment.status = 'completed'
        payment.processed_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Payment processed successfully',
            'data': {
                'id': payment.id,
                'amount': float(payment.amount),
                'currency': payment.currency,
                'payment_method': payment.payment_method,
                'status': payment.status,
                'processed_at': payment.processed_at.isoformat()
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@payments_bp.route('/<payment_id>/status', methods=['PUT'])
@jwt_required()
@audit_log('payment_status_update', 'payment')
def update_payment_status(payment_id):
    """Update payment status"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        payment = Payment.query.filter_by(
            id=payment_id,
            organization_id=user.organization_id
        ).first()
        
        if not payment:
            return jsonify({'error': 'Payment not found'}), 404
        
        data = request.get_json()
        new_status = data.get('status')
        
        if not new_status:
            return jsonify({'error': 'Status is required'}), 400
        
        payment.status = new_status
        
        if new_status == 'completed':
            payment.processed_at = datetime.utcnow()
        
        db.session.commit()
        
        return jsonify({
            'message': 'Payment status updated successfully',
            'data': {
                'id': payment.id,
                'status': payment.status,
                'processed_at': payment.processed_at.isoformat() if payment.processed_at else None
            }
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
