const express = require('express');
const { body, validationResult } = require('express-validator');
const { ChatMessage, User, CounselorRequest } = require('../models');
const { v4: uuidv4 } = require('uuid');

const router = express.Router();

// Crisis keywords for detection
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end it all', 'hurt myself', 'self harm', 'cut myself',
  'die', 'death', 'kill me', 'want to die', 'better off dead', 'no point living',
  'hopeless', 'worthless', 'nobody cares', 'can\'t go on', 'give up'
];

// Positive keywords for sentiment analysis
const POSITIVE_KEYWORDS = [
  'happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'fantastic',
  'better', 'improved', 'hopeful', 'positive', 'grateful', 'thankful', 'blessed'
];

// Negative keywords for sentiment analysis
const NEGATIVE_KEYWORDS = [
  'sad', 'depressed', 'anxious', 'worried', 'scared', 'angry', 'frustrated',
  'terrible', 'awful', 'horrible', 'worst', 'hate', 'miserable', 'lonely'
];

// Chatbot responses
const CHATBOT_RESPONSES = {
  greeting: [
    "Hello! I'm here to listen and support you. How are you feeling today?",
    "Hi there! I'm glad you reached out. What's on your mind?",
    "Welcome! I'm here to provide a safe space for you to share. How can I help you today?"
  ],
  
  crisis: [
    "I'm very concerned about what you've shared. Your life has value and there are people who want to help. Please consider contacting the National Suicide Prevention Lifeline at 988 or text HOME to 741741. Would you like me to provide more crisis resources?",
    "Thank you for trusting me with these feelings. You're not alone, and help is available. Please reach out to a crisis counselor at 988 or emergency services. Your safety is the most important thing right now.",
    "I hear that you're in a lot of pain right now. Please know that these feelings can change with proper support. Contact 988 or go to your nearest emergency room. Would you like me to help you find local crisis resources?"
  ],
  
  negative: [
    "It sounds like you're going through a difficult time. Those feelings are valid and it's okay to not be okay. Would you like to talk about what's been weighing on you?",
    "I can hear that you're struggling right now. Thank you for sharing that with me. Sometimes talking about difficult feelings can help. What's been the hardest part for you?",
    "Your feelings matter and I'm here to listen. It takes courage to reach out when you're feeling low. Would you like to explore some coping strategies that might help?"
  ],
  
  positive: [
    "I'm so glad to hear you're feeling good! It's wonderful when we can recognize positive moments. What's been going well for you?",
    "That's fantastic! It's important to celebrate the good times. What's contributing to these positive feelings?",
    "It makes me happy to hear you're doing well. Positive emotions are so valuable for our mental health. Keep nurturing whatever is working for you!"
  ],
  
  neutral: [
    "Thank you for sharing with me. I'm here to listen and support you however I can. Is there something specific you'd like to talk about?",
    "I appreciate you reaching out. Sometimes it helps just to have someone to talk to. What's been on your mind lately?",
    "I'm here for you. Whether you want to share what you're feeling or just need someone to listen, I'm glad you're here."
  ],
  
  support: [
    "Remember that seeking help is a sign of strength, not weakness. You deserve support and care.",
    "You're taking an important step by reaching out. That shows courage and self-awareness.",
    "It's okay to not have all the answers right now. Healing is a process, and you don't have to go through it alone."
  ],
  
  coping: [
    "Some people find it helpful to practice deep breathing when feeling overwhelmed. Would you like me to guide you through a simple breathing exercise?",
    "Grounding techniques can be helpful when emotions feel intense. One simple technique is to name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste.",
    "Self-care looks different for everyone. What are some activities that usually make you feel better or more relaxed?"
  ]
};

// Simple sentiment analysis
function analyzeSentiment(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for crisis indicators
  const crisisFound = CRISIS_KEYWORDS.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  if (crisisFound) {
    return { score: -10, label: 'crisis' };
  }
  
  // Count positive and negative keywords
  const positiveCount = POSITIVE_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  ).length;
  
  const negativeCount = NEGATIVE_KEYWORDS.filter(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  ).length;
  
  // Calculate sentiment score
  const score = positiveCount - negativeCount;
  
  let label;
  if (score > 0) {
    label = 'positive';
  } else if (score < 0) {
    label = 'negative';
  } else {
    label = 'neutral';
  }
  
  return { score, label };
}

// Generate chatbot response
function generateResponse(message, sentiment) {
  const lowerMessage = message.toLowerCase();
  
  // Greeting detection
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || 
      lowerMessage.includes('hey') || lowerMessage.includes('good morning') ||
      lowerMessage.includes('good afternoon') || lowerMessage.includes('good evening')) {
    return getRandomResponse(CHATBOT_RESPONSES.greeting);
  }
  
  // Crisis response
  if (sentiment.label === 'crisis') {
    return getRandomResponse(CHATBOT_RESPONSES.crisis);
  }
  
  // Sentiment-based responses
  switch (sentiment.label) {
    case 'positive':
      return getRandomResponse(CHATBOT_RESPONSES.positive);
    case 'negative':
      return getRandomResponse(CHATBOT_RESPONSES.negative);
    default:
      return getRandomResponse(CHATBOT_RESPONSES.neutral);
  }
}

// Get random response from array
function getRandomResponse(responses) {
  return responses[Math.floor(Math.random() * responses.length)];
}

