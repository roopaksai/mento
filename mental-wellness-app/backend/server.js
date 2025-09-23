const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const assessmentRoutes = require('./routes/assessment');
const institutionRoutes = require('./routes/institution');
const counselorRoutes = require('./routes/counselor');
const musicRoutes = require('./routes/music');
const chatbotRoutes = require('./routes/chatbot');
const adminRoutes = require('./routes/admin');

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use('/api/', limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mental_wellness', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('🍃 Connected to MongoDB');
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error.message);
  process.exit(1);
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    message: 'Mental Wellness API is running',
    version: '2.0.0',
    stack: 'MERN',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/institution', institutionRoutes);
app.use('/api/counselor', counselorRoutes);
app.use('/api/music', musicRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint with API information
app.get('/api', (req, res) => {
  res.json({
    name: 'Mental Wellness API',
    version: '2.0.0',
    description: 'MERN Stack API for mental health assessment and support platform',
    stack: {
      database: 'MongoDB',
      backend: 'Node.js + Express.js',
      frontend: 'React.js',
      runtime: 'Node.js'
    },
    endpoints: {
      auth: '/api/auth/login',
      assessment: '/api/assessment/submit',
      analysis: '/api/assessment/analysis/:userId',
      institution: '/api/institution/check',
      counselor: '/api/counselor/request',
      music: '/api/music/recommendations/:severityLevel',
      chatbot: '/api/chatbot/message',
      admin: '/api/admin/dashboard'
    },
    features: [
      'JWT-based authentication with secure sessions',
      'Mental health assessment with advanced scoring',
      'Real-time severity analysis and recommendations',
      'Institution partnership integration with notifications',
      'Anonymous counselor request system',
      'AI-powered music therapy recommendations',
      'Intelligent chatbot with crisis detection',
      'Comprehensive admin dashboard with analytics'
    ]
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: ['/api', '/api/health', '/api/auth', '/api/assessment']
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(val => val.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      error: 'Duplicate Entry',
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log('🚀 Starting Mental Wellness MERN Stack API Server...');
  console.log('📊 MongoDB connection established');
  console.log('🔒 Security middleware enabled');
  console.log('🔗 CORS configured for React frontend');
  console.log('🏥 Institution partnerships configured');
  console.log('🤖 AI Chatbot with crisis detection ready');
  console.log('🎵 Music therapy recommendations available');
  console.log('⚡ Rate limiting enabled');
  console.log(`📱 API server running on port ${PORT}`);
  console.log(`🌐 API endpoints available at http://localhost:${PORT}/api`);
  console.log('\n' + '='.repeat(60));
  console.log('MERN STACK API ENDPOINTS:');
  console.log('='.repeat(60));
  console.log('GET    /api                     - API information');
  console.log('GET    /api/health              - Health check');
  console.log('POST   /api/auth/login          - User authentication');
  console.log('POST   /api/auth/register       - User registration');
  console.log('POST   /api/assessment/submit   - Submit assessment');
  console.log('GET    /api/assessment/analysis/:userId - Get analysis');
  console.log('POST   /api/institution/check   - Check institution');
  console.log('POST   /api/counselor/request   - Request counselor');
  console.log('GET    /api/music/recommendations/:level - Music recommendations');
  console.log('POST   /api/chatbot/message     - Chatbot interaction');
  console.log('GET    /api/admin/dashboard     - Admin dashboard');
  console.log('='.repeat(60));
});

module.exports = app;