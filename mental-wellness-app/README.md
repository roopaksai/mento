# Mental Wellness Website Prototype

A comprehensive mental health assessment platform with React frontend and Flask backend.

## Project Structure

```
mental-wellness-app/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API calls
│   │   └── styles/         # CSS files
│   ├── package.json
│   └── package-lock.json
├── backend/                 # Flask application
│   ├── app.py              # Main Flask app
│   ├── models.py           # Database models
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   ├── database.db         # SQLite database
│   └── requirements.txt
└── README.md
```

## Features

### User Features
1. **Creative Login** - James Bond themed authentication
2. **Mental Health Assessment** - PHQ-9/DASS-21 inspired questions
3. **Analysis & Reports** - Encouraging results display
4. **Music & Motivation** - Personalized content based on assessment
5. **Chatbot** - Supportive AI assistant

### Institution Features
6. **Domain-based Integration** - Partner institution linking
7. **Severity Alerts** - High-risk case notifications
8. **Anonymous Counseling** - Optional 1:1 sessions

## Tech Stack

- **Frontend**: React + Tailwind CSS
- **Backend**: Flask (Python)
- **Database**: SQLite
- **Routing**: React Router
- **HTTP Client**: Axios

## Setup Instructions

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Development Notes

- Keep mental health messaging encouraging and non-medical
- Ensure user privacy and data security
- Follow accessibility best practices
- Test thoroughly before deployment

## Future Enhancements

- Real chatbot integration (OpenAI/Dialogflow)
- Music streaming API integration
- Advanced analytics dashboard
- Mobile responsive improvements
- Professional counselor portal