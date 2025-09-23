const express = require('express');
const { MusicRecommendation } = require('../models');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();

// Default music recommendations for each severity level
const DEFAULT_MUSIC_DATA = [
  // Low severity - uplifting and positive music
  {
    severityLevel: 'low',
    title: 'Good as Hell',
    artist: 'Lizzo',
    genre: 'Pop',
    mood: 'uplifting',
    duration: 219,
    youtubeUrl: 'https://www.youtube.com/watch?v=SmbmeOgWsqE',
    description: 'Empowering and confidence-boosting anthem',
    tags: ['confidence', 'empowerment', 'positive']
  },
  {
    severityLevel: 'low',
    title: 'Happy',
    artist: 'Pharrell Williams',
    genre: 'Pop',
    mood: 'uplifting',
    duration: 232,
    youtubeUrl: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs',
    description: 'Feel-good music to boost your mood',
    tags: ['happiness', 'joy', 'energetic']
  },
  {
    severityLevel: 'low',
    title: 'Walking on Sunshine',
    artist: 'Katrina and the Waves',
    genre: 'Rock',
    mood: 'energizing',
    duration: 239,
    youtubeUrl: 'https://www.youtube.com/watch?v=iPUmE-tne5U',
    description: 'Classic feel-good rock anthem',
    tags: ['classic', 'sunshine', 'energetic']
  },

  // Moderate severity - calming and hopeful music
  {
    severityLevel: 'moderate',
    title: 'Breathe Me',
    artist: 'Sia',
    genre: 'Alternative',
    mood: 'calming',
    duration: 273,
    youtubeUrl: 'https://www.youtube.com/watch?v=hSH7fblcGWM',
    description: 'Emotional but hopeful song about healing',
    tags: ['healing', 'emotional', 'hope']
  },
  {
    severityLevel: 'moderate',
    title: 'The Sound of Silence',
    artist: 'Simon & Garfunkel',
    genre: 'Folk',
    mood: 'meditative',
    duration: 200,
    youtubeUrl: 'https://www.youtube.com/watch?v=4fWyzwo1xg0',
    description: 'Contemplative classic for reflection',
    tags: ['contemplative', 'classic', 'reflection']
  },
  {
    severityLevel: 'moderate',
    title: 'Weightless',
    artist: 'Marconi Union',
    genre: 'Ambient',
    mood: 'calming',
    duration: 485,
    youtubeUrl: 'https://www.youtube.com/watch?v=UfcAVejslrU',
    description: 'Scientifically designed to reduce anxiety',
    tags: ['anxiety-relief', 'ambient', 'therapeutic']
  },

  // High severity - very calming and therapeutic music
  {
    severityLevel: 'high',
    title: 'Clair de Lune',
    artist: 'Claude Debussy',
    genre: 'Classical',
    mood: 'peaceful',
    duration: 300,
    youtubeUrl: 'https://www.youtube.com/watch?v=CvFH_6DNRCY',
    description: 'Beautiful classical piece for deep relaxation',
    tags: ['classical', 'relaxation', 'peaceful']
  },
  {
    severityLevel: 'high',
    title: 'River',
    artist: 'Joni Mitchell',
    genre: 'Folk',
    mood: 'meditative',
    duration: 240,
    youtubeUrl: 'https://www.youtube.com/watch?v=3NH-ctddY9o',
    description: 'Gentle, reflective song for difficult times',
    tags: ['gentle', 'reflective', 'comfort']
  },
  {
    severityLevel: 'high',
    title: 'Aqueous Transmission',
    artist: 'Incubus',
    genre: 'Alternative',
    mood: 'meditative',
    duration: 448,
    youtubeUrl: 'https://www.youtube.com/watch?v=eQK7KSTQfaw',
    description: 'Long, ambient piece for deep meditation',
    tags: ['meditation', 'ambient', 'lengthy']
  },

  // Severe severity - therapeutic and crisis-appropriate music
  {
    severityLevel: 'severe',
    title: 'Gymnopédie No. 1',
    artist: 'Erik Satie',
    genre: 'Classical',
    mood: 'peaceful',
    duration: 210,
    youtubeUrl: 'https://www.youtube.com/watch?v=S-Xm7s9eGxU',
    description: 'Gentle classical piece for deep emotional support',
    tags: ['classical', 'gentle', 'therapeutic']
  },
  {
    severityLevel: 'severe',
    title: 'Mad World',
    artist: 'Gary Jules',
    genre: 'Alternative',
    mood: 'meditative',
    duration: 193,
    youtubeUrl: 'https://www.youtube.com/watch?v=4N3N1MlvVc4',
    description: 'Haunting but cathartic song for processing emotions',
    tags: ['cathartic', 'emotional', 'processing']
  },
  {
    severityLevel: 'severe',
    title: 'Spiegel im Spiegel',
    artist: 'Arvo Pärt',
    genre: 'Classical',
    mood: 'peaceful',
    duration: 480,
    youtubeUrl: 'https://www.youtube.com/watch?v=TJ6Mzvh3XCc',
    description: 'Minimalist classical piece for deep contemplation',
    tags: ['minimalist', 'contemplation', 'peaceful']
  }
];

