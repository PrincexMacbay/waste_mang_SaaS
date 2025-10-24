"""
Audit Logs Routes
Handles audit trail and compliance reporting
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, AuditLog, Organization, User
from utils.decorators import audit_log, business_manager_required
from datetime import datetime, timedelta

audit_logs_bp = Blueprint('audit_logs', __name__)

@audit_logs_bp.route('/', methods=['GET'])
@jwt_required()
@business_manager_required
def get_audit_logs():
    """Get audit logs for organization"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        action = request.args.get('action')
        resource_type = request.args.get('resource_type')
        user_id_filter = request.args.get('user_id')
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        query = AuditLog.query.filter_by(organization_id=user.organization_id)
        
        # Apply filters
        if action:
            query = query.filter_by(action=action)
        if resource_type:
            query = query.filter_by(resource_type=resource_type)
        if user_id_filter:
            query = query.filter_by(user_id=user_id_filter)
        if start_date:
            start_datetime = datetime.fromisoformat(start_date)
            query = query.filter(AuditLog.created_at >= start_datetime)
        if end_date:
            end_datetime = datetime.fromisoformat(end_date)
            query = query.filter(AuditLog.created_at <= end_datetime)
        
        logs = query.order_by(AuditLog.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': log.id,
                    'user_id': log.user_id,
                    'action': log.action,
                    'resource_type': log.resource_type,
                    'resource_id': log.resource_id,
                    'old_values': log.old_values,
                    'new_values': log.new_values,
                    'ip_address': log.ip_address,
                    'user_agent': log.user_agent,
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

@audit_logs_bp.route('/<log_id>', methods=['GET'])
@jwt_required()
@business_manager_required
def get_audit_log_detail(log_id):
    """Get detailed audit log information"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        log = AuditLog.query.filter_by(
            id=log_id,
            organization_id=user.organization_id
        ).first()
        
        if not log:
            return jsonify({'error': 'Audit log not found'}), 404
        
        # Get user information if available
        user_info = None
        if log.user_id:
            log_user = User.query.get(log.user_id)
            if log_user:
                user_info = {
                    'id': log_user.id,
                    'email': log_user.email,
                    'first_name': log_user.first_name,
                    'last_name': log_user.last_name,
                    'role': log_user.role
                }
        
        return jsonify({
            'data': {
                'id': log.id,
                'user': user_info,
                'action': log.action,
                'resource_type': log.resource_type,
                'resource_id': log.resource_id,
                'old_values': log.old_values,
                'new_values': log.new_values,
                'ip_address': log.ip_address,
                'user_agent': log.user_agent,
                'created_at': log.created_at.isoformat()
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@audit_logs_bp.route('/summary', methods=['GET'])
@jwt_required()
@business_manager_required
def get_audit_summary():
    """Get audit log summary statistics"""
    try:
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        # Get date range (last 30 days)
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=30)
        
        # Get total logs in period
        total_logs = AuditLog.query.filter(
            AuditLog.organization_id == user.organization_id,
            AuditLog.created_at >= start_date,
            AuditLog.created_at <= end_date
        ).count()
        
        # Get logs by action
        action_counts = db.session.query(
            AuditLog.action,
            db.func.count(AuditLog.id)
        ).filter(
            AuditLog.organization_id == user.organization_id,
            AuditLog.created_at >= start_date,
            AuditLog.created_at <= end_date
        ).group_by(AuditLog.action).all()
        
        # Get logs by user
        user_counts = db.session.query(
            AuditLog.user_id,
            User.first_name,
            User.last_name,
            db.func.count(AuditLog.id)
        ).join(User, AuditLog.user_id == User.id).filter(
            AuditLog.organization_id == user.organization_id,
            AuditLog.created_at >= start_date,
            AuditLog.created_at <= end_date
        ).group_by(AuditLog.user_id, User.first_name, User.last_name).all()
        
        # Get recent activity (last 7 days)
        recent_start = end_date - timedelta(days=7)
        recent_logs = AuditLog.query.filter(
            AuditLog.organization_id == user.organization_id,
            AuditLog.created_at >= recent_start,
            AuditLog.created_at <= end_date
        ).order_by(AuditLog.created_at.desc()).limit(10).all()
        
        return jsonify({
            'data': {
                'summary': {
                    'total_logs': total_logs,
                    'period': '30 days',
                    'start_date': start_date.isoformat(),
                    'end_date': end_date.isoformat()
                },
                'by_action': [
                    {'action': action, 'count': count}
                    for action, count in action_counts
                ],
                'by_user': [
                    {
                        'user_id': user_id,
                        'name': f"{first_name} {last_name}",
                        'count': count
                    }
                    for user_id, first_name, last_name, count in user_counts
                ],
                'recent_activity': [
                    {
                        'id': log.id,
                        'action': log.action,
                        'resource_type': log.resource_type,
                        'created_at': log.created_at.isoformat()
                    }
                    for log in recent_logs
                ]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@audit_logs_bp.route('/user/<user_id>', methods=['GET'])
@jwt_required()
@business_manager_required
def get_user_activity(user_id):
    """Get audit logs for a specific user"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get(current_user_id)
        
        if not current_user or not current_user.organization_id:
            return jsonify({'error': 'User not associated with any organization'}), 404
        
        # Verify the requested user belongs to the same organization
        target_user = User.query.filter_by(
            id=user_id,
            organization_id=current_user.organization_id
        ).first()
        
        if not target_user:
            return jsonify({'error': 'User not found in organization'}), 404
        
        page = request.args.get('page', 1, type=int)
        limit = request.args.get('limit', 50, type=int)
        
        logs = AuditLog.query.filter_by(
            organization_id=current_user.organization_id,
            user_id=user_id
        ).order_by(AuditLog.created_at.desc()).paginate(
            page=page, per_page=limit, error_out=False
        )
        
        return jsonify({
            'data': [
                {
                    'id': log.id,
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