// @route   POST /api/chatbot/message
// @desc    Send message to chatbot
// @access  Public
router.post('/message', [
  body('message')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Message must be between 1 and 1000 characters'),
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  body('sessionId')
    .optional()
    .isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { message, userId, sessionId = uuidv4() } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Analyze sentiment
    const sentiment = analyzeSentiment(message);

    // Generate response
    const botResponse = generateResponse(message, sentiment);

    // Determine if crisis escalation is needed
    const crisisDetected = sentiment.label === 'crisis';
    let escalated = false;

    // Auto-escalate crisis situations
    if (crisisDetected && process.env.AUTO_ESCALATION_ENABLED === 'true') {
      try {
        // Create counselor request for crisis cases
        const counselorRequest = new CounselorRequest({
          user: userId,
          severityLevel: 'severe',
          priority: 'urgent',
          anonymousData: new Map([
            ['chatMessage', message],
            ['autoEscalated', true],
            ['escalationReason', 'Crisis keywords detected in chat']
          ])
        });

        await counselorRequest.save();
        escalated = true;
      } catch (escalationError) {
        console.error('Auto-escalation failed:', escalationError);
      }
    }

    // Save chat message
    const chatMessage = new ChatMessage({
      user: userId,
      message,
      response: botResponse,
      sentiment,
      crisisDetected,
      escalated,
      sessionId
    });

    await chatMessage.save();

    // Prepare response
    const responseData = {
      success: true,
      messageId: chatMessage._id,
      response: botResponse,
      sessionId,
      sentiment: {
        label: sentiment.label,
        supportive: sentiment.label !== 'positive'
      },
      timestamp: chatMessage.createdAt
    };

    // Add crisis resources if needed
    if (crisisDetected) {
      responseData.crisisDetected = true;
      responseData.crisisResources = [
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          description: 'Free and confidential support 24/7'
        },
        {
          name: 'Crisis Text Line',
          text: 'HOME to 741741',
          description: 'Text-based crisis support 24/7'
        },
        {
          name: 'Emergency Services',
          phone: '911',
          description: 'For immediate emergency assistance'
        }
      ];
      
      if (escalated) {
        responseData.escalated = true;
        responseData.message = 'Your message has been flagged for urgent support. A counselor will be notified.';
      }
    }

    // Add supportive follow-up for negative sentiment
    if (sentiment.label === 'negative' || sentiment.label === 'crisis') {
      responseData.followUp = getRandomResponse(CHATBOT_RESPONSES.support);
      responseData.copingTip = getRandomResponse(CHATBOT_RESPONSES.coping);
    }

    res.json(responseData);

  } catch (error) {
    console.error('Chatbot message error:', error);
    res.status(500).json({
      error: 'Message processing failed',
      message: 'An error occurred while processing your message'
    });
  }
});

// @route   GET /api/chatbot/history/:userId
// @desc    Get chat history for user
// @access  Public
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sessionId, limit = 20, page = 1 } = req.query;

    // Build query
    const query = { user: userId };
    if (sessionId) {
      query.sessionId = sessionId;
    }

    const messages = await ChatMessage.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const total = await ChatMessage.countDocuments(query);

    res.json({
      success: true,
      messages: messages.reverse(), // Reverse to show chronological order
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({
      error: 'Failed to retrieve chat history',
      message: 'An error occurred while fetching your chat history'
    });
  }
});

// @route   GET /api/chatbot/sessions/:userId
// @desc    Get chat sessions for user
// @access  Public
router.get('/sessions/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const sessions = await ChatMessage.aggregate([
      { $match: { user: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$sessionId',
          lastMessage: { $last: '$message' },
          lastResponse: { $last: '$response' },
          messageCount: { $sum: 1 },
          lastActivity: { $max: '$createdAt' },
          crisisDetected: { $max: '$crisisDetected' },
          sentiments: { $push: '$sentiment.label' }
        }
      },
      { $sort: { lastActivity: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      sessions: sessions.map(session => ({
        sessionId: session._id,
        lastMessage: session.lastMessage,
        lastResponse: session.lastResponse,
        messageCount: session.messageCount,
        lastActivity: session.lastActivity,
        crisisDetected: session.crisisDetected,
        predominantSentiment: getMostFrequent(session.sentiments)
      }))
    });

  } catch (error) {
    console.error('Chat sessions error:', error);
    res.status(500).json({
      error: 'Failed to retrieve chat sessions',
      message: 'An error occurred while fetching your chat sessions'
    });
  }
});

// @route   POST /api/chatbot/feedback
// @desc    Submit feedback on chatbot response
// @access  Public
router.post('/feedback', [
  body('messageId').isMongoId().withMessage('Valid message ID is required'),
  body('helpful').isBoolean().withMessage('Helpful flag must be boolean'),
  body('feedback').optional().isString().withMessage('Feedback must be string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { messageId, helpful, feedback } = req.body;

    const chatMessage = await ChatMessage.findById(messageId);
    if (!chatMessage) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    // Add feedback to the message
    chatMessage.feedback = {
      helpful,
      comment: feedback,
      submittedAt: new Date()
    };

    await chatMessage.save();

    res.json({
      success: true,
      message: 'Thank you for your feedback! It helps us improve our support.'
    });

  } catch (error) {
    console.error('Chatbot feedback error:', error);
    res.status(500).json({
      error: 'Feedback submission failed',
      message: 'An error occurred while submitting your feedback'
    });
  }
});

// Helper function to find most frequent element
function getMostFrequent(arr) {
  const frequency = {};
  arr.forEach(item => {
    frequency[item] = (frequency[item] || 0) + 1;
  });
  
  return Object.keys(frequency).reduce((a, b) => 
    frequency[a] > frequency[b] ? a : b
  );
}

module.exports = router;