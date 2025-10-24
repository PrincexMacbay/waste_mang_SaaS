"""
Custom Decorators for Authentication and Authorization
"""

from functools import wraps
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import User, AuditLog
from datetime import datetime
import json

def audit_log(action, resource_type):
    """Decorator to log user actions"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                # Execute the function first
                result = f(*args, **kwargs)
                
                # Log the action
                user_id = get_jwt_identity()
                if user_id:
                    user = User.query.get(user_id)
                    if user and user.organization_id:
                        audit_entry = AuditLog(
                            id=str(uuid.uuid4()),
                            organization_id=user.organization_id,
                            user_id=user_id,
                            action=action,
                            resource_type=resource_type,
                            ip_address=request.remote_addr,
                            user_agent=request.headers.get('User-Agent')
                        )
                        db.session.add(audit_entry)
                        db.session.commit()
                
                return result
            except Exception as e:
                # Log the error
                if user_id:
                    user = User.query.get(user_id)
                    if user and user.organization_id:
                        audit_entry = AuditLog(
                            id=str(uuid.uuid4()),
                            organization_id=user.organization_id,
                            user_id=user_id,
                            action=f"{action}_error",
                            resource_type=resource_type,
                            ip_address=request.remote_addr,
                            user_agent=request.headers.get('User-Agent'),
                            new_values={'error': str(e)}
                        )
                        db.session.add(audit_entry)
                        db.session.commit()
                raise e
        return decorated_function
    return decorator

def org_required(f):
    """Decorator to ensure user belongs to an organization"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or not user.organization_id:
            return jsonify({'error': 'User must belong to an organization'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def super_admin_required(f):
    """Decorator to ensure user is a super admin"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role != 'super_admin':
            return jsonify({'error': 'Super admin access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def business_manager_required(f):
    """Decorator to ensure user is a business manager"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['super_admin', 'business_manager']:
            return jsonify({'error': 'Business manager access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def regional_manager_required(f):
    """Decorator to ensure user is a regional manager"""
    @wraps(f)
    @jwt_required()
    def decorated_function(*args, **kwargs):
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        
        if not user or user.role not in ['super_admin', 'business_manager', 'regional_manager']:
            return jsonify({'error': 'Regional manager access required'}), 403
        
        return f(*args, **kwargs)
    return decorated_function

def check_permission(permission):
    """Decorator to check specific permissions"""
    def decorator(f):
        @wraps(f)
        @jwt_required()
        def decorated_function(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            
            if not user:
                return jsonify({'error': 'User not found'}), 404
            
            # Super admin has all permissions
            if user.role == 'super_admin':
                return f(*args, **kwargs)
            
            # Check user permissions
            user_permissions = user.permissions or {}
            if not user_permissions.get(permission, False):
                return jsonify({'error': f'Permission {permission} required'}), 403
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator
