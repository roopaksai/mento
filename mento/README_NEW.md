# Mento - Mental Wellness Platform

A comprehensive mental wellness platform built with React.js frontend and Flask backend, featuring mental health assessments, AI chatbot support, institutional partnerships, and counselor request systems.

## 🌟 Features

### For Individual Users
- **Mental Health Assessment**: Comprehensive questionnaire based on PHQ-9 and DASS-21 standards
- **Severity Analysis**: Automated scoring with low/moderate/high risk categorization
- **AI Chatbot Companion**: Empathetic chat support with contextual responses
- **Music Therapy**: Curated music recommendations and motivational content
- **Personalized Recommendations**: Tailored wellness suggestions based on assessment results

### For Institutions (Schools, Colleges, Companies)
- **Student/Employee Monitoring**: Anonymous wellness tracking for affiliated users
- **Counselor Dashboard**: Request management system for mental health professionals
- **Emergency Alerts**: Automatic notifications for high-risk cases
- **Analytics**: Institution-wide mental health metrics and reporting
- **Priority Management**: Urgent case escalation and assignment system

### Security & Privacy
- **Anonymous Support**: Optional anonymous counselor requests
- **JWT Authentication**: Secure user authentication and session management
- **Data Protection**: GDPR-compliant data handling and storage
- **Crisis Integration**: 24/7 crisis hotline information and emergency protocols

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+ recommended)
- Python 3.8+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd mento
```

2. **Setup Frontend**
```bash
cd frontend
npm install
```

3. **Setup Backend**
```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

4. **Environment Configuration**

Create `.env` file in backend directory:
```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///mental_wellness.db
```

5. **Start the Application**

Backend (Terminal 1):
```bash
cd backend
python app.py
```

Frontend (Terminal 2):
```bash
cd frontend
npm start
```

6. **Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📁 Project Structure

```
mento/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   └── LoadingSpinner.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # James Bond themed login
│   │   │   ├── TestPage.js           # Mental health assessment
│   │   │   ├── ResultsPage.js        # Assessment results & recommendations
│   │   │   ├── MusicPage.js          # Music therapy & motivation
│   │   │   ├── ChatbotPage.js        # AI companion chat
│   │   │   └── InstitutionDashboard.js # Counselor management
│   │   ├── utils/
│   │   │   ├── api.js               # API integration
│   │   │   ├── auth.js              # Authentication utilities
│   │   │   └── questions.js         # Assessment questions database
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── tailwind.config.js
├── backend/
│   ├── app.py                       # Flask application
│   ├── requirements.txt             # Python dependencies
│   └── README.md                    # Backend documentation
└── README.md                        # This file
```

## 🎯 User Flow

### Student/Employee Journey
1. **Registration**: Sign up with email, optionally link to institution
2. **Assessment**: Complete mental health questionnaire (10-15 questions)
3. **Results**: View severity level, personalized recommendations
4. **Support**: Access AI chatbot, music therapy, or request counselor
5. **Follow-up**: Track progress with subsequent assessments

### Institution Counselor Journey
1. **Dashboard Access**: View pending support requests
2. **Priority Management**: Handle urgent cases first
3. **Student Support**: Assign counselors to requests
4. **Analytics**: Monitor institution-wide mental health trends
5. **Crisis Response**: Emergency protocol activation for high-risk cases

## 🔧 Technology Stack

### Frontend
- **React 18.2.0**: Modern UI library with hooks
- **React Router**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API calls

### Backend
- **Flask**: Lightweight Python web framework
- **SQLAlchemy**: Database ORM
- **Flask-JWT-Extended**: JWT authentication
- **Flask-CORS**: Cross-origin resource sharing
- **SQLite**: Database (development)

### Key Libraries
- **Werkzeug**: Password hashing and security
- **python-dotenv**: Environment variable management

## 📊 API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login

### Mental Health Assessment
- `POST /api/test/submit` - Submit assessment responses
- `GET /api/test/results/<test_id>` - Get assessment results

### Chat System
- `POST /api/chat/send` - Send message to AI chatbot
- `GET /api/chat/history` - Retrieve chat conversation history

### Counselor Services
- `POST /api/counselor/request` - Request professional support
- `GET /api/institution/requests` - Get counselor requests (dashboard)
- `PATCH /api/institution/requests/<id>` - Update request status

### User Management
- `GET /api/user/profile` - Get user profile information
- `GET /api/institutions` - List available institutional partners

