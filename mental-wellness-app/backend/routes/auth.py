from flask import Blueprint, request, jsonify
from models import User, Institution
import re

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """Handle user login/registration"""
    try:
        data = request.get_json()
        name = data.get('name', '').strip()
        email = data.get('email', '').strip().lower()
        
        # Validate input
        if not name or not email:
            return jsonify({'error': 'Name and email are required'}), 400
        
        # Validate email format
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Get database instance (this will be injected by main app)
        from app import db
        user_model = User(db)
        institution_model = Institution(db)
        
        # Create or get user
        user_id = user_model.create_or_get_user(name, email)
        
        # Check if user is admin
        is_admin = user_model.is_admin(email)
        
        # Check if user belongs to partner institution
        institution = institution_model.check_institution_by_email(email)
        
        response_data = {
            'userId': user_id,
            'name': name,
            'email': email,
            'isAdmin': is_admin,
            'message': 'Login successful'
        }
        
        # Add institution info if applicable
        if institution:
            response_data['institution'] = {
                'name': institution['name'],
                'domain': institution['domain'],
                'contact_email': institution['contact_email']
            }
            response_data['message'] = f'Welcome! We see you\'re from {institution["name"]}'
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Login error: {str(e)}")
        return jsonify({'error': 'An error occurred during login'}), 500