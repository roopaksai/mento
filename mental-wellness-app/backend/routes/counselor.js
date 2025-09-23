const express = require('express');
const { body, validationResult } = require('express-validator');
const { CounselorRequest, Assessment, User, Institution } = require('../models');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/counselor/request
// @desc    Request counselor session
// @access  Public
router.post('/request', [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('assessmentId').optional().isMongoId().withMessage('Invalid assessment ID'),
  body('severityLevel').isIn(['moderate', 'high', 'severe']).withMessage('Invalid severity level'),
  body('anonymousData').optional().isObject().withMessage('Anonymous data must be an object')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { userId, assessmentId, severityLevel, anonymousData = {} } = req.body;

    // Verify user exists
    const user = await User.findById(userId).populate('institution');
    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    // Verify assessment if provided
    let assessment = null;
    if (assessmentId) {
      assessment = await Assessment.findById(assessmentId);
      if (!assessment || assessment.user.toString() !== userId) {
        return res.status(400).json({
          error: 'Invalid assessment ID'
        });
      }
    }

    // Determine priority based on severity level
    const priority = {
      'moderate': 'medium',
      'high': 'high',
      'severe': 'urgent'
    }[severityLevel] || 'medium';

    // Create counselor request
    const counselorRequest = new CounselorRequest({
      user: userId,
      assessment: assessmentId,
      severityLevel,
      priority,
      anonymousData: new Map(Object.entries(anonymousData))
    });

    await counselorRequest.save();

    // Prepare response data
    const responseData = {
      success: true,
      requestId: counselorRequest._id,
      status: counselorRequest.status,
      priority: counselorRequest.priority,
      message: 'Counselor session request submitted successfully'
    };

    // Add institution-specific information
    if (user.institution) {
      responseData.institution = {
        name: user.institution.name,
        contactEmail: user.institution.contactEmail
      };
      responseData.message += ` Your institution (${user.institution.name}) has been notified.`;
    }

    // Add urgency message for high-priority cases
    if (priority === 'urgent') {
      responseData.message += ' Due to the urgency of your situation, we will prioritize your request.';
      responseData.emergencyContacts = [
        {
          name: 'National Suicide Prevention Lifeline',
          phone: '988',
          available: '24/7'
        },
        {
          name: 'Crisis Text Line',
          text: 'HOME to 741741',
          available: '24/7'
        }
      ];
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Counselor request error:', error);
    res.status(500).json({
      error: 'Request submission failed',
      message: 'An error occurred while submitting your counselor request'
    });
  }
});

// @route   GET /api/counselor/request/:id
// @desc    Get counselor request details
// @access  Public
router.get('/request/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const request = await CounselorRequest.findById(id)
      .populate('user', 'name email')
      .populate('assessment', 'totalScore severityLevel completedAt');

    if (!request) {
      return res.status(404).json({
        error: 'Request not found'
      });
    }

    res.json({
      success: true,
      request: {
        id: request._id,
        status: request.status,
        priority: request.priority,
        severityLevel: request.severityLevel,
        createdAt: request.createdAt,
        scheduledAt: request.scheduledAt,
        assignedCounselor: request.assignedCounselor,
        user: {
          name: request.user.name,
          email: request.user.email
        },
        assessment: request.assessment ? {
          totalScore: request.assessment.totalScore,
          severityLevel: request.assessment.severityLevel,
          completedAt: request.assessment.completedAt
        } : null
      }
    });

  } catch (error) {
    console.error('Get counselor request error:', error);
    res.status(500).json({
      error: 'Failed to retrieve request',
      message: 'An error occurred while fetching the counselor request'
    });
  }
});

