from flask import Blueprint, request, jsonify
from models import CounselorRequest, Assessment

counselor_bp = Blueprint('counselor', __name__)

@counselor_bp.route('/request', methods=['POST'])
def request_counselor():
    """Create counselor session request"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        anonymous_data = data.get('anonymousData', {})
        
        if not user_id:
            return jsonify({'error': 'User ID is required'}), 400
        
        from app import db
        counselor_model = CounselorRequest(db)
        assessment_model = Assessment(db)
        
        # Get user's latest assessment
        assessments = assessment_model.get_user_assessments(user_id)
        
        if not assessments:
            return jsonify({'error': 'No assessment found for counselor request'}), 404
        
        latest_assessment = assessments[0]
        
        # Create counselor request
        request_id = counselor_model.create_request(
            user_id=user_id,
            assessment_id=latest_assessment['id'],
            severity_level=latest_assessment['severity_level'],
            anonymous_data=anonymous_data
        )
        
        # In real implementation, this would trigger:
        # 1. Email notification to partner institution
        # 2. Anonymous chat session setup
        # 3. Counselor assignment system
        
        return jsonify({
            'requestId': request_id,
            'status': 'pending',
            'message': 'Counselor request submitted successfully. You will be contacted soon.',
            'estimatedWaitTime': '24-48 hours'
        }), 200
        
    except Exception as e:
        print(f"Counselor request error: {str(e)}")
        return jsonify({'error': 'An error occurred while processing request'}), 500