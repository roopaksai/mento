const express = require('express');
const { body, validationResult } = require('express-validator');
const { Assessment, User, Institution, CounselorRequest } = require('../models');
const auth = require('../middleware/auth');

const router = express.Router();

// Assessment questions for scoring
const ASSESSMENT_QUESTIONS = {
  'q1': 'Over the last 2 weeks, how often have you been bothered by little interest or pleasure in doing things?',
  'q2': 'Over the last 2 weeks, how often have you been bothered by feeling down, depressed, or hopeless?',
  'q3': 'Over the last 2 weeks, how often have you been bothered by trouble falling or staying asleep, or sleeping too much?',
  'q4': 'Over the last 2 weeks, how often have you been bothered by feeling tired or having little energy?',
  'q5': 'Over the last 2 weeks, how often have you been bothered by poor appetite or overeating?',
  'q6': 'Over the last 2 weeks, how often have you been bothered by feeling bad about yourself or that you are a failure?',
  'q7': 'Over the last 2 weeks, how often have you been bothered by trouble concentrating on things?',
  'q8': 'Over the last 2 weeks, how often have you been bothered by moving or speaking slowly, or being fidgety?',
  'q9': 'Over the last 2 weeks, how often have you been bothered by thoughts that you would be better off dead?'
};

// Calculate severity level based on total score
const calculateSeverityLevel = (totalScore) => {
  if (totalScore <= 4) return 'low';
  if (totalScore <= 9) return 'moderate';
  if (totalScore <= 14) return 'high';
  return 'severe';
};

// Generate recommendations based on severity
const generateRecommendations = (severityLevel) => {
  const recommendations = {
    low: [
      {
        category: 'Self-Care',
        suggestion: 'Continue your current self-care practices and maintain healthy habits',
        priority: 'low'
      },
      {
        category: 'Exercise',
        suggestion: 'Regular physical activity can boost your mood and energy levels',
        priority: 'medium'
      },
      {
        category: 'Social',
        suggestion: 'Stay connected with supportive friends and family members',
        priority: 'medium'
      }
    ],
    moderate: [
      {
        category: 'Mindfulness',
        suggestion: 'Practice mindfulness meditation or deep breathing exercises daily',
        priority: 'medium'
      },
      {
        category: 'Exercise',
        suggestion: 'Try gentle physical activities like walking, yoga, or swimming',
        priority: 'medium'
      },
      {
        category: 'Sleep',
        suggestion: 'Establish a regular sleep schedule and practice good sleep hygiene',
        priority: 'high'
      },
      {
        category: 'Support',
        suggestion: 'Consider talking to a trusted friend, family member, or counselor',
        priority: 'high'
      }
    ],
    high: [
      {
        category: 'Professional Help',
        suggestion: 'Consider speaking with a mental health professional',
        priority: 'high'
      },
      {
        category: 'Crisis Resources',
        suggestion: 'Keep crisis helpline numbers easily accessible',
        priority: 'high'
      },
      {
        category: 'Support System',
        suggestion: 'Reach out to trusted friends, family, or support groups',
        priority: 'high'
      },
      {
        category: 'Self-Care',
        suggestion: 'Focus on basic self-care: eating regularly, staying hydrated, getting rest',
        priority: 'medium'
      }
    ],
    severe: [
      {
        category: 'Immediate Help',
        suggestion: 'Seek immediate professional mental health support',
        priority: 'high'
      },
      {
        category: 'Crisis Support',
        suggestion: 'Contact a crisis helpline or emergency services if needed',
        priority: 'high'
      },
      {
        category: 'Safety',
        suggestion: 'Ensure you have a support person available and remove any means of self-harm',
        priority: 'high'
      },
      {
        category: 'Professional Care',
        suggestion: 'Consider intensive therapy or psychiatric evaluation',
        priority: 'high'
      }
    ]
  };

  return recommendations[severityLevel] || recommendations.moderate;
};

