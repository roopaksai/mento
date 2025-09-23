const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    select: false // Don't include password in queries by default
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  institution: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Institution'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual for user's assessments
userSchema.virtual('assessments', {
  ref: 'Assessment',
  localField: '_id',
  foreignField: 'user'
});

// Assessment Schema
const assessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  responses: {
    type: Map,
    of: Number,
    required: true
  },
  totalScore: {
    type: Number,
    required: true,
    min: 0
  },
  severityLevel: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high', 'severe'],
    default: 'low'
  },
  recommendations: [{
    category: String,
    suggestion: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Institution Schema
const institutionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true
  },
  domain: {
    type: String,
    required: [true, 'Domain is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  contactEmail: {
    type: String,
    required: [true, 'Contact email is required'],
    lowercase: true,
    trim: true
  },
  contactPhone: {
    type: String,
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  partnershipLevel: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic'
  },
  settings: {
    alertsEnabled: {
      type: Boolean,
      default: true
    },
    severityThreshold: {
      type: String,
      enum: ['moderate', 'high', 'severe'],
      default: 'high'
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for institution's users
institutionSchema.virtual('users', {
  ref: 'User',
  localField: '_id',
  foreignField: 'institution'
});

// Counselor Request Schema
const counselorRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assessment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  severityLevel: {
    type: String,
    required: true,
    enum: ['moderate', 'high', 'severe']
  },
  anonymousData: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedCounselor: {
    name: String,
    email: String,
    specialization: String
  },
  notes: [{
    author: String,
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  scheduledAt: Date,
  completedAt: Date
}, {
  timestamps: true
});

// Music Recommendation Schema
const musicRecommendationSchema = new mongoose.Schema({
  severityLevel: {
    type: String,
    required: true,
    enum: ['low', 'moderate', 'high', 'severe']
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    required: true,
    enum: ['calming', 'uplifting', 'energizing', 'meditative', 'peaceful']
  },
  duration: Number, // in seconds
  spotifyUrl: String,
  youtubeUrl: String,
  description: String,
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Chat Message Schema
const chatMessageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: [1000, 'Message cannot exceed 1000 characters']
  },
  response: {
    type: String,
    required: true
  },
  sentiment: {
    score: Number,
    label: {
      type: String,
      enum: ['positive', 'neutral', 'negative', 'crisis']
    }
  },
  crisisDetected: {
    type: Boolean,
    default: false
  },
  escalated: {
    type: Boolean,
    default: false
  },
  sessionId: String
}, {
  timestamps: true
});

// Indexes for better performance
userSchema.index({ email: 1 });
assessmentSchema.index({ user: 1, createdAt: -1 });
institutionSchema.index({ domain: 1 });
counselorRequestSchema.index({ user: 1, status: 1 });
musicRecommendationSchema.index({ severityLevel: 1, mood: 1 });
chatMessageSchema.index({ user: 1, createdAt: -1 });

// Create models
const User = mongoose.model('User', userSchema);
const Assessment = mongoose.model('Assessment', assessmentSchema);
const Institution = mongoose.model('Institution', institutionSchema);
const CounselorRequest = mongoose.model('CounselorRequest', counselorRequestSchema);
const MusicRecommendation = mongoose.model('MusicRecommendation', musicRecommendationSchema);
const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

module.exports = {
  User,
  Assessment,
  Institution,
  CounselorRequest,
  MusicRecommendation,
  ChatMessage
};