import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const MusicPage = () => {
  const [userName, setUserName] = useState('');
  const [currentMood, setCurrentMood] = useState('calm');
  const [isPlaying, setIsPlaying] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    if (!name) {
      navigate('/login');
      return;
    }
    setUserName(name);
  }, [navigate]);

  // Curated music recommendations by mood/severity
  const musicLibrary = {
    calm: {
      title: 'Peaceful Moments',
      description: 'Gentle sounds to help you find inner peace',
      color: 'from-green-400 to-blue-500',
      emoji: '🌊',
      tracks: [
        {
          id: 1,
          title: 'Ocean Waves',
          artist: 'Nature Sounds',
          duration: '10:00',
          description: 'Gentle ocean waves for deep relaxation',
          url: 'https://www.youtube.com/watch?v=F77HUf_92h4' // Sample nature sound
        },
        {
          id: 2,
          title: 'Morning Rain',
          artist: 'Peaceful Vibes',
          duration: '8:30',
          description: 'Soft rain sounds for meditation',
          url: 'https://www.youtube.com/watch?v=yIQd2ya0Ziw'
        },
        {
          id: 3,
          title: 'Piano Serenity',
          artist: 'Calm Pianist',
          duration: '12:15',
          description: 'Gentle piano melodies for tranquility',
          url: 'https://www.youtube.com/watch?v=6p0DAz_30qQ'
        }
      ]
    },
    uplifting: {
      title: 'Mood Boosters',
      description: 'Upbeat tracks to lift your spirits',
      color: 'from-yellow-400 to-orange-500',
      emoji: '☀️',
      tracks: [
        {
          id: 4,
          title: 'Good Vibes Only',
          artist: 'Happy Tunes',
          duration: '3:45',
          description: 'Energetic beat to brighten your day',
          url: 'https://www.youtube.com/watch?v=ZbZSe6N_BXs'
        },
        {
          id: 5,
          title: 'Sunshine Melody',
          artist: 'Cheerful Beats',
          duration: '4:12',
          description: 'Feel-good music for positive energy',
          url: 'https://www.youtube.com/watch?v=y6Sxv-sUYtM'
        },
        {
          id: 6,
          title: 'Dancing in the Light',
          artist: 'Joyful Rhythms',
          duration: '3:58',
          description: 'Upbeat tempo to get you moving',
          url: 'https://www.youtube.com/watch?v=nfs8NYg7yQM'
        }
      ]
    },
    healing: {
      title: 'Healing Journey',
      description: 'Therapeutic sounds for emotional healing',
      color: 'from-purple-400 to-pink-500',
      emoji: '💙',
      tracks: [
        {
          id: 7,
          title: 'Healing Frequencies',
          artist: 'Sound Therapy',
          duration: '15:00',
          description: '528Hz frequency for healing and repair',
          url: 'https://www.youtube.com/watch?v=WvqBFHjOJdM'
        },
        {
          id: 8,
          title: 'Gentle Strings',
          artist: 'Therapeutic Music',
          duration: '9:30',
          description: 'Soft string instruments for emotional release',
          url: 'https://www.youtube.com/watch?v=1ZYbU82GVz4'
        },
        {
          id: 9,
          title: 'Meditation Bell',
          artist: 'Mindful Sounds',
          duration: '20:00',
          description: 'Tibetan singing bowls for deep meditation',
          url: 'https://www.youtube.com/watch?v=kYV7aSX7sVE'
        }
      ]
    }
  };

  // Motivational quotes by category
  const quotes = {
    calm: [
      "Peace comes from within. Do not seek it without. - Buddha",
      "In the midst of movement and chaos, keep stillness inside of you. - Deepak Chopra",
      "The present moment is the only time over which we have dominion. - Thích Nhất Hạnh"
    ],
    uplifting: [
      "Every day is a new beginning. Take a deep breath and start again.",
      "You are braver than you believe, stronger than you seem, and smarter than you think. - A.A. Milne",
      "The only way to do great work is to love what you do. - Steve Jobs"
    ],
    healing: [
      "Healing is not linear. Be patient with yourself.",
      "You have been assigned this mountain to show others it can be moved.",
      "Your current situation is not your final destination. The best is yet to come."
    ]
  };

  const currentPlaylist = musicLibrary[currentMood];
  const currentQuotes = quotes[currentMood];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  const playTrack = (trackId) => {
    setIsPlaying(isPlaying === trackId ? null : trackId);
  };

  const nextQuote = () => {
    setCurrentQuoteIndex((currentQuoteIndex + 1) % currentQuotes.length);
  };

  const openMusicLink = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-wellness py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Music Therapy for {userName} 🎵
          </h1>
          <p className="text-white/80 text-lg">
            Let healing sounds guide your journey to wellness
          </p>
        </div>

        {/* Mood Selector */}
        <div className="wellness-card mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Choose Your Mood</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {Object.entries(musicLibrary).map(([mood, data]) => (
              <button
                key={mood}
                onClick={() => setCurrentMood(mood)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  currentMood === mood 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="text-3xl mb-2">{data.emoji}</div>
                <h4 className="font-semibold text-gray-800">{data.title}</h4>
                <p className="text-gray-600 text-sm">{data.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Music Player */}
          <div className="wellness-card">
            <div className={`text-center mb-6 p-4 rounded-xl bg-gradient-to-r ${currentPlaylist.color}`}>
              <div className="text-4xl mb-2">{currentPlaylist.emoji}</div>
              <h2 className="text-2xl font-bold text-white">{currentPlaylist.title}</h2>
              <p className="text-white/90">{currentPlaylist.description}</p>
            </div>

            <div className="space-y-4">
              {currentPlaylist.tracks.map((track) => (
                <div key={track.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800">{track.title}</h4>
                      <p className="text-gray-600 text-sm">{track.artist} • {track.duration}</p>
                      <p className="text-gray-500 text-xs mt-1">{track.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => playTrack(track.id)}
                        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isPlaying === track.id 
                            ? 'bg-red-500 hover:bg-red-600 text-white' 
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {isPlaying === track.id ? '⏸️' : '▶️'}
                      </button>
                      <button
                        onClick={() => openMusicLink(track.url)}
                        className="w-12 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-all duration-300"
                        title="Open in new tab"
                      >
                        🔗
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>💡 Pro Tip:</strong> Click the link button to open music in YouTube. 
                Use headphones for the best experience!
              </p>
            </div>
          </div>

          {/* Motivational Content */}
          <div className="space-y-6">
            {/* Quote of the Moment */}
            <div className="wellness-card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">💫</span>
                Words of Encouragement
              </h3>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
                <blockquote className="text-gray-700 italic text-lg leading-relaxed mb-4">
                  "{currentQuotes[currentQuoteIndex]}"
                </blockquote>
                <button
                  onClick={nextQuote}
                  className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-full text-sm transition-all duration-300"
                >
                  Next Quote ✨
                </button>
              </div>
            </div>

            {/* Wellness Activities */}
            <div className="wellness-card">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">🧘</span>
                Try These Activities
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">🌬️ Deep Breathing</h4>
                  <p className="text-green-700 text-sm">4-7-8 technique: Inhale for 4, hold for 7, exhale for 8</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">🚶 Mindful Walking</h4>
                  <p className="text-blue-700 text-sm">Take a slow walk while listening to calming music</p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <h4 className="font-medium text-yellow-800">📝 Gratitude Journal</h4>
                  <p className="text-yellow-700 text-sm">Write down 3 things you're grateful for today</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800">🎨 Creative Expression</h4>
                  <p className="text-purple-700 text-sm">Draw, write, or create something while music plays</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="wellness-card">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Continue Your Journey</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/chatbot')}
                  className="p-3 bg-blue-100 hover:bg-blue-200 rounded-lg text-blue-800 font-medium transition-colors"
                >
                  💬 Chat Support
                </button>
                <button
                  onClick={() => navigate('/report')}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-800 font-medium transition-colors"
                >
                  📊 View Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;