from flask import Blueprint, request, jsonify
from models import Institution

institution_bp = Blueprint('institution', __name__)

@institution_bp.route('/check', methods=['POST'])
def check_institution():
    """Check if email belongs to partner institution"""
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        from app import db
        institution_model = Institution(db)
        
        institution = institution_model.check_institution_by_email(email)
        
        if institution:
            return jsonify({
                'isPartner': True,
                'institution': {
                    'name': institution['name'],
                    'domain': institution['domain'],
                    'contact_email': institution['contact_email']
                }
            }), 200
        else:
            return jsonify({'isPartner': False}), 200
        
    except Exception as e:
        print(f"Institution check error: {str(e)}")
        return jsonify({'error': 'An error occurred while checking institution'}), 500