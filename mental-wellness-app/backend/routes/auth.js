const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { User, Institution } = require('../models');

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Validation middleware
const validateLogin = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email')
];

const validateRegister = [
  ...validateLogin,
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// @route   POST /api/auth/login
// @desc    Login user (or register if first time)
// @access  Public
router.post('/login', validateLogin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email }).populate('institution');

    if (!user) {
      // Create new user
      user = new User({
        name,
        email,
        isAdmin: email === process.env.ADMIN_EMAIL
      });

      // Check if user belongs to a partner institution
      const emailDomain = email.split('@')[1];
      const institution = await Institution.findOne({ domain: emailDomain });
      
      if (institution) {
        user.institution = institution._id;
      }

      await user.save();
      await user.populate('institution');
    } else {
      // Update last login and name if changed
      user.name = name;
      user.lastLogin = new Date();
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Prepare response data
    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin
      },
      message: 'Login successful'
    };

    // Add institution info if applicable
    if (user.institution) {
      responseData.institution = {
        id: user.institution._id,
        name: user.institution.name,
        domain: user.institution.domain,
        contactEmail: user.institution.contactEmail,
        partnershipLevel: user.institution.partnershipLevel
      };
      responseData.message = `Welcome! We see you're from ${user.institution.name}`;
    }

    res.status(200).json(responseData);

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'Login failed',
      message: 'An error occurred during login'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Register new user with password
// @access  Public
router.post('/register', validateRegister, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        error: 'User already exists',
        message: 'An account with this email already exists'
      });
    }

    // Check institution partnership
    const emailDomain = email.split('@')[1];
    const institution = await Institution.findOne({ domain: emailDomain });

    // Create new user
    const user = new User({
      name,
      email,
      password,
      isAdmin: email === process.env.ADMIN_EMAIL,
      institution: institution?._id
    });

    await user.save();
    await user.populate('institution');

    // Generate JWT token
    const token = generateToken(user._id);

    const responseData = {
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      },
      message: 'Registration successful'
    };

    if (user.institution) {
      responseData.institution = {
        id: user.institution._id,
        name: user.institution.name,
        domain: user.institution.domain,
        contactEmail: user.institution.contactEmail
      };
    }

    res.status(201).json(responseData);

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'Registration failed',
      message: 'An error occurred during registration'
    });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'No token provided',
        message: 'Access denied'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId)
      .populate('institution')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: 'Invalid token'
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      },
      institution: user.institution ? {
        id: user.institution._id,
        name: user.institution.name,
        domain: user.institution.domain,
        contactEmail: user.institution.contactEmail
      } : null
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(401).json({
      error: 'Invalid token',
      message: 'Access denied'
    });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post('/logout', (req, res) => {
  res.json({
    success: true,
    message: 'Logout successful. Please remove token from client storage.'
  });
});

// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Public
router.get('/verify', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        valid: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({
        valid: false,
        message: 'User not found'
      });
    }

    res.json({
      valid: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });

  } catch (error) {
    res.status(401).json({
      valid: false,
      message: 'Invalid token'
    });
  }
});

module.exports = router;