// Initialize default music data
const initializeDefaultMusic = async () => {
  try {
    const existingCount = await MusicRecommendation.countDocuments();
    
    if (existingCount === 0) {
      await MusicRecommendation.insertMany(DEFAULT_MUSIC_DATA);
      console.log('✨ Default music recommendations initialized');
    }
  } catch (error) {
    console.error('Error initializing default music:', error);
  }
};

// Call initialization when module loads
initializeDefaultMusic();

// @route   GET /api/music/recommendations/:severityLevel
// @desc    Get music recommendations by severity level
// @access  Public
router.get('/recommendations/:severityLevel', async (req, res) => {
  try {
    const { severityLevel } = req.params;
    const { mood, limit = 10, shuffle = 'true' } = req.query;

    // Validate severity level
    const validSeverityLevels = ['low', 'moderate', 'high', 'severe'];
    if (!validSeverityLevels.includes(severityLevel)) {
      return res.status(400).json({
        error: 'Invalid severity level',
        message: 'Severity level must be one of: low, moderate, high, severe'
      });
    }

    // Build query
    const query = { 
      severityLevel, 
      isActive: true 
    };

    if (mood) {
      query.mood = mood;
    }

    let recommendations = await MusicRecommendation.find(query)
      .select('-__v -updatedAt')
      .limit(parseInt(limit));

    // Shuffle recommendations if requested
    if (shuffle === 'true') {
      recommendations = recommendations.sort(() => Math.random() - 0.5);
    }

    // Add therapy context based on severity level
    const therapyContext = getTherapyContext(severityLevel);

    res.json({
      success: true,
      severityLevel,
      recommendations: recommendations.map(rec => ({
        id: rec._id,
        title: rec.title,
        artist: rec.artist,
        genre: rec.genre,
        mood: rec.mood,
        duration: rec.duration,
        durationFormatted: formatDuration(rec.duration),
        spotifyUrl: rec.spotifyUrl,
        youtubeUrl: rec.youtubeUrl,
        description: rec.description,
        tags: rec.tags
      })),
      therapyContext,
      total: recommendations.length,
      availableMoods: await getAvailableMoods(severityLevel)
    });

  } catch (error) {
    console.error('Music recommendations error:', error);
    res.status(500).json({
      error: 'Failed to retrieve recommendations',
      message: 'An error occurred while fetching music recommendations'
    });
  }
});

// @route   GET /api/music/moods/:severityLevel
// @desc    Get available moods for severity level
// @access  Public
router.get('/moods/:severityLevel', async (req, res) => {
  try {
    const { severityLevel } = req.params;

    const moods = await MusicRecommendation.distinct('mood', { 
      severityLevel, 
      isActive: true 
    });

    res.json({
      success: true,
      severityLevel,
      moods: moods.sort()
    });

  } catch (error) {
    console.error('Get moods error:', error);
    res.status(500).json({
      error: 'Failed to retrieve moods',
      message: 'An error occurred while fetching available moods'
    });
  }
});

