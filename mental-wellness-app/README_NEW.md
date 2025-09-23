# Mental Wellness App - MERN Stack

## 🌟 Enhanced Features

### Backend (Node.js/Express/MongoDB)
- **JWT Authentication** with secure middleware
- **MongoDB** with Mongoose ODM
- **Comprehensive API** with 7 route modules
- **Error Handling** with detailed logging
- **Rate Limiting** and security middleware
- **Admin Dashboard** with analytics
- **Crisis Detection** and alert system

### Frontend (React/Material-UI)
- **Material-UI Components** with modern design
- **Framer Motion** animations
- **Enhanced UX** with loading states and feedback
- **Responsive Design** for all devices
- **JWT Token Management** with automatic refresh
- **Real-time Error Handling**

### Key Improvements
- ✅ Complete MERN stack migration
- ✅ Enhanced security with JWT and bcrypt
- ✅ Modern UI with Material-UI components
- ✅ Comprehensive error handling
- ✅ Admin panel with analytics
- ✅ Database relationships and indexing
- ✅ API rate limiting and validation
- ✅ Automated database initialization

## 🚀 Quick Start

### Option 1: Automated Setup (Windows)
```bash
# Run the automated setup script
start.bat
```

### Option 2: Manual Setup

#### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

#### Backend Setup
```bash
cd backend
npm install
npm run init-db  # Initialize database with sample data
npm run dev      # Start development server
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start        # Start React development server
```

## 🔗 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Admin Login**: admin@mentalwell.com / admin123

## 📁 Project Structure

```
mental-wellness-app/
├── backend/
│   ├── server.js              # Main Express server
│   ├── models/
│   │   ├── index.js           # All MongoDB models
│   │   ├── User.js
│   │   ├── Assessment.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── assessment.js      # Mental health assessments
│   │   ├── chatbot.js         # AI chatbot integration
│   │   ├── counselor.js       # Counselor request system
│   │   ├── institution.js     # Institution partnerships
│   │   ├── music.js           # Music therapy recommendations
│   │   └── admin.js           # Admin dashboard
│   ├── middleware/
│   │   └── auth.js            # JWT authentication middleware
│   ├── init-database.js       # Database initialization script
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.js             # Main React app with Material-UI theme
│   │   ├── pages/
│   │   │   ├── LoginPage.js   # Enhanced login/register with Material-UI
│   │   │   ├── TestPage.js    # Mental health assessment
│   │   │   ├── ChatbotPage.js # AI chatbot interface
│   │   │   ├── MusicPage.js   # Music therapy recommendations
│   │   │   ├── ReportPage.js  # Assessment results and analytics
│   │   │   └── AdminDashboard_new.js # Admin panel
│   │   └── services/
│   │       └── api.js         # Enhanced API service with JWT handling
│   └── package.json
└── start.bat                  # Automated startup script (Windows)
```

## 🛠 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Assessments
- `POST /api/assessment/submit` - Submit mental health assessment
- `GET /api/assessment/analysis/:userId` - Get user analysis
- `GET /api/assessment/history/:userId` - Get assessment history

### Music Therapy
- `GET /api/music/recommendations/:severity` - Get music recommendations
- `GET /api/music/moods/:severity` - Get available moods

### Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history/:userId` - Get chat history
- `POST /api/chatbot/feedback` - Submit feedback

### Counselor Services
- `POST /api/counselor/request` - Request counselor session
- `GET /api/counselor/requests/user/:userId` - Get user requests
- `PUT /api/counselor/request/:id/assign` - Assign counselor (admin)

### Admin Dashboard
- `GET /api/admin/dashboard` - Get dashboard analytics
- `GET /api/admin/users` - Get users with pagination
- `GET /api/admin/assessments` - Get assessments with filters
- `GET /api/admin/crisis-alerts` - Get crisis alerts

## 🔐 Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/mental-wellness
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
NODE_ENV=development
PORT=5000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_ENV=development
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Node.js)
- Deploy to Heroku, Vercel, or DigitalOcean
- Set up MongoDB Atlas for production database
- Configure environment variables

### Frontend (React)
- Deploy to Netlify, Vercel, or AWS S3
- Update API endpoints for production
- Build optimized bundle: `npm run build`

## 🔧 Technologies Used

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **Rate Limiting** - API protection

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **Framer Motion** - Animations
- **Axios** - HTTP client
- **React Router** - Navigation
- **Emotion** - CSS-in-JS styling

### Development Tools
- **Nodemon** - Auto-restart server
- **ESLint** - Code linting
- **Jest** - Testing framework
- **Supertest** - API testing

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support and questions, please contact the development team.