## 🏥 Institution Integration

### Supported Institution Types
- **Schools**: K-12 educational institutions
- **Colleges**: Universities and higher education
- **Companies**: Corporate employee wellness programs

### Partnership Benefits
- Automatic counselor alerts for high-risk assessments
- Anonymous student/employee wellness monitoring
- Professional counselor assignment system
- Institution-wide mental health analytics
- Crisis intervention protocols

### Sample Partner Institutions
- Delhi University (15 counselors available)
- IIT Delhi (8 counselors available)
- Kendriya Vidyalaya Sector 8 (3 counselors available)
- Infosys Limited (20 counselors available)

## 🎨 Design Features

### User Experience
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Accessibility**: Screen reader friendly with proper ARIA labels
- **Progressive Loading**: Smooth transitions and loading states
- **Intuitive Navigation**: Clear user flow with visual feedback

### Visual Design
- **Calming Colors**: Gentle gradients and mental wellness-focused palette
- **Engaging Animations**: Subtle animations for better user engagement
- **Consistent Iconography**: Emoji-based icons for universal understanding
- **Professional UI**: Clean, modern interface suitable for institutional use

## 🔐 Security & Privacy

### Data Protection
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Werkzeug secure password storage
- **Anonymous Options**: Privacy-focused counselor requests
- **CORS Protection**: Secure cross-origin request handling

### Privacy Features
- Anonymous assessment options
- Secure data transmission
- Minimal personal data collection
- Right to data deletion
- Institutional data segregation

## 📈 Mental Health Assessment

### Assessment Framework
- **Question Base**: Inspired by PHQ-9 and DASS-21 standards
- **Scoring System**: 0-4 scale per question
- **Severity Levels**: Low (0-25%), Moderate (26-60%), High (61-100%)
- **Recommendations**: Personalized based on severity and user profile

### Question Categories
- Mood and emotional state
- Anxiety and stress levels
- Sleep and energy patterns
- Social interaction and isolation
- Academic/work performance impact
- Coping mechanisms and support systems

## 🤖 AI Chatbot Features

### Conversation Capabilities
- **Emotional Recognition**: Keyword-based emotion detection
- **Contextual Responses**: Situational appropriate replies
- **Crisis Keywords**: Emergency response triggers
- **Supportive Language**: Empathetic and non-judgmental communication
- **Resource Suggestions**: Coping techniques and professional help guidance

### Safety Features
- Crisis hotline information display
- Professional help recommendations
- Emergency contact protocols
- Conversation history tracking
- Escalation to human counselors

## 🎵 Music Therapy Integration

### Music Recommendations
- **Mood-Based Selection**: Curated playlists for different emotional states
- **Therapeutic Content**: Scientifically-backed music therapy tracks
- **External Integration**: Links to Spotify, YouTube, Apple Music
- **Progress Tracking**: Monitor user engagement with recommendations

### Motivational Content
- **Daily Quotes**: Inspirational messages based on assessment results
- **Coping Techniques**: Breathing exercises and mindfulness practices
- **Resource Links**: External mental health resources and apps
- **Severity-Appropriate**: Content tailored to user's current mental state

## 🚀 Deployment

### Production Setup
1. **Environment Variables**: Secure key management
2. **Database Migration**: PostgreSQL for production
3. **HTTPS Configuration**: SSL certificate setup
4. **Domain Setup**: Custom domain configuration
5. **Monitoring**: Application performance monitoring

### Scaling Considerations
- Database optimization for large user bases
- CDN setup for faster asset delivery
- Load balancing for high traffic
- Backup and disaster recovery
- Multi-region deployment

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support & Resources

### Crisis Support
- **Crisis Text Line**: Text HOME to 741741
- **National Suicide Prevention**: 988
- **Emergency Services**: 911 (US) / Local emergency number

### Professional Help
- Licensed therapists and counselors
- Institutional counseling services
- Community mental health centers
- Online therapy platforms

## 📄 License

This project is licensed under the MIT License - see the LICENSE.md file for details.

## 🙏 Acknowledgments

- Mental health professionals for assessment framework guidance
- Open source community for React and Flask ecosystems
- Tailwind CSS team for exceptional utility framework
- Institution partners for collaborative wellness initiatives

---

**Note**: This platform is designed to support mental wellness but is not a replacement for professional mental health treatment. If you're experiencing a mental health crisis, please contact emergency services or a crisis hotline immediately.