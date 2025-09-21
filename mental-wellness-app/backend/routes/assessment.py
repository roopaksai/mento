from flask import Blueprint, request, jsonify
from models import Assessment, User, Institution, CounselorRequest

assessment_bp = Blueprint('assessment', __name__)

@assessment_bp.route('/submit', methods=['POST'])
def submit_assessment():
    """Handle assessment submission"""
    try:
        data = request.get_json()
        user_id = data.get('userId')
        user_email = data.get('userEmail')
        answers = data.get('answers', {})
        
        # Validate input
        if not user_id or not user_email or not answers:
            return jsonify({'error': 'Missing required data'}), 400
        
        # Get database instance
        from app import db
        assessment_model = Assessment(db)
        institution_model = Institution(db)
        
        # Save assessment
        result = assessment_model.save_assessment(user_id, user_email, answers)
        
        # Check for high severity and institution partnership
        severity_level = result['severity_level']
        institution = institution_model.check_institution_by_email(user_email)
        
        response_data = {
            'assessmentId': result['assessment_id'],
            'totalScore': result['total_score'],
            'severityLevel': severity_level,
            'message': 'Assessment completed successfully'
        }
        
        # Handle high severity cases
        if severity_level == 'high':
            if institution:
                # Notify institution (in real app, send email/notification)
                response_data['institutionNotified'] = True
                response_data['institutionContact'] = institution['contact_email']
                response_data['message'] += f'. {institution["name"]} has been notified.'
            
            response_data['counselorRecommended'] = True
        
        return jsonify(response_data), 200
        
    except Exception as e:
        print(f"Assessment submission error: {str(e)}")
        return jsonify({'error': 'An error occurred while saving assessment'}), 500

@assessment_bp.route('/analysis/<user_id>', methods=['GET'])
def get_analysis(user_id):
    """Get user's assessment analysis"""
    try:
        from app import db
        assessment_model = Assessment(db)
        user_model = User(db)
        
        # Get user's latest assessment
        assessments = assessment_model.get_user_assessments(user_id)
        
        if not assessments:
            return jsonify({'error': 'No assessments found'}), 404
        
        latest_assessment = assessments[0]
        user = user_model.get_user_by_id(user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Prepare analysis data
        analysis_data = {
            'userId': user_id,
            'userName': user['name'],
            'totalScore': latest_assessment['total_score'],
            'severityLevel': latest_assessment['severity_level'],
            'completedAt': latest_assessment['completed_at'],
            'recommendations': get_recommendations(latest_assessment['severity_level'])
        }
        
        return jsonify(analysis_data), 200
        
    except Exception as e:
        print(f"Analysis retrieval error: {str(e)}")
        return jsonify({'error': 'An error occurred while retrieving analysis'}), 500

def get_recommendations(severity_level):
    """Get recommendations based on severity level"""
    recommendations = {
        'low': [
            'Continue your current self-care practices',
            'Maintain regular exercise and healthy sleep habits',
            'Stay connected with supportive friends and family'
        ],
        'moderate': [
            'Consider practicing mindfulness or meditation',
            'Try gentle physical activities like walking or yoga',
            'Reach out to trusted friends or family members',
            'Consider professional counseling if symptoms persist'
        ],
        'high': [
            'Strongly consider professional mental health support',
            'Reach out to a trusted healthcare provider',
            'Connect with crisis support if needed',
            'Consider our anonymous counselor matching service'
        ]
    }
    
    return recommendations.get(severity_level, recommendations['moderate'])