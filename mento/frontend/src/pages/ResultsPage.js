import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLatestTestResults, requestCounselorSession } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const ResultsPage = ({ user }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showSupportOptions, setShowSupportOptions] = useState(false);

  useEffect(() => {
    fetchResults();
  }, [user.id]);

  const fetchResults = async () => {
    try {
      const response = await getLatestTestResults(user.id);
      setResults(response.data);
    } catch (err) {
      setError('Failed to load your results. Please try again.');
      console.error('Results fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCounselor = async () => {
    try {
      await requestCounselorSession(user.id, results.severity, true);
      alert('Your request has been sent! A counselor will be available for anonymous chat soon.');
    } catch (err) {
      alert('Failed to request counselor session. Please try again.');
    }
  };

  const getSeverityInfo = (severity) => {
    switch (severity) {
      case 'low':
        return {
          emoji: '🌱',
          title: 'You\'re doing well!',
          message: 'Your responses suggest you\'re in a good mental space right now. Keep up the great work! 💙',
          color: 'green',
          bgColor: 'bg-green-50',
          textColor: 'text-green-800',
          borderColor: 'border-green-200'
        };
      case 'moderate':
        return {
          emoji: '🌿',
          title: 'You seem a little low',
          message: 'It looks like you might be going through some challenges. Here are some things that might help cheer you up! 💙',
          color: 'yellow',
          bgColor: 'bg-yellow-50',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-200'
        };
      case 'high':
        return {
          emoji: '🫂',
          title: 'We\'re here for you',
          message: 'It seems like you\'re going through a tough time. You\'re not alone, and there are people who want to help. 💙',
          color: 'red',
          bgColor: 'bg-red-50',
          textColor: 'text-red-800',
          borderColor: 'border-red-200'
        };
      default:
        return {
          emoji: '💙',
          title: 'Thank you for sharing',
          message: 'We appreciate you taking the time to share how you\'re feeling.',
          color: 'blue',
          bgColor: 'bg-blue-50',
          textColor: 'text-blue-800',
          borderColor: 'border-blue-200'
        };
    }
  };

  if (loading) {
    return <LoadingSpinner message="Analyzing your responses..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/test')}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Take Assessment Again
          </button>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center max-w-md">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Results Yet</h2>
          <p className="text-gray-600 mb-6">You haven't completed an assessment yet.</p>
          <button
            onClick={() => navigate('/test')}
            className="bg-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Take Your First Assessment
          </button>
        </div>
      </div>
    );
  }

  const severityInfo = getSeverityInfo(results.severity);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Your Wellness Report
          </h1>
          <p className="text-gray-600">
            Completed on {new Date(results.completed_at).toLocaleDateString()}
          </p>
        </div>

        {/* Main Result Card */}
        <div className={`${severityInfo.bgColor} ${severityInfo.borderColor} border-2 rounded-3xl p-8 md:p-12 mb-8 shadow-lg`}>
          <div className="text-center">
            <div className="text-8xl mb-6">{severityInfo.emoji}</div>
            <h2 className={`text-3xl md:text-4xl font-bold ${severityInfo.textColor} mb-4`}>
              {severityInfo.title}
            </h2>
            <p className={`text-lg ${severityInfo.textColor} opacity-90 mb-8 max-w-2xl mx-auto`}>
              {severityInfo.message}
            </p>

            {/* Score Display */}
            <div className="bg-white/50 rounded-2xl p-6 max-w-md mx-auto">
              <div className="text-sm text-gray-600 mb-2">Wellness Score</div>
              <div className="text-3xl font-bold text-gray-800">{results.score} / {results.max_score}</div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                <div 
                  className={`h-3 rounded-full ${
                    results.severity === 'low' ? 'bg-green-500' :
                    results.severity === 'moderate' ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${(results.score / results.max_score) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Music & Relaxation */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🎵</div>
              <h3 className="text-xl font-bold text-gray-800">Music & Relaxation</h3>
              <p className="text-gray-600 text-sm">Curated sounds to help you feel better</p>
            </div>
            <button
              onClick={() => navigate('/music')}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold py-3 rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all"
            >
              Explore Music 🎶
            </button>
          </div>

          {/* Chat Support */}
          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🤖</div>
              <h3 className="text-xl font-bold text-gray-800">Chat Support</h3>
              <p className="text-gray-600 text-sm">Talk to our supportive AI companion</p>
            </div>
            <button
              onClick={() => navigate('/chatbot')}
              className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all"
            >
              Start Chatting 💬
            </button>
          </div>
        </div>

        {/* High Severity Support Options */}
        {results.severity === 'high' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-3xl p-8 mb-8">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🆘</div>
              <h3 className="text-xl font-bold text-red-800">Additional Support Available</h3>
              <p className="text-red-700">We've noticed you might need extra support. Here are some options:</p>
            </div>
            
            <div className="space-y-4">
              {user.institution && (
                <button
                  onClick={handleRequestCounselor}
                  className="w-full bg-red-600 text-white font-semibold py-4 rounded-xl hover:bg-red-700 transition-colors"
                >
                  🏥 Request Anonymous Counselor Session
                </button>
              )}
              
              <button
                onClick={() => setShowSupportOptions(!showSupportOptions)}
                className="w-full bg-red-100 text-red-800 font-semibold py-3 rounded-xl hover:bg-red-200 transition-colors"
              >
                📞 View Emergency Resources
              </button>
            </div>

            {showSupportOptions && (
              <div className="mt-6 bg-white rounded-2xl p-6">
                <h4 className="font-bold text-gray-800 mb-4">Emergency Resources</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Crisis Text Line:</strong> Text HOME to 741741</p>
                  <p><strong>National Suicide Prevention:</strong> 988</p>
                  <p><strong>Emergency:</strong> 911</p>
                  <p className="text-gray-600 mt-4">
                    Remember: You're not alone, and help is always available. 💙
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Institution Notice */}
        {user.institution && results.severity !== 'low' && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 mb-8">
            <div className="flex items-center">
              <div className="text-3xl mr-4">🏥</div>
              <div>
                <h4 className="font-bold text-blue-800">Institution Partnership</h4>
                <p className="text-blue-700 text-sm">
                  Your results may be shared with {user.institution.name} to provide additional support resources.
                  {results.severity === 'high' && ' A counselor may reach out to offer assistance.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <button
            onClick={() => navigate('/test')}
            className="bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors mr-4"
          >
            Take Assessment Again
          </button>
          <button
            onClick={() => navigate('/music')}
            className="bg-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:bg-purple-600 transition-colors"
          >
            Continue to Resources →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;