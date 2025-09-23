const express = require('express');
const { body, validationResult } = require('express-validator');
const { Institution, User } = require('../models');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/institution/check
// @desc    Check if email domain belongs to partner institution
// @access  Public
router.post('/check', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: 'Email is required'
      });
    }

    // Extract domain from email
    const emailDomain = email.split('@')[1];
    
    if (!emailDomain) {
      return res.status(400).json({
        error: 'Invalid email format'
      });
    }

    // Find institution by domain
    const institution = await Institution.findOne({ 
      domain: emailDomain,
      isActive: true 
    });

    if (!institution) {
      return res.status(404).json({
        isPartner: false,
        message: 'No partnership found for this institution'
      });
    }

    res.json({
      isPartner: true,
      institution: {
        id: institution._id,
        name: institution.name,
        domain: institution.domain,
        contactEmail: institution.contactEmail,
        partnershipLevel: institution.partnershipLevel,
        settings: institution.settings
      },
      message: `Welcome! We have a partnership with ${institution.name}`
    });

  } catch (error) {
    console.error('Institution check error:', error);
    res.status(500).json({
      error: 'Institution check failed',
      message: 'An error occurred while checking institution partnership'
    });
  }
});

// @route   GET /api/institution/list
// @desc    Get list of all partner institutions
// @access  Public
router.get('/list', async (req, res) => {
  try {
    const institutions = await Institution.find({ isActive: true })
      .select('name domain contactEmail partnershipLevel')
      .sort({ name: 1 });

    res.json({
      success: true,
      institutions,
      total: institutions.length
    });

  } catch (error) {
    console.error('Institution list error:', error);
    res.status(500).json({
      error: 'Failed to retrieve institutions',
      message: 'An error occurred while fetching institution list'
    });
  }
});

// @route   POST /api/institution/create
// @desc    Create new partner institution
// @access  Admin only
router.post('/create', adminAuth, [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),
  body('domain')
    .isLength({ min: 3 })
    .matches(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    .withMessage('Please provide a valid domain (e.g., university.edu)'),
  body('contactEmail')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid contact email'),
  body('partnershipLevel')
    .optional()
    .isIn(['basic', 'premium', 'enterprise'])
    .withMessage('Partnership level must be basic, premium, or enterprise')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { 
      name, 
      domain, 
      contactEmail, 
      contactPhone, 
      address, 
      partnershipLevel = 'basic',
      settings = {}
    } = req.body;

    // Check if domain already exists
    const existingInstitution = await Institution.findOne({ domain: domain.toLowerCase() });
    if (existingInstitution) {
      return res.status(400).json({
        error: 'Domain already exists',
        message: 'An institution with this domain already exists'
      });
    }

    // Create new institution
    const institution = new Institution({
      name,
      domain: domain.toLowerCase(),
      contactEmail,
      contactPhone,
      address,
      partnershipLevel,
      settings: {
        alertsEnabled: settings.alertsEnabled !== false,
        severityThreshold: settings.severityThreshold || 'high'
      }
    });

    await institution.save();

    res.status(201).json({
      success: true,
      institution: {
        id: institution._id,
        name: institution.name,
        domain: institution.domain,
        contactEmail: institution.contactEmail,
        partnershipLevel: institution.partnershipLevel,
        settings: institution.settings,
        createdAt: institution.createdAt
      },
      message: 'Institution partnership created successfully'
    });

  } catch (error) {
    console.error('Institution creation error:', error);
    res.status(500).json({
      error: 'Institution creation failed',
      message: 'An error occurred while creating the institution partnership'
    });
  }
});

// @route   PUT /api/institution/:id
// @desc    Update institution details
// @access  Admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.createdAt;
    delete updates.updatedAt;

    const institution = await Institution.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!institution) {
      return res.status(404).json({
        error: 'Institution not found'
      });
    }

    res.json({
      success: true,
      institution,
      message: 'Institution updated successfully'
    });

  } catch (error) {
    console.error('Institution update error:', error);
    res.status(500).json({
      error: 'Institution update failed',
      message: 'An error occurred while updating the institution'
    });
  }
});

// @route   DELETE /api/institution/:id
// @desc    Deactivate institution (soft delete)
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({
        error: 'Institution not found'
      });
    }

    res.json({
      success: true,
      message: 'Institution deactivated successfully'
    });

  } catch (error) {
    console.error('Institution deactivation error:', error);
    res.status(500).json({
      error: 'Institution deactivation failed',
      message: 'An error occurred while deactivating the institution'
    });
  }
});

// @route   GET /api/institution/:id/users
// @desc    Get users from specific institution
// @access  Admin only
router.get('/:id/users', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        error: 'Institution not found'
      });
    }

    const users = await User.find({ institution: id })
      .select('name email isAdmin lastLogin createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments({ institution: id });

    res.json({
      success: true,
      institution: {
        id: institution._id,
        name: institution.name,
        domain: institution.domain
      },
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Institution users error:', error);
    res.status(500).json({
      error: 'Failed to retrieve institution users',
      message: 'An error occurred while fetching users for this institution'
    });
  }
});

// @route   GET /api/institution/:id/stats
// @desc    Get institution statistics
// @access  Admin only
router.get('/:id/stats', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const institution = await Institution.findById(id);
    if (!institution) {
      return res.status(404).json({
        error: 'Institution not found'
      });
    }

    // Get user count
    const totalUsers = await User.countDocuments({ institution: id });

    // Get users from the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newUsers = await User.countDocuments({
      institution: id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const activeUsers = await User.countDocuments({
      institution: id,
      lastLogin: { $gte: thirtyDaysAgo }
    });

    res.json({
      success: true,
      institution: {
        id: institution._id,
        name: institution.name,
        domain: institution.domain
      },
      stats: {
        totalUsers,
        newUsers,
        activeUsers,
        partnershipLevel: institution.partnershipLevel,
        isActive: institution.isActive,
        joinedAt: institution.createdAt
      }
    });

  } catch (error) {
    console.error('Institution stats error:', error);
    res.status(500).json({
      error: 'Failed to retrieve institution statistics',
      message: 'An error occurred while fetching institution statistics'
    });
  }
});

module.exports = router;