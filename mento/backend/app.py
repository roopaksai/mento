from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import os
import json
import random

# Initialize Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///mental_wellness.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'jwt-secret-string-change-in-production'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=24)

# Initialize extensions
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    age = db.Column(db.Integer)
    is_student = db.Column(db.Boolean, default=False)
    institution_id = db.Column(db.Integer, db.ForeignKey('institution.id'), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    test_responses = db.relationship('TestResponse', backref='user', lazy=True)
    chat_messages = db.relationship('ChatMessage', backref='user', lazy=True)

class Institution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    type = db.Column(db.String(50), nullable=False)  # school, college, company
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    address = db.Column(db.Text)
    contact_person = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    counselors_available = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    users = db.relationship('User', backref='institution', lazy=True)
    counselor_requests = db.relationship('CounselorRequest', backref='institution', lazy=True)

class TestResponse(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    responses = db.Column(db.Text, nullable=False)  # JSON string of responses
    total_score = db.Column(db.Integer, nullable=False)
    severity_level = db.Column(db.String(20), nullable=False)  # low, moderate, high
    recommendations = db.Column(db.Text)  # JSON string of recommendations
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class CounselorRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    institution_id = db.Column(db.Integer, db.ForeignKey('institution.id'), nullable=False)
    test_response_id = db.Column(db.Integer, db.ForeignKey('test_response.id'), nullable=False)
    message = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')  # pending, assigned, completed
    priority = db.Column(db.String(10), default='normal')  # low, normal, high, urgent
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', backref='counselor_requests')
    test_response = db.relationship('TestResponse', backref='counselor_requests')

class ChatMessage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column(db.Text, nullable=False)
    response = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Helper Functions
def analyze_test_responses(responses):
    """Analyze test responses and calculate severity level"""
    total_score = sum(responses.values())
    max_possible_score = len(responses) * 4  # Assuming 0-4 scale
    
    # Calculate percentage
    percentage = (total_score / max_possible_score) * 100
    
    # Determine severity level
    if percentage <= 25:
        severity = 'low'
    elif percentage <= 60:
        severity = 'moderate'
    else:
        severity = 'high'
    
    return total_score, severity

def generate_recommendations(severity_level, user):
    """Generate personalized recommendations based on severity and user profile"""
    base_recommendations = {
        'low': [
            "Continue practicing self-care routines",
            "Maintain regular exercise and healthy eating",
            "Consider meditation or mindfulness apps",
            "Stay connected with friends and family",
            "Engage in hobbies you enjoy"
        ],
        'moderate': [
            "Consider speaking with a counselor or therapist",
            "Practice stress management techniques",
            "Establish a consistent sleep schedule",
            "Limit caffeine and alcohol intake",
            "Try journaling or creative expression",
            "Consider joining support groups"
        ],
        'high': [
            "Seek immediate professional mental health support",
            "Contact your institution's counseling services",
            "Consider speaking with a trusted friend or family member",
            "Practice grounding techniques when feeling overwhelmed",
            "Avoid isolation - stay connected with others",
            "Emergency resources are available 24/7"
        ]
    }
    
    recommendations = base_recommendations.get(severity_level, [])
    
    # Add institution-specific recommendations if user is affiliated
    if user.institution_id and severity_level in ['moderate', 'high']:
        recommendations.append("Your institution has been notified and counseling support will be offered")
    
    return recommendations

def generate_chat_response(message, user_id):
    """Generate contextual chat responses"""
    message_lower = message.lower()
    
    # Emotional keyword detection
    if any(word in message_lower for word in ['sad', 'depressed', 'down', 'upset']):
        responses = [
            "I hear that you're feeling sad. It's okay to have these feelings, and I'm here with you. Would you like to talk about what's making you feel this way?",
            "Sadness is a natural human emotion. You're not alone in feeling this way. What's one small thing that usually brings you comfort?",
            "Thank you for sharing how you're feeling. It takes courage to express sadness. How can I best support you right now?"
        ]
    elif any(word in message_lower for word in ['anxious', 'worried', 'nervous', 'stress']):
        responses = [
            "Anxiety can feel overwhelming, but you're safe right now. Let's try taking three deep breaths together. What's on your mind?",
            "I understand you're feeling anxious. That's a very common experience. Would you like to try a grounding exercise or talk about what's worrying you?",
            "Stress and worry are challenging to deal with. Remember, you've gotten through difficult times before. What usually helps you feel calmer?"
        ]
    elif any(word in message_lower for word in ['happy', 'good', 'great', 'better']):
        responses = [
            "That's wonderful to hear! I'm so glad you're feeling good. What's been going well for you?",
            "It's great that you're feeling positive! These moments are important to celebrate. What's bringing you joy today?",
            "I love hearing when you're doing well! Positive emotions are just as important to acknowledge as difficult ones."
        ]
    elif any(word in message_lower for word in ['help', 'support', 'advice']):
        responses = [
            "I'm here to help! I can listen, suggest coping strategies, share relaxation techniques, or just be here with you. What would be most helpful?",
            "There are many ways I can support you. We could talk through your feelings, practice some wellness techniques, or I can just listen. What sounds good?",
            "I'm glad you're reaching out for support. That's a sign of strength. How would you like me to help you today?"
        ]
    else:
        # General supportive responses
        responses = [
            "Thank you for sharing that with me. Your feelings are valid and important. Can you tell me more about what's on your mind?",
            "I hear you, and I'm here to listen without judgment. What would help you feel supported right now?",
            "That sounds like it's on your mind. I'm here to listen and support you through whatever you're experiencing.",
            "Every feeling you have matters. You don't have to go through this alone. What's one thing that might help you feel a little better today?"
        ]
    
    return random.choice(responses)

# Routes

@app.route('/api/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['email', 'name', 'password']
        if not all(field in data for field in required_fields):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'User with this email already exists'}), 400
        
        # Hash password
        password_hash = generate_password_hash(data['password'])
        
        # Create new user
        user = User(
            email=data['email'],
            name=data['name'],
            password_hash=password_hash,
            age=data.get('age'),
            is_student=data.get('is_student', False)
        )
        
        # If user is a student, try to match with institution
        if user.is_student and 'institution_email' in data:
            institution = Institution.query.filter_by(email=data['institution_email']).first()
            if institution:
                user.institution_id = institution.id
        
        db.session.add(user)
        db.session.commit()
        
        # Create access token
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'User registered successfully',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'is_student': user.is_student,
                'institution': user.institution.name if user.institution else None
            }
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password required'}), 400
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user or not check_password_hash(user.password_hash, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401
        
        access_token = create_access_token(identity=user.id)
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'is_student': user.is_student,
                'institution': user.institution.name if user.institution else None
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test/submit', methods=['POST'])
@jwt_required()
def submit_test():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        data = request.get_json()
        responses = data.get('responses', {})
        
        if not responses:
            return jsonify({'error': 'No responses provided'}), 400
        
        # Analyze responses
        total_score, severity_level = analyze_test_responses(responses)
        recommendations = generate_recommendations(severity_level, user)
        
        # Save test response
        test_response = TestResponse(
            user_id=current_user_id,
            responses=json.dumps(responses),
            total_score=total_score,
            severity_level=severity_level,
            recommendations=json.dumps(recommendations)
        )
        
        db.session.add(test_response)
        db.session.commit()
        
        # If severity is high and user has institution, create counselor request
        if severity_level == 'high' and user.institution_id:
            counselor_request = CounselorRequest(
                user_id=current_user_id,
                institution_id=user.institution_id,
                test_response_id=test_response.id,
                message=f"High severity mental health assessment for {user.name}. Immediate support recommended.",
                priority='urgent'
            )
            db.session.add(counselor_request)
            db.session.commit()
        
        return jsonify({
            'message': 'Test submitted successfully',
            'test_id': test_response.id,
            'severity_level': severity_level,
            'total_score': total_score,
            'recommendations': recommendations,
            'counselor_requested': severity_level == 'high' and user.institution_id is not None
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/test/results/<int:test_id>', methods=['GET'])
@jwt_required()
def get_test_results(test_id):
    try:
        current_user_id = get_jwt_identity()
        
        test_response = TestResponse.query.filter_by(
            id=test_id, 
            user_id=current_user_id
        ).first()
        
        if not test_response:
            return jsonify({'error': 'Test results not found'}), 404
        
        return jsonify({
            'test_id': test_response.id,
            'total_score': test_response.total_score,
            'severity_level': test_response.severity_level,
            'recommendations': json.loads(test_response.recommendations),
            'created_at': test_response.created_at.isoformat(),
            'responses': json.loads(test_response.responses)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/counselor/request', methods=['POST'])
@jwt_required()
def request_counselor():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        if not user.institution_id:
            return jsonify({'error': 'No institution associated with your account'}), 400
        
        data = request.get_json()
        test_response_id = data.get('test_response_id')
        message = data.get('message', 'User has requested counselor support')
        
        # Verify test response belongs to user
        test_response = TestResponse.query.filter_by(
            id=test_response_id,
            user_id=current_user_id
        ).first()
        
        if not test_response:
            return jsonify({'error': 'Test response not found'}), 404
        
        # Create counselor request
        counselor_request = CounselorRequest(
            user_id=current_user_id,
            institution_id=user.institution_id,
            test_response_id=test_response_id,
            message=message,
            priority='high' if test_response.severity_level == 'high' else 'normal'
        )
        
        db.session.add(counselor_request)
        db.session.commit()
        
        return jsonify({
            'message': 'Counselor request submitted successfully',
            'request_id': counselor_request.id,
            'institution': user.institution.name,
            'priority': counselor_request.priority
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/send', methods=['POST'])
@jwt_required()
def send_chat_message():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()
        
        user_message = data.get('message', '').strip()
        if not user_message:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        # Generate response
        bot_response = generate_chat_response(user_message, current_user_id)
        
        # Save chat message
        chat_message = ChatMessage(
            user_id=current_user_id,
            message=user_message,
            response=bot_response
        )
        
        db.session.add(chat_message)
        db.session.commit()
        
        return jsonify({
            'message': bot_response,
            'timestamp': datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat/history', methods=['GET'])
@jwt_required()
def get_chat_history():
    try:
        current_user_id = get_jwt_identity()
        
        # Get last 50 messages
        messages = ChatMessage.query.filter_by(
            user_id=current_user_id
        ).order_by(ChatMessage.created_at.desc()).limit(50).all()
        
        # Format messages for frontend
        formatted_messages = []
        for msg in reversed(messages):  # Reverse to show chronological order
            formatted_messages.extend([
                {
                    'id': f"{msg.id}_user",
                    'message': msg.message,
                    'sender': 'user',
                    'timestamp': msg.created_at.isoformat()
                },
                {
                    'id': f"{msg.id}_bot",
                    'message': msg.response,
                    'sender': 'bot',
                    'timestamp': msg.created_at.isoformat()
                }
            ])
        
        return jsonify(formatted_messages), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/institutions', methods=['GET'])
def get_institutions():
    try:
        institutions = Institution.query.filter_by(is_active=True).all()
        
        institution_list = []
        for institution in institutions:
            institution_list.append({
                'id': institution.id,
                'name': institution.name,
                'type': institution.type,
                'email': institution.email,
                'counselors_available': institution.counselors_available
            })
        
        return jsonify(institution_list), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        # Get user's test history
        test_count = TestResponse.query.filter_by(user_id=current_user_id).count()
        latest_test = TestResponse.query.filter_by(
            user_id=current_user_id
        ).order_by(TestResponse.created_at.desc()).first()
        
        profile_data = {
            'id': user.id,
            'email': user.email,
            'name': user.name,
            'age': user.age,
            'is_student': user.is_student,
            'institution': user.institution.name if user.institution else None,
            'member_since': user.created_at.isoformat(),
            'test_count': test_count,
            'latest_test': {
                'severity_level': latest_test.severity_level,
                'date': latest_test.created_at.isoformat()
            } if latest_test else None
        }
        
        return jsonify(profile_data), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Initialize database
def create_tables():
    """Initialize database tables and add sample data"""
    with app.app_context():
        db.create_all()
        
        # Add sample institutions if none exist
        if Institution.query.count() == 0:
            sample_institutions = [
                Institution(
                    name="Delhi University",
                    type="college",
                    email="counseling@du.ac.in",
                    phone="+91-11-2766-7010",
                    contact_person="Dr. Priya Sharma",
                    counselors_available=15
                ),
                Institution(
                    name="IIT Delhi",
                    type="college",
                    email="wellness@iitd.ac.in",
                    phone="+91-11-2659-1000",
                    contact_person="Dr. Rajesh Kumar",
                    counselors_available=8
                ),
                Institution(
                    name="Kendriya Vidyalaya Sector 8",
                    type="school",
                    email="counselor@kv8rohini.edu.in",
                    phone="+91-11-2755-8964",
                    contact_person="Ms. Sunita Verma",
                    counselors_available=3
                ),
                Institution(
                    name="Infosys Limited",
                    type="company",
                    email="employee.wellness@infosys.com",
                    phone="+91-80-2852-0261",
                    contact_person="Hr. Wellness Team",
                    counselors_available=20
                )
            ]
            
            for institution in sample_institutions:
                db.session.add(institution)
            
            db.session.commit()

if __name__ == '__main__':
    # Initialize database before running the app
    create_tables()
    app.run(debug=True, port=5000)