const mongoose = require('mongoose');
const { User, Institution, MusicRecommendation } = require('./models');
require('dotenv').config();

// Sample institution data
const SAMPLE_INSTITUTIONS = [
  {
    name: 'Mental Health University',
    domain: 'university.edu',
    contactEmail: 'counseling@university.edu',
    contactPhone: '+1-555-0123',
    address: '123 Campus Drive, University City, UC 12345',
    partnershipLevel: 'premium',
    settings: {
      alertsEnabled: true,
      severityThreshold: 'high'
    }
  },
  {
    name: 'Wellness College',
    domain: 'college.org',
    contactEmail: 'support@college.org',
    contactPhone: '+1-555-0124',
    address: '456 Education Blvd, College Town, CT 67890',
    partnershipLevel: 'basic',
    settings: {
      alertsEnabled: true,
      severityThreshold: 'moderate'
    }
  },
  {
    name: 'Care Institute',
    domain: 'institute.ac.in',
    contactEmail: 'help@institute.ac.in',
    contactPhone: '+91-555-0125',
    address: 'Plot 789, Tech Park, Institute City, IC 54321',
    partnershipLevel: 'enterprise',
    settings: {
      alertsEnabled: true,
      severityThreshold: 'severe'
    }
  },
  {
    name: 'Global Health Academy',
    domain: 'globalhealth.edu',
    contactEmail: 'wellness@globalhealth.edu',
    contactPhone: '+1-555-0126',
    partnershipLevel: 'premium',
    settings: {
      alertsEnabled: true,
      severityThreshold: 'high'
    }
  }
];

// Sample music data (expanded from the route file)
const SAMPLE_MUSIC = [
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
  {
    severityLevel: 'low',
    title: 'Can\'t Stop the Feeling!',
    artist: 'Justin Timberlake',
    genre: 'Pop',
    mood: 'energizing',
    duration: 236,
    youtubeUrl: 'https://www.youtube.com/watch?v=ru0K8uYEZWw',
    description: 'Upbeat and infectious feel-good song',
    tags: ['upbeat', 'dance', 'positive']
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
  {
    severityLevel: 'moderate',
    title: 'Holocene',
    artist: 'Bon Iver',
    genre: 'Indie Folk',
    mood: 'meditative',
    duration: 337,
    youtubeUrl: 'https://www.youtube.com/watch?v=TWcyIpul8OE',
    description: 'Peaceful and contemplative indie folk',
    tags: ['peaceful', 'nature', 'contemplative']
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
  {
    severityLevel: 'high',
    title: 'Svefn-g-englar',
    artist: 'Sigur Rós',
    genre: 'Post-Rock',
    mood: 'peaceful',
    duration: 601,
    youtubeUrl: 'https://www.youtube.com/watch?v=8LeQN249Jqw',
    description: 'Ethereal and healing post-rock composition',
    tags: ['ethereal', 'healing', 'ambient']
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
  },
  {
    severityLevel: 'severe',
    title: 'On Earth as It Is in Heaven',
    artist: 'Angels & Airwaves',
    genre: 'Alternative Rock',
    mood: 'calming',
    duration: 343,
    youtubeUrl: 'https://www.youtube.com/watch?v=oB4KpPMGDJE',
    description: 'Gentle alternative rock with healing themes',
    tags: ['healing', 'gentle', 'hopeful']
  }
];

async function initializeDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mental_wellness', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🍃 Connected to MongoDB');

    // Check if admin user exists
    const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL || 'admin@mentalwellness.com' });
    
    if (!adminExists) {
      // Create admin user
      const adminUser = new User({
        name: 'System Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@mentalwellness.com',
        isAdmin: true
      });
      
      await adminUser.save();
      console.log('👤 Admin user created');
    } else {
      console.log('👤 Admin user already exists');
    }

    // Check if institutions exist
    const institutionCount = await Institution.countDocuments();
    
    if (institutionCount === 0) {
      await Institution.insertMany(SAMPLE_INSTITUTIONS);
      console.log('🏢 Sample institutions created');
    } else {
      console.log('🏢 Institutions already exist');
    }

    // Check if music recommendations exist
    const musicCount = await MusicRecommendation.countDocuments();
    
    if (musicCount === 0) {
      await MusicRecommendation.insertMany(SAMPLE_MUSIC);
      console.log('🎵 Sample music recommendations created');
    } else {
      console.log('🎵 Music recommendations already exist');
    }

    console.log('✅ Database initialization completed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = { initializeDatabase };