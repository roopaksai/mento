from flask import Flask, jsonify
from flask_cors import CORS
from models import Database
import os

# Initialize database
db = Database()

def create_app():
    """Create and configure Flask application"""
    app = Flask(__name__)
    
    # Enable CORS for all routes (allows React frontend to connect)
    CORS(app, origins=['http://localhost:3000'])  # React dev server
    
    # Configuration
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    app.config['DATABASE_PATH'] = 'database.db'
    
    # Register blueprints (routes)
    from routes.auth import auth_bp
    from routes.assessment import assessment_bp
    from routes.institution import institution_bp
    from routes.counselor import counselor_bp
    from routes.music import music_bp
    from routes.chatbot import chatbot_bp
    from routes.admin import admin_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(assessment_bp, url_prefix='/api/assessment')
    app.register_blueprint(institution_bp, url_prefix='/api/institution')
    app.register_blueprint(counselor_bp, url_prefix='/api/counselor')
    app.register_blueprint(music_bp, url_prefix='/api/music')
    app.register_blueprint(chatbot_bp, url_prefix='/api/chatbot')
    app.register_blueprint(admin_bp, url_prefix='/api')
    
    # Health check endpoint
    @app.route('/api/health')
    def health_check():
        """API health check"""
        return jsonify({
            'status': 'healthy',
            'message': 'Mental Wellness API is running',
            'version': '1.0.0'
        })
    
    # Root endpoint with API information
    @app.route('/api')
    def api_info():
        """API information endpoint"""
        return jsonify({
            'name': 'Mental Wellness API',
            'version': '1.0.0',
            'description': 'API for mental health assessment and support platform',
            'endpoints': {
                'auth': '/api/auth/login',
                'assessment': '/api/assessment/submit',
                'analysis': '/api/assessment/analysis/<user_id>',
                'institution': '/api/institution/check',
                'counselor': '/api/counselor/request',
                'music': '/api/music/recommendations/<severity_level>',
                'chatbot': '/api/chatbot/message'
            },
            'features': [
                'User authentication and session management',
                'Mental health assessment with PHQ-9/DASS-21 inspired questions',
                'Severity analysis and personalized recommendations',
                'Institution partnership integration',
                'Anonymous counselor request system',
                'Music therapy recommendations',
                'Supportive chatbot with crisis detection'
            ]
        })
    
    # Error handlers
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({'error': 'Endpoint not found'}), 404
    
    @app.errorhandler(500)
    def internal_error(error):
        return jsonify({'error': 'Internal server error'}), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    print("🚀 Starting Mental Wellness API Server...")
    print("📊 Database initialized")
    print("🔗 CORS enabled for React frontend")
    print("🏥 Institution partnerships configured")
    print("🤖 Chatbot with crisis detection ready")
    print("🎵 Music therapy recommendations available")
    print("📱 API endpoints ready at http://localhost:5000/api")
    print("\n" + "="*50)
    print("AVAILABLE ENDPOINTS:")
    print("="*50)
    print("GET    /api                     - API information")
    print("GET    /api/health              - Health check")
    print("POST   /api/auth/login          - User login/registration")
    print("POST   /api/assessment/submit   - Submit assessment")
    print("GET    /api/assessment/analysis/<user_id> - Get analysis")
    print("POST   /api/institution/check   - Check institution partnership")
    print("POST   /api/counselor/request   - Request counselor session")
    print("GET    /api/music/recommendations/<severity> - Music recommendations")
    print("POST   /api/chatbot/message     - Chat with support bot")
    print("GET    /api/admin/students      - Get all students (admin)")
    print("GET    /api/admin/assessments   - Get all assessments (admin)")
    print("GET    /api/admin/analytics     - Get analytics data (admin)")
    print("POST   /api/admin/create        - Create new admin user")
    print("="*50)
    print("🌐 Frontend should run on: http://localhost:3000")
    print("🔧 Backend running on: http://localhost:5000")
    print("\n💡 To test the API, visit: http://localhost:5000/api")
    
    # Run the application
    app.run(
        debug=True,  # Enable debug mode for development
        host='0.0.0.0',  # Allow external connections
        port=5000
    )