// @route   GET /api/counselor/requests/user/:userId
// @desc    Get user's counselor requests
// @access  Public
router.get('/requests/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { status, limit = 10, page = 1 } = req.query;

    // Build query
    const query = { user: userId };
    if (status) {
      query.status = status;
    }

    const requests = await CounselorRequest.find(query)
      .populate('assessment', 'totalScore severityLevel completedAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CounselorRequest.countDocuments(query);

    res.json({
      success: true,
      requests: requests.map(request => ({
        id: request._id,
        status: request.status,
        priority: request.priority,
        severityLevel: request.severityLevel,
        createdAt: request.createdAt,
        scheduledAt: request.scheduledAt,
        completedAt: request.completedAt,
        assignedCounselor: request.assignedCounselor,
        assessment: request.assessment ? {
          totalScore: request.assessment.totalScore,
          severityLevel: request.assessment.severityLevel,
          completedAt: request.assessment.completedAt
        } : null
      })),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({
      error: 'Failed to retrieve requests',
      message: 'An error occurred while fetching counselor requests'
    });
  }
});

// @route   PUT /api/counselor/request/:id/assign
// @desc    Assign counselor to request
// @access  Admin only
router.put('/request/:id/assign', adminAuth, [
  body('counselorName').notEmpty().withMessage('Counselor name is required'),
  body('counselorEmail').isEmail().withMessage('Valid counselor email is required'),
  body('specialization').optional().isString(),
  body('scheduledAt').optional().isISO8601().withMessage('Invalid scheduled date')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { counselorName, counselorEmail, specialization, scheduledAt } = req.body;

    const request = await CounselorRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        error: 'Request not found'
      });
    }

    // Update request with counselor assignment
    request.status = 'assigned';
    request.assignedCounselor = {
      name: counselorName,
      email: counselorEmail,
      specialization: specialization || 'General Mental Health'
    };

    if (scheduledAt) {
      request.scheduledAt = new Date(scheduledAt);
    }

    request.notes.push({
      author: req.user.name,
      content: `Assigned to counselor ${counselorName} (${counselorEmail})`,
      timestamp: new Date()
    });

    await request.save();

    res.json({
      success: true,
      request: {
        id: request._id,
        status: request.status,
        assignedCounselor: request.assignedCounselor,
        scheduledAt: request.scheduledAt
      },
      message: 'Counselor assigned successfully'
    });

  } catch (error) {
    console.error('Assign counselor error:', error);
    res.status(500).json({
      error: 'Assignment failed',
      message: 'An error occurred while assigning the counselor'
    });
  }
});

// @route   PUT /api/counselor/request/:id/status
// @desc    Update request status
// @access  Admin only
router.put('/request/:id/status', adminAuth, [
  body('status').isIn(['pending', 'assigned', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status'),
  body('note').optional().isString().withMessage('Note must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { status, note } = req.body;

    const request = await CounselorRequest.findById(id);
    if (!request) {
      return res.status(404).json({
        error: 'Request not found'
      });
    }

    const oldStatus = request.status;
    request.status = status;

    // Set completed date if status is completed
    if (status === 'completed' && oldStatus !== 'completed') {
      request.completedAt = new Date();
    }

    // Add note to history
    request.notes.push({
      author: req.user.name,
      content: note || `Status changed from ${oldStatus} to ${status}`,
      timestamp: new Date()
    });

    await request.save();

    res.json({
      success: true,
      request: {
        id: request._id,
        status: request.status,
        completedAt: request.completedAt
      },
      message: 'Request status updated successfully'
    });

  } catch (error) {
    console.error('Update request status error:', error);
    res.status(500).json({
      error: 'Status update failed',
      message: 'An error occurred while updating the request status'
    });
  }
});

// @route   GET /api/counselor/requests/all
// @desc    Get all counselor requests for admin
// @access  Admin only
router.get('/requests/all', adminAuth, async (req, res) => {
  try {
    const { 
      status, 
      priority, 
      severityLevel, 
      limit = 20, 
      page = 1,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severityLevel) query.severityLevel = severityLevel;

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const requests = await CounselorRequest.find(query)
      .populate('user', 'name email')
      .populate('assessment', 'totalScore severityLevel completedAt')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CounselorRequest.countDocuments(query);

    // Get summary statistics
    const stats = await CounselorRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const statusCounts = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {});

    res.json({
      success: true,
      requests: requests.map(request => ({
        id: request._id,
        user: {
          id: request.user._id,
          name: request.user.name,
          email: request.user.email
        },
        status: request.status,
        priority: request.priority,
        severityLevel: request.severityLevel,
        createdAt: request.createdAt,
        scheduledAt: request.scheduledAt,
        completedAt: request.completedAt,
        assignedCounselor: request.assignedCounselor,
        assessment: request.assessment ? {
          totalScore: request.assessment.totalScore,
          severityLevel: request.assessment.severityLevel,
          completedAt: request.assessment.completedAt
        } : null
      })),
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      },
      stats: {
        total,
        byStatus: statusCounts
      }
    });

  } catch (error) {
    console.error('Get all requests error:', error);
    res.status(500).json({
      error: 'Failed to retrieve requests',
      message: 'An error occurred while fetching counselor requests'
    });
  }
});

module.exports = router;