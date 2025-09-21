# 🚀 Mental Wellness Website Setup Guide

## Quick Start Instructions

### Prerequisites
- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download here](https://python.org/)
- **Git** (optional) - [Download here](https://git-scm.com/)

### 1. Frontend Setup (React)

Open PowerShell and navigate to the frontend directory:

```powershell
cd "C:\Users\LENOVO\Desktop\sih\mental-wellness-app\frontend"

# Install dependencies
npm install

# Start development server
npm start
```

The React app will open at: **http://localhost:3000**

### 2. Backend Setup (Flask)

Open a **NEW** PowerShell window and navigate to the backend directory:

```powershell
cd "C:\Users\LENOVO\Desktop\sih\mental-wellness-app\backend"

# Install Python dependencies
pip install -r requirements.txt

# Start Flask server
python app.py
```

The Flask API will run at: **http://localhost:5000**

## 🎯 Testing the Application

1. **Visit Frontend**: Open http://localhost:3000
2. **James Bond Login**: Enter your name and email
3. **Take Assessment**: Answer the mental health questions
4. **View Results**: See your personalized report
5. **Explore Features**: Try music therapy and chatbot

## 📁 Project Structure Overview

```
mental-wellness-app/
├── frontend/                 # React application
│   ├── src/
│   │   ├── pages/           # Login, Test, Report, Music, Chatbot
│   │   ├── components/      # Reusable UI components
│   │   ├── services/        # API communication
│   │   └── styles/          # CSS and styling
│   └── package.json
├── backend/                 # Flask API server
│   ├── app.py              # Main Flask application
│   ├── models.py           # Database models
│   ├── routes/             # API endpoints
│   │   ├── auth.py         # Authentication
│   │   ├── assessment.py   # Mental health tests
│   │   ├── institution.py  # Partner organizations
│   │   ├── counselor.py    # Professional support
│   │   ├── music.py        # Music therapy
│   │   └── chatbot.py      # Support chat
│   └── requirements.txt
└── README.md
```

## 🔧 Key Features Implemented

### ✅ User Features
- **Creative Login** - James Bond themed authentication
- **Mental Health Assessment** - 10 user-friendly questions
- **Analysis & Reports** - Encouraging results with severity levels
- **Music Therapy** - Mood-based recommendations with YouTube links
- **Support Chatbot** - Rule-based responses with crisis detection

### ✅ Institution Features
- **Domain Detection** - Automatic partner institution linking
- **Severity Alerts** - High-risk case notifications
- **Counselor Requests** - Anonymous professional support

### ✅ Technical Features
- **SQLite Database** - User data and assessment storage
- **RESTful API** - Clean backend architecture
- **CORS Enabled** - Frontend-backend communication
- **Error Handling** - Graceful error management
- **Crisis Detection** - Safety keywords monitoring

## 🎨 Customization Guide

### Styling
- **Colors**: Edit `frontend/tailwind.config.js`
- **CSS**: Modify `frontend/src/styles/index.css`
- **Components**: Update files in `frontend/src/pages/`

### Questions
- **Assessment**: Edit question array in `frontend/src/pages/TestPage.js`
- **Scoring**: Modify `backend/models.py` Assessment.calculate_severity()

### Music/Content
- **Playlists**: Update `frontend/src/pages/MusicPage.js` musicLibrary
- **Chatbot**: Modify responses in `backend/routes/chatbot.py`

### Database
- **Schema**: Edit `backend/models.py` init_database()
- **Institutions**: Add partners in Database.init_database()

## 🔒 Security & Privacy

- User emails are stored securely in SQLite
- No medical diagnoses - only wellness insights
- Crisis detection triggers appropriate resources
- Anonymous counselor requests protect identity
- CORS configured for development environment

## 🚀 Deployment Considerations

### Frontend (React)
```powershell
npm run build
# Deploy dist/ folder to hosting service
```

### Backend (Flask)
- Use production WSGI server (Gunicorn, uWSGI)
- Configure environment variables
- Use PostgreSQL for production database
- Enable HTTPS and secure headers

## 📈 Future Enhancement Ideas

1. **Real AI Chatbot** - Integrate OpenAI or Dialogflow
2. **Music Streaming** - Connect to Spotify/Apple Music APIs
3. **Professional Portal** - Counselor dashboard and matching
4. **Mobile App** - React Native or Flutter
5. **Analytics Dashboard** - Usage and wellness trends
6. **Video Therapy** - Integrate video calling
7. **Community Features** - Support groups and forums

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**
```powershell
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5000
npx kill-port 5000
```

**Module Not Found**
```powershell
# Frontend
cd frontend
npm install

# Backend
cd backend
pip install -r requirements.txt
```

**Database Issues**
```powershell
# Delete and recreate database
cd backend
del database.db
python app.py  # Will recreate database
```

**CORS Errors**
- Ensure backend is running on port 5000
- Check Flask CORS configuration in `app.py`

## 📞 Support Resources

### Crisis Support (Built into app)
- **National Suicide Prevention Lifeline**: 988
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

### Development Help
- **React Documentation**: https://reactjs.org/
- **Flask Documentation**: https://flask.palletsprojects.com/
- **Tailwind CSS**: https://tailwindcss.com/

## 🎉 You're All Set!

Your mental wellness platform is ready to help users on their journey to better mental health. The application provides a safe, encouraging environment with proper crisis detection and support resources.

**Remember**: This is a wellness tool, not a medical diagnostic platform. Always encourage users to seek professional help when needed.

Happy coding! 💙✨