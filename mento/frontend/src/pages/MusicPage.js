import React, { useState, useEffect } from 'react';
import { getMusicRecommendations, getMotivationalContent } from '../utils/api';

const MusicPage = ({ user }) => {
  const [musicRecs, setMusicRecs] = useState([]);
  const [motivationalContent, setMotivationalContent] = useState(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      // In a real app, you'd get the user's latest test severity
      const severity = 'moderate'; // Default for demo
      
      const [musicResponse, motivationResponse] = await Promise.all([
        getMusicRecommendations(severity, 'calm'),
        getMotivationalContent(severity)
      ]);
      
      setMusicRecs(musicResponse.data.recommendations || getDefaultMusic());
      setMotivationalContent(motivationResponse.data || getDefaultMotivation());
    } catch (error) {
      // Fallback to default content
      setMusicRecs(getDefaultMusic());
      setMotivationalContent(getDefaultMotivation());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultMusic = () => [
    {
      title: "Peaceful Rain Sounds",
      artist: "Nature Sounds",
      type: "ambient",
      url: "https://www.youtube.com/watch?v=mPZkdNFkNps",
      description: "Gentle rain sounds for relaxation and focus",
      mood: "calm",
      emoji: "🌧️"
    },
    {
      title: "Lo-fi Hip Hop Radio",
      artist: "ChillHop Music",
      type: "music",
      url: "https://www.youtube.com/watch?v=jfKfPfyJRdk",
      description: "Relaxing beats to study and chill to",
      mood: "focused",
      emoji: "🎵"
    },
    {
      title: "Ocean Waves",
      artist: "Meditation Sounds",
      type: "ambient",
      url: "https://www.youtube.com/watch?v=V1bFr2SWP1I",
      description: "Calming ocean sounds for deep relaxation",
      mood: "peaceful",
      emoji: "🌊"
    },
    {
      title: "Happy Acoustic Playlist",
      artist: "Uplifting Music",
      type: "music",
      url: "https://open.spotify.com/playlist/happy-acoustic",
      description: "Upbeat acoustic songs to boost your mood",
      mood: "happy",
      emoji: "🎸"
    },
    {
      title: "Meditation Bells",
      artist: "Zen Sounds",
      type: "meditation",
      url: "https://www.youtube.com/watch?v=meditation-bells",
      description: "Tibetan singing bowls for mindfulness",
      mood: "zen",
      emoji: "🔔"
    },
    {
      title: "Forest Sounds",
      artist: "Nature Collection",
      type: "ambient",
      url: "https://www.youtube.com/watch?v=forest-sounds",
      description: "Birds and rustling leaves for natural calm",
      mood: "natural",
      emoji: "🌲"
    }
  ];

  const getDefaultMotivation = () => ({
    quote: "Every small step forward is progress. You're doing better than you think. 💙",
    author: "Mento Team",
    dailyAffirmation: "I am worthy of love, care, and happiness.",
    tip: "Try taking 5 deep breaths whenever you feel overwhelmed. Breathe in for 4 counts, hold for 4, and breathe out for 4."
  });

  const handlePlayMusic = (music) => {
    if (currentlyPlaying === music.title) {
      setCurrentlyPlaying(null);
    } else {
      setCurrentlyPlaying(music.title);
      // In a real app, you'd integrate with actual music players
      window.open(music.url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">🎵</div>
          <p className="text-gray-600">Loading your personalized music...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Music & Motivation 🎵
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Curated sounds and words to lift your spirits, {user.name}
          </p>
        </div>

        {/* Motivational Section */}
        {motivationalContent && (
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-3xl p-8 md:p-12 text-white mb-12 shadow-lg">
            <div className="text-center">
              <div className="text-6xl mb-6">✨</div>
              <blockquote className="text-2xl md:text-3xl font-light mb-6 italic">
                "{motivationalContent.quote}"
              </blockquote>
              <p className="text-purple-100 mb-8">— {motivationalContent.author}</p>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
                <h3 className="text-xl font-semibold mb-3">💫 Today's Affirmation</h3>
                <p className="text-lg">{motivationalContent.dailyAffirmation}</p>
              </div>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto mt-6">
                <h3 className="text-xl font-semibold mb-3">💡 Wellness Tip</h3>
                <p className="text-sm">{motivationalContent.tip}</p>
              </div>
            </div>
          </div>
        )}

        {/* Music Categories */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Choose Your Mood 🎭</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['calm', 'focused', 'happy', 'peaceful', 'zen', 'natural'].map(mood => (
              <button
                key={mood}
                className="px-6 py-3 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all transform hover:scale-105 border-2 border-transparent hover:border-purple-300"
              >
                <span className="capitalize font-semibold text-gray-700">{mood}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Music Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {musicRecs.map((music, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{music.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{music.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{music.artist}</p>
                <p className="text-gray-500 text-xs">{music.description}</p>
              </div>
              
              <div className="text-center">
                <button
                  onClick={() => handlePlayMusic(music)}
                  className={`w-full py-3 rounded-xl font-semibold transition-all ${
                    currentlyPlaying === music.title
                      ? 'bg-red-500 text-white hover:bg-red-600'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  {currentlyPlaying === music.title ? '⏹️ Stop' : '▶️ Play'}
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  music.mood === 'calm' ? 'bg-blue-100 text-blue-800' :
                  music.mood === 'happy' ? 'bg-yellow-100 text-yellow-800' :
                  music.mood === 'peaceful' ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {music.mood}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Resources */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">More Resources 🌟</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Meditation Apps</h3>
              <p className="text-gray-600 text-sm mb-4">Try Headspace, Calm, or Insight Timer for guided meditations</p>
              <button className="bg-green-500 text-white px-6 py-2 rounded-xl hover:bg-green-600 transition-colors">
                Explore Apps
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-4xl mb-4">🎧</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Podcasts</h3>
              <p className="text-gray-600 text-sm mb-4">Mental health podcasts for inspiration and education</p>
              <button className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors">
                Find Podcasts
              </button>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-lg">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Reading</h3>
              <p className="text-gray-600 text-sm mb-4">Self-help books and articles on mental wellness</p>
              <button className="bg-purple-500 text-white px-6 py-2 rounded-xl hover:bg-purple-600 transition-colors">
                Reading List
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPage;