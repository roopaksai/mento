const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { User, MusicRecommendation } = require('./models');

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mental-wellness', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ Connected to MongoDB');

    // Create admin user if it doesn't exist
    const adminExists = await User.findOne({ email: 'admin@mentalwell.com' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@mentalwell.com',
        password: await bcrypt.hash('admin123', 12),
        age: 30,
        role: 'admin',
        institution: 'MentalWell System'
      });
      await adminUser.save();
      console.log('✅ Admin user created (admin@mentalwell.com / admin123)');
    }

    // Add sample music recommendations if none exist
    const musicCount = await MusicRecommendation.countDocuments();
    if (musicCount === 0) {
      const sampleMusic = [
        // Minimal severity
        {
          title: 'Weightless',
          artist: 'Marconi Union',
          genre: 'Ambient',
          mood: 'calm',
          severityLevel: 'minimal',
          spotifyUrl: 'https://open.spotify.com/track/1nJsbWm3Yy2WSqBwj3c2Kx',
          description: 'Scientifically designed to reduce anxiety'
        },
        {
          title: 'Claire de Lune',
          artist: 'Claude Debussy',
          genre: 'Classical',
          mood: 'peaceful',
          severityLevel: 'minimal',
          description: 'Gentle classical piece for relaxation'
        },
        {
          title: 'Aqueous Transmission',
          artist: 'Incubus',
          genre: 'Alternative',
          mood: 'reflective',
          severityLevel: 'minimal',
          description: 'Calming instrumental with nature sounds'
        },

        // Mild severity
        {
          title: 'Holocene',
          artist: 'Bon Iver',
          genre: 'Indie Folk',
          mood: 'contemplative',
          severityLevel: 'mild',
          description: 'Introspective and emotionally uplifting'
        },
        {
          title: 'Mad World',
          artist: 'Gary Jules',
          genre: 'Alternative',
          mood: 'melancholic',
          severityLevel: 'mild',
          description: 'Gentle processing of difficult emotions'
        },
        {
          title: 'The Night We Met',
          artist: 'Lord Huron',
          genre: 'Indie Folk',
          mood: 'nostalgic',
          severityLevel: 'mild',
          description: 'Beautiful melody for emotional reflection'
        },

        // Moderate severity
        {
          title: 'Breathe',
          artist: 'Pink Floyd',
          genre: 'Progressive Rock',
          mood: 'introspective',
          severityLevel: 'moderate',
          description: 'Encouraging mindful breathing and reflection'
        },
        {
          title: 'Hurt',
          artist: 'Johnny Cash',
          genre: 'Alternative Country',
          mood: 'cathartic',
          severityLevel: 'moderate',
          description: 'Powerful expression of pain and redemption'
        },
        {
          title: 'The Sound of Silence',
          artist: 'Disturbed',
          genre: 'Metal',
          mood: 'intense',
          severityLevel: 'moderate',
          description: 'Intense but cathartic release'
        },

        // Severe severity
        {
          title: 'Heavy',
          artist: 'Linkin Park ft. Kiiara',
          genre: 'Alternative Rock',
          mood: 'supportive',
          severityLevel: 'severe',
          description: 'Understanding and validating difficult emotions'
        },
        {
          title: 'Scars to Your Beautiful',
          artist: 'Alessia Cara',
          genre: 'Pop',
          mood: 'empowering',
          severityLevel: 'severe',
          description: 'Self-acceptance and body positivity'
        },
        {
          title: 'Unwell',
          artist: 'Matchbox Twenty',
          genre: 'Alternative Rock',
          mood: 'understanding',
          severityLevel: 'severe',
          description: 'Acknowledging mental health struggles'
        }
      ];

      await MusicRecommendation.insertMany(sampleMusic);
      console.log('✅ Sample music recommendations added');
    }

    console.log('🎉 Database initialization complete!');
    console.log('\n📋 Quick Start:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the frontend: cd ../frontend && npm start');
    console.log('3. Admin login: admin@mentalwell.com / admin123');
    console.log('4. Open http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.disconnect();
  }
};

// Run initialization
initializeDatabase();