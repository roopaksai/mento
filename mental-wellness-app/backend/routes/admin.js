const express = require('express');
const mongoose = require('mongoose');
const { User, Assessment, Institution, CounselorRequest, ChatMessage } = require('../models');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard statistics
// @access  Admin only
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const { timeframe = '30' } = req.query; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(timeframe));

    // Get overview statistics
    const [
      totalUsers,
      totalAssessments,
      totalInstitutions,
      totalCounselorRequests,
      totalChatMessages,
      newUsers,
      newAssessments,
      activeCrisisRequests,
      recentAssessments
    ] = await Promise.all([
      User.countDocuments({ isAdmin: false }),
      Assessment.countDocuments(),
      Institution.countDocuments({ isActive: true }),
      CounselorRequest.countDocuments(),
      ChatMessage.countDocuments(),
      User.countDocuments({ 
        isAdmin: false, 
        createdAt: { $gte: daysAgo } 
      }),
      Assessment.countDocuments({ 
        createdAt: { $gte: daysAgo } 
      }),
      CounselorRequest.countDocuments({ 
        status: { $in: ['pending', 'assigned'] },
        priority: { $in: ['high', 'urgent'] }
      }),
      Assessment.find()
        .populate('user', 'name email')
        .sort({ createdAt: -1 })
        .limit(10)
        .select('user totalScore severityLevel createdAt')
    ]);

    // Get severity distribution
    const severityStats = await Assessment.aggregate([
      {
        $group: {
          _id: '$severityLevel',
          count: { $sum: 1 },
          avgScore: { $avg: '$totalScore' }
        }
      }
    ]);

    // Get assessment trends (daily for last 30 days)
    const assessmentTrends = await Assessment.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
          },
          count: { $sum: 1 },
          avgScore: { $avg: '$totalScore' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Get institution statistics
    const institutionStats = await User.aggregate([
      {
        $match: { 
          isAdmin: false,
          institution: { $exists: true, $ne: null }
        }
      },
      {
        $lookup: {
          from: 'institutions',
          localField: 'institution',
          foreignField: '_id',
          as: 'institutionData'
        }
      },
      { $unwind: '$institutionData' },
      {
        $group: {
          _id: '$institution',
          institutionName: { $first: '$institutionData.name' },
          userCount: { $sum: 1 }
        }
      },
      { $sort: { userCount: -1 } },
      { $limit: 10 }
    ]);

    // Get counselor request statistics
    const counselorStats = await CounselorRequest.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get crisis detection statistics
    const crisisStats = await ChatMessage.aggregate([
      {
        $match: {
          createdAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: '$crisisDetected',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      timeframe: parseInt(timeframe),
      overview: {
        totalUsers,
        totalAssessments,
        totalInstitutions,
        totalCounselorRequests,
        totalChatMessages,
        newUsers,
        newAssessments,
        activeCrisisRequests
      },
      severityDistribution: severityStats.reduce((acc, stat) => {
        acc[stat._id] = {
          count: stat.count,
          averageScore: Math.round(stat.avgScore * 100) / 100
        };
        return acc;
      }, {}),
      assessmentTrends: assessmentTrends.map(trend => ({
        date: trend._id.date,
        count: trend.count,
        averageScore: Math.round(trend.avgScore * 100) / 100
      })),
      topInstitutions: institutionStats.map(stat => ({
        institutionId: stat._id,
        name: stat.institutionName,
        userCount: stat.userCount
      })),
      counselorRequestStatus: counselorStats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      crisisDetection: {
        totalMessages: crisisStats.reduce((sum, stat) => sum + stat.count, 0),
        crisisMessages: crisisStats.find(stat => stat._id === true)?.count || 0,
        crisisRate: crisisStats.length > 0 ? 
          Math.round((crisisStats.find(stat => stat._id === true)?.count || 0) / 
          crisisStats.reduce((sum, stat) => sum + stat.count, 0) * 100 * 100) / 100 : 0
      },
      recentAssessments: recentAssessments.map(assessment => ({
        id: assessment._id,
        user: {
          name: assessment.user.name,
          email: assessment.user.email
        },
        totalScore: assessment.totalScore,
        severityLevel: assessment.severityLevel,
        completedAt: assessment.createdAt
      }))
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      error: 'Dashboard data retrieval failed',
      message: 'An error occurred while fetching dashboard statistics'
    });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users with filtering and pagination
// @access  Admin only
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      institution,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { isAdmin: false };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (institution) {
      query.institution = institution;
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const users = await User.find(query)
      .populate('institution', 'name domain')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-password');

    const total = await User.countDocuments(query);

    // Get assessment counts for each user
    const userIds = users.map(user => user._id);
    const assessmentCounts = await Assessment.aggregate([
      { $match: { user: { $in: userIds } } },
      {
        $group: {
          _id: '$user',
          count: { $sum: 1 },
          lastAssessment: { $max: '$createdAt' },
          highestSeverity: { $max: '$severityLevel' }
        }
      }
    ]);

    const assessmentMap = assessmentCounts.reduce((acc, item) => {
      acc[item._id.toString()] = item;
      return acc;
    }, {});

    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        institution: user.institution ? {
          id: user.institution._id,
          name: user.institution.name,
          domain: user.institution.domain
        } : null,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        assessmentCount: assessmentMap[user._id.toString()]?.count || 0,
        lastAssessment: assessmentMap[user._id.toString()]?.lastAssessment,
        highestSeverity: assessmentMap[user._id.toString()]?.highestSeverity
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
    console.error('Get users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve users',
      message: 'An error occurred while fetching user data'
    });
  }
});