// Validation middleware
const validateAssessment = [
  body('userId')
    .notEmpty()
    .withMessage('User ID is required'),
  body('userEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('answers')
    .isObject()
    .withMessage('Answers must be an object')
    .custom((answers) => {
      const expectedQuestions = Object.keys(ASSESSMENT_QUESTIONS);
      const providedQuestions = Object.keys(answers);
      
      // Check if all required questions are answered
      for (const question of expectedQuestions) {
        if (!providedQuestions.includes(question)) {
          throw new Error(`Missing answer for ${question}`);
        }
        
        const answer = answers[question];
        if (typeof answer !== 'number' || answer < 0 || answer > 3) {
          throw new Error(`Invalid answer for ${question}. Must be a number between 0-3`);
        }
      }
      
      return true;
    })
];

// @route   POST /api/assessment/submit
// @desc    Submit mental health assessment
// @access  Public
router.post('/submit', validateAssessment, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId, userEmail, answers } = req.body;

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Invalid user ID'
      });
    }

    // Calculate total score
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    const severityLevel = calculateSeverityLevel(totalScore);
    const recommendations = generateRecommendations(severityLevel);

    // Create assessment record
    const assessment = new Assessment({
      user: userId,
      userEmail,
      responses: new Map(Object.entries(answers)),
      totalScore,
      severityLevel,
      recommendations
    });

    await assessment.save();

    // Check for institution partnership and high severity
    const emailDomain = userEmail.split('@')[1];
    const institution = await Institution.findOne({ domain: emailDomain });
    
    let institutionNotified = false;
    let counselorRecommended = false;

    // Handle high severity cases
    if (severityLevel === 'high' || severityLevel === 'severe') {
      counselorRecommended = true;

      // Notify institution if partnership exists and alerts are enabled
      if (institution && institution.settings.alertsEnabled) {
        const severityThreshold = institution.settings.severityThreshold;
        const thresholdMet = (
          (severityThreshold === 'moderate' && ['moderate', 'high', 'severe'].includes(severityLevel)) ||
          (severityThreshold === 'high' && ['high', 'severe'].includes(severityLevel)) ||
          (severityThreshold === 'severe' && severityLevel === 'severe')
        );

        if (thresholdMet) {
          institutionNotified = true;
          // In a real application, send email notification here
          console.log(`🚨 High severity alert sent to ${institution.name} for user ${userEmail}`);
        }
      }
    }

    // Prepare response
    const responseData = {
      success: true,
      assessmentId: assessment._id,
      totalScore,
      severityLevel,
      recommendations,
      counselorRecommended,
      message: 'Assessment completed successfully'
    };

    if (institution) {
      responseData.institution = {
        name: institution.name,
        contactEmail: institution.contactEmail,
        notified: institutionNotified
      };
      
      if (institutionNotified) {
        responseData.message += ` ${institution.name} has been notified of your assessment results.`;
      }
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Assessment submission error:', error);
    res.status(500).json({
      error: 'Assessment submission failed',
      message: 'An error occurred while saving your assessment'
    });
  }
});

// @route   GET /api/assessment/analysis/:userId
// @desc    Get user's assessment analysis
// @access  Public
router.get('/analysis/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Get user's most recent assessment
    const assessment = await Assessment.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name email');

    if (!assessment) {
      return res.status(404).json({
        error: 'No assessment found',
        message: 'No assessment records found for this user'
      });
    }

    // Get user details
    const user = assessment.user;

    // Prepare analysis data
    const analysisData = {
      success: true,
      assessment: {
        id: assessment._id,
        totalScore: assessment.totalScore,
        severityLevel: assessment.severityLevel,
        completedAt: assessment.completedAt,
        recommendations: assessment.recommendations
      },
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      interpretation: {
        scoreRange: getScoreInterpretation(assessment.totalScore),
        nextSteps: getNextSteps(assessment.severityLevel),
        followUpRecommended: assessment.severityLevel !== 'low'
      }
    };

    res.json(analysisData);

  } catch (error) {
    console.error('Analysis retrieval error:', error);
    res.status(500).json({
      error: 'Analysis retrieval failed',
      message: 'An error occurred while retrieving your analysis'
    });
  }
});

// @route   GET /api/assessment/history/:userId
// @desc    Get user's assessment history
// @access  Public
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const assessments = await Assessment.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('totalScore severityLevel completedAt recommendations');

    const total = await Assessment.countDocuments({ user: userId });

    res.json({
      success: true,
      assessments,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Assessment history error:', error);
    res.status(500).json({
      error: 'History retrieval failed',
      message: 'An error occurred while retrieving assessment history'
    });
  }
});

// Helper functions
function getScoreInterpretation(score) {
  if (score <= 4) {
    return {
      level: 'Minimal Depression',
      description: 'Your responses suggest minimal signs of depression. Continue maintaining your mental wellness.'
    };
  } else if (score <= 9) {
    return {
      level: 'Mild Depression',
      description: 'Your responses suggest mild depressive symptoms. Consider incorporating stress management techniques.'
    };
  } else if (score <= 14) {
    return {
      level: 'Moderate Depression',
      description: 'Your responses suggest moderate depressive symptoms. Consider speaking with a mental health professional.'
    };
  } else {
    return {
      level: 'Severe Depression',
      description: 'Your responses suggest severe depressive symptoms. We strongly recommend seeking professional mental health support immediately.'
    };
  }
}

function getNextSteps(severityLevel) {
  const steps = {
    low: [
      'Continue current wellness practices',
      'Maintain regular exercise and sleep schedule',
      'Stay connected with support network'
    ],
    moderate: [
      'Practice stress management techniques',
      'Consider counseling or therapy',
      'Monitor mood changes regularly'
    ],
    high: [
      'Seek professional mental health support',
      'Contact your healthcare provider',
      'Reach out to trusted friends or family'
    ],
    severe: [
      'Seek immediate professional help',
      'Contact crisis support services if needed',
      'Ensure you have immediate support available'
    ]
  };

  return steps[severityLevel] || steps.moderate;
}

module.exports = router;