// @route   GET /api/music/all
// @desc    Get all music recommendations for admin
// @access  Admin only
router.get('/all', adminAuth, async (req, res) => {
  try {
    const { severityLevel, mood, page = 1, limit = 20 } = req.query;

    // Build query
    const query = {};
    if (severityLevel) query.severityLevel = severityLevel;
    if (mood) query.mood = mood;

    const recommendations = await MusicRecommendation.find(query)
      .sort({ severityLevel: 1, mood: 1, title: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MusicRecommendation.countDocuments(query);

    res.json({
      success: true,
      recommendations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get all music error:', error);
    res.status(500).json({
      error: 'Failed to retrieve music recommendations',
      message: 'An error occurred while fetching all music recommendations'
    });
  }
});

// @route   POST /api/music/create
// @desc    Create new music recommendation
// @access  Admin only
router.post('/create', adminAuth, async (req, res) => {
  try {
    const {
      severityLevel,
      title,
      artist,
      genre,
      mood,
      duration,
      spotifyUrl,
      youtubeUrl,
      description,
      tags = []
    } = req.body;

    // Validate required fields
    if (!severityLevel || !title || !artist || !genre || !mood) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'severityLevel, title, artist, genre, and mood are required'
      });
    }

    const recommendation = new MusicRecommendation({
      severityLevel,
      title,
      artist,
      genre,
      mood,
      duration,
      spotifyUrl,
      youtubeUrl,
      description,
      tags
    });

    await recommendation.save();

    res.status(201).json({
      success: true,
      recommendation,
      message: 'Music recommendation created successfully'
    });

  } catch (error) {
    console.error('Create music recommendation error:', error);
    res.status(500).json({
      error: 'Creation failed',
      message: 'An error occurred while creating the music recommendation'
    });
  }
});

// @route   PUT /api/music/:id
// @desc    Update music recommendation
// @access  Admin only
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated
    delete updates._id;
    delete updates.createdAt;

    const recommendation = await MusicRecommendation.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        error: 'Music recommendation not found'
      });
    }

    res.json({
      success: true,
      recommendation,
      message: 'Music recommendation updated successfully'
    });

  } catch (error) {
    console.error('Update music recommendation error:', error);
    res.status(500).json({
      error: 'Update failed',
      message: 'An error occurred while updating the music recommendation'
    });
  }
});

// @route   DELETE /api/music/:id
// @desc    Delete music recommendation
// @access  Admin only
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    const recommendation = await MusicRecommendation.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!recommendation) {
      return res.status(404).json({
        error: 'Music recommendation not found'
      });
    }

    res.json({
      success: true,
      message: 'Music recommendation deactivated successfully'
    });

  } catch (error) {
    console.error('Delete music recommendation error:', error);
    res.status(500).json({
      error: 'Deletion failed',
      message: 'An error occurred while deleting the music recommendation'
    });
  }
});

// Helper functions
function formatDuration(seconds) {
  if (!seconds) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function getTherapyContext(severityLevel) {
  const contexts = {
    low: {
      title: 'Mood Enhancement',
      description: 'These uplifting tracks can help maintain your positive mood and energy levels.',
      suggestions: [
        'Listen during daily activities to boost energy',
        'Use as background music while working or exercising',
        'Share with friends to spread positive vibes'
      ]
    },
    moderate: {
      title: 'Stress Relief & Relaxation',
      description: 'These calming pieces can help reduce stress and promote relaxation.',
      suggestions: [
        'Listen during breaks or quiet time',
        'Use for meditation or mindfulness practice',
        'Play before bedtime to help unwind'
      ]
    },
    high: {
      title: 'Therapeutic Support',
      description: 'These carefully selected tracks can provide emotional support and promote healing.',
      suggestions: [
        'Find a quiet, comfortable space to listen',
        'Focus on breathing while listening',
        'Consider journaling after listening',
        'Reach out to support networks if needed'
      ]
    },
    severe: {
      title: 'Crisis Support & Grounding',
      description: 'These gentle, therapeutic pieces can help with grounding and emotional regulation.',
      suggestions: [
        'Listen in a safe, comfortable environment',
        'Practice grounding techniques while listening',
        'Consider professional support',
        'Use crisis resources if needed'
      ],
      crisisResources: [
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
      ]
    }
  };

  return contexts[severityLevel] || contexts.moderate;
}

async function getAvailableMoods(severityLevel) {
  try {
    return await MusicRecommendation.distinct('mood', { 
      severityLevel, 
      isActive: true 
    });
  } catch (error) {
    console.error('Error getting available moods:', error);
    return [];
  }
}

module.exports = router;