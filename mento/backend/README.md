# Mental Wellness Platform - Flask Backend

## Installation

1. Create a virtual environment:
```bash
python -m venv venv
```

2. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set environment variables (create .env file):
```
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-here
DATABASE_URL=sqlite:///mental_wellness.db
```

## Running the Application

```bash
python app.py
```

The server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST `/api/register` - Register new user
- POST `/api/login` - User login

### Mental Health Assessment
- POST `/api/test/submit` - Submit test responses
- GET `/api/test/results/<test_id>` - Get test results

### Counselor Services
- POST `/api/counselor/request` - Request counselor support

### Chat System
- POST `/api/chat/send` - Send chat message
- GET `/api/chat/history` - Get chat history

### User Management
- GET `/api/user/profile` - Get user profile
- GET `/api/institutions` - Get available institutions

## Database Models

- **User**: User accounts with institution affiliations
- **Institution**: Partner schools, colleges, and companies
- **TestResponse**: Mental health assessment results
- **CounselorRequest**: Requests for professional support
- **ChatMessage**: Chat conversation history

## Features

1. **User Registration & Authentication**
   - JWT-based authentication
   - Institution-based user categorization
   - Student verification system

2. **Mental Health Assessment**
   - Comprehensive questionnaire
   - Severity level analysis (low/moderate/high)
   - Personalized recommendations

3. **Institutional Integration**
   - Automatic counselor alerts for high-risk cases
   - Institution dashboard for counselors
   - Priority-based request handling

4. **AI Chatbot**
   - Contextual emotional support
   - Crisis intervention keywords
   - Conversation history tracking

5. **Data Analytics**
   - Test score tracking
   - Severity trend analysis
   - Institution-wide mental health metrics