// @route   GET /api/admin/assessments
// @desc    Get all assessments with filtering
// @access  Admin only
router.get('/assessments', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      severityLevel,
      institution,
      startDate,
      endDate,
      email
    } = req.query;

    // Build query
    const query = {};
    
    if (severityLevel) {
      query.severityLevel = severityLevel;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (email) {
      query.userEmail = { $regex: email, $options: 'i' };
    }

    let assessments = await Assessment.find(query)
      .populate('user', 'name email institution')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Filter by institution if specified
    if (institution) {
      assessments = assessments.filter(assessment => 
        assessment.user.institution && 
        assessment.user.institution.toString() === institution
      );
    }

    const total = await Assessment.countDocuments(query);

    // Populate institution data
    await Assessment.populate(assessments, {
      path: 'user.institution',
      select: 'name domain'
    });

    res.json({
      success: true,
      assessments: assessments.map(assessment => ({
        id: assessment._id,
        user: {
          id: assessment.user._id,
          name: assessment.user.name,
          email: assessment.user.email,
          institution: assessment.user.institution ? {
            id: assessment.user.institution._id,
            name: assessment.user.institution.name,
            domain: assessment.user.institution.domain
          } : null
        },
        totalScore: assessment.totalScore,
        severityLevel: assessment.severityLevel,
        completedAt: assessment.createdAt,
        recommendations: assessment.recommendations
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
    console.error('Get assessments error:', error);
    res.status(500).json({
      error: 'Failed to retrieve assessments',
      message: 'An error occurred while fetching assessment data'
    });
  }
});

// @route   GET /api/admin/counselor-requests
// @desc    Get all counselor requests
// @access  Admin only
router.get('/counselor-requests', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status,
      priority,
      severityLevel
    } = req.query;

    // Build query
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (severityLevel) query.severityLevel = severityLevel;

    const requests = await CounselorRequest.find(query)
      .populate('user', 'name email institution')
      .populate('assessment', 'totalScore severityLevel')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await CounselorRequest.countDocuments(query);

    // Populate institution data
    await CounselorRequest.populate(requests, {
      path: 'user.institution',
      select: 'name domain'
    });

    res.json({
      success: true,
      requests: requests.map(request => ({
        id: request._id,
        user: {
          id: request.user._id,
          name: request.user.name,
          email: request.user.email,
          institution: request.user.institution ? {
            id: request.user.institution._id,
            name: request.user.institution.name,
            domain: request.user.institution.domain
          } : null
        },
        assessment: request.assessment ? {
          id: request.assessment._id,
          totalScore: request.assessment.totalScore,
          severityLevel: request.assessment.severityLevel
        } : null,
        status: request.status,
        priority: request.priority,
        severityLevel: request.severityLevel,
        assignedCounselor: request.assignedCounselor,
        scheduledAt: request.scheduledAt,
        completedAt: request.completedAt,
        createdAt: request.createdAt,
        notes: request.notes
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
    console.error('Get counselor requests error:', error);
    res.status(500).json({
      error: 'Failed to retrieve counselor requests',
      message: 'An error occurred while fetching counselor request data'
    });
  }
});

// @route   GET /api/admin/crisis-alerts
// @desc    Get crisis alerts from chat messages
// @access  Admin only
router.get('/crisis-alerts', adminAuth, async (req, res) => {
  try {
    const { page = 1, limit = 20, resolved = 'false' } = req.query;

    // Build query for crisis messages
    const query = { 
      crisisDetected: true 
    };

    if (resolved === 'false') {
      query.resolved = { $ne: true };
    }

    const crisisMessages = await ChatMessage.find(query)
      .populate('user', 'name email institution')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await ChatMessage.countDocuments(query);

    // Populate institution data
    await ChatMessage.populate(crisisMessages, {
      path: 'user.institution',
      select: 'name domain'
    });

    res.json({
      success: true,
      alerts: crisisMessages.map(message => ({
        id: message._id,
        user: {
          id: message.user._id,
          name: message.user.name,
          email: message.user.email,
          institution: message.user.institution ? {
            id: message.user.institution._id,
            name: message.user.institution.name,
            domain: message.user.institution.domain
          } : null
        },
        message: message.message,
        response: message.response,
        sentiment: message.sentiment,
        escalated: message.escalated,
        sessionId: message.sessionId,
        createdAt: message.createdAt,
        resolved: message.resolved || false
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
    console.error('Get crisis alerts error:', error);
    res.status(500).json({
      error: 'Failed to retrieve crisis alerts',
      message: 'An error occurred while fetching crisis alert data'
    });
  }
});

// @route   PUT /api/admin/crisis-alert/:id/resolve
// @desc    Mark crisis alert as resolved
// @access  Admin only
router.put('/crisis-alert/:id/resolve', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const message = await ChatMessage.findByIdAndUpdate(
      id,
      { 
        resolved: true,
        resolution: resolution || 'Resolved by admin',
        resolvedBy: req.user._id,
        resolvedAt: new Date()
      },
      { new: true }
    );

    if (!message) {
      return res.status(404).json({
        error: 'Crisis alert not found'
      });
    }

    res.json({
      success: true,
      message: 'Crisis alert marked as resolved'
    });

  } catch (error) {
    console.error('Resolve crisis alert error:', error);
    res.status(500).json({
      error: 'Failed to resolve crisis alert',
      message: 'An error occurred while resolving the crisis alert'
    });
  }
});

// @route   GET /api/admin/reports/summary
// @desc    Generate summary report
// @access  Admin only
router.get('/reports/summary', adminAuth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateQuery = {};
    if (startDate) dateQuery.$gte = new Date(startDate);
    if (endDate) dateQuery.$lte = new Date(endDate);

    const hasDateFilter = startDate || endDate;
    const assessmentQuery = hasDateFilter ? { createdAt: dateQuery } : {};

    // Get comprehensive statistics
    const [
      totalAssessments,
      severityBreakdown,
      institutionBreakdown,
      timeSeriesData,
      crisisStats
    ] = await Promise.all([
      Assessment.countDocuments(assessmentQuery),
      
      Assessment.aggregate([
        ...(hasDateFilter ? [{ $match: assessmentQuery }] : []),
        {
          $group: {
            _id: '$severityLevel',
            count: { $sum: 1 },
            averageScore: { $avg: '$totalScore' }
          }
        }
      ]),
      
      Assessment.aggregate([
        ...(hasDateFilter ? [{ $match: assessmentQuery }] : []),
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'userData'
          }
        },
        { $unwind: '$userData' },
        {
          $lookup: {
            from: 'institutions',
            localField: 'userData.institution',
            foreignField: '_id',
            as: 'institutionData'
          }
        },
        {
          $group: {
            _id: {
              institution: { $arrayElemAt: ['$institutionData.name', 0] },
              hasInstitution: { $gt: [{ $size: '$institutionData' }, 0] }
            },
            count: { $sum: 1 }
          }
        }
      ]),
      
      Assessment.aggregate([
        ...(hasDateFilter ? [{ $match: assessmentQuery }] : []),
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
            },
            count: { $sum: 1 },
            averageScore: { $avg: '$totalScore' }
          }
        },
        { $sort: { '_id.date': 1 } }
      ]),
      
      ChatMessage.aggregate([
        ...(hasDateFilter ? [{ $match: { createdAt: dateQuery } }] : []),
        {
          $group: {
            _id: '$crisisDetected',
            count: { $sum: 1 }
          }
        }
      ])
    ]);

    res.json({
      success: true,
      reportPeriod: {
        startDate: startDate || 'All time',
        endDate: endDate || 'Present'
      },
      summary: {
        totalAssessments,
        severityDistribution: severityBreakdown.reduce((acc, item) => {
          acc[item._id] = {
            count: item.count,
            percentage: Math.round((item.count / totalAssessments) * 100),
            averageScore: Math.round(item.averageScore * 100) / 100
          };
          return acc;
        }, {}),
        institutionBreakdown: institutionBreakdown.map(item => ({
          institution: item._id.hasInstitution ? item._id.institution : 'Independent Users',
          count: item.count,
          percentage: Math.round((item.count / totalAssessments) * 100)
        })),
        dailyTrends: timeSeriesData.map(item => ({
          date: item._id.date,
          assessments: item.count,
          averageScore: Math.round(item.averageScore * 100) / 100
        })),
        crisisDetection: {
          totalMessages: crisisStats.reduce((sum, stat) => sum + stat.count, 0),
          crisisMessages: crisisStats.find(stat => stat._id === true)?.count || 0,
          crisisRate: crisisStats.length > 0 ? 
            Math.round((crisisStats.find(stat => stat._id === true)?.count || 0) / 
            crisisStats.reduce((sum, stat) => sum + stat.count, 0) * 100 * 100) / 100 : 0
        }
      }
    });

  } catch (error) {
    console.error('Generate summary report error:', error);
    res.status(500).json({
      error: 'Report generation failed',
      message: 'An error occurred while generating the summary report'
    });
  }
});

module.exports = router;