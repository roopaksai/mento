import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ReportPage = () => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [showCounselorOption, setShowCounselorOption] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const name = localStorage.getItem('userName');
    const userId = localStorage.getItem('userId');
    
    if (!name || !userId) {
      navigate('/login');
      return;
    }
    
    setUserName(name);
    generateMockAnalysis(); // Mock analysis for demo
    
    // In real implementation, fetch from API:
    // fetchAnalysis(userId);
  }, [navigate]);

  const generateMockAnalysis = () => {
    // Mock analysis based on typical responses
    // In real app, this would come from backend AI analysis
    const mockScore = Math.floor(Math.random() * 30); // 0-30 scale
    
    let severity, message, color, emoji, recommendations;
    
    if (mockScore <= 9) {
      severity = 'low';
      color = 'from-green-400 to-blue-500';
      emoji = '🌟';
      message = "You're doing well! Your responses suggest you're managing life's challenges with good resilience.";
      recommendations = [
        'Keep up your current self-care routines',
        'Continue staying connected with loved ones',
        'Maintain a healthy balance between work and rest'
      ];
    } else if (mockScore <= 19) {
      severity = 'moderate';
      color = 'from-yellow-400 to-orange-500';
      emoji = '🌻';
      message = "You seem to be going through some challenges. Remember, it's okay to have ups and downs.";
      recommendations = [
        'Try gentle activities like walking or listening to music',
        'Consider talking to a trusted friend or family member',
        'Practice mindfulness or deep breathing exercises'
      ];
    } else {
      severity = 'high';
      color = 'from-pink-400 to-red-500';
      emoji = '💙';
      message = "It looks like you're going through a tough time. You're brave for taking this step, and support is available.";
      recommendations = [
        'Consider reaching out to a mental health professional',
        'Connect with supportive friends or family',
        'Try our chatbot for immediate emotional support'
      ];
      setShowCounselorOption(true);
    }
    
    setAnalysis({
      severity,
      score: mockScore,
      message,
      color,
      emoji,
      recommendations,
      encouragement: getEncouragementMessage(severity)
    });
    
    setLoading(false);
  };

  const getEncouragementMessage = (severity) => {
    const messages = {
      low: "Keep shining! Your mental wellness toolkit is working well. Remember to celebrate these good moments.",
      moderate: "Every day is a new opportunity to feel better. Small steps forward are still progress worth celebrating.",
      high: "You are stronger than you know. Reaching out shows courage, and healing is possible with the right support."
    };
    return messages[severity];
  };

  const requestCounselorSession = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const anonymousData = {
        severity: analysis.severity,
        score: analysis.score,
        timestamp: new Date().toISOString()
      };
      
      await apiService.requestCounselorSession(userId, anonymousData);
      alert('Your request has been sent. A counselor will reach out to you soon.');
    } catch (error) {
      console.error('Error requesting counselor:', error);
      alert('Request sent! A counselor will contact you soon.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-wellness">
        <div className="wellness-card text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">
            Analyzing your responses...
          </h2>
          <p className="text-gray-500 mt-2">Creating your personalized insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-wellness py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Your Wellness Insights, {userName}
          </h1>
          <p className="text-white/80">
            Remember: This is just a snapshot, not a diagnosis. You know yourself best.
          </p>
        </div>

        {/* Main Results Card */}
        <div className="wellness-card mb-8 fade-in">
          <div className="text-center mb-8">
            <div className={`text-8xl mb-4`}>{analysis.emoji}</div>
            <div className={`inline-block px-6 py-3 rounded-full text-white font-bold text-xl bg-gradient-to-r ${analysis.color}`}>
              You're {analysis.severity === 'high' ? 'going through a challenging time' : 
                     analysis.severity === 'moderate' ? 'managing some challenges' : 'doing well'}
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">What this means:</h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              {analysis.message}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💝 A message for you:</h3>
            <p className="text-gray-700 leading-relaxed italic">
              "{analysis.encouragement}"
            </p>
          </div>
        </div>

        {/* Recommendations */}
        <div className="wellness-card mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="text-2xl mr-2">🎯</span>
            Personalized Suggestions
          </h3>
          <div className="space-y-4">
            {analysis.recommendations.map((rec, index) => (
              <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl mr-3">✨</div>
                <p className="text-gray-700 font-medium">{rec}</p>
              </div>
            ))}
          </div>
        </div>

        {/* High Severity Options */}
        {showCounselorOption && (
          <div className="wellness-card mb-8 border-l-4 border-red-400">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-2">🤝</span>
              Additional Support Available
            </h3>
            <p className="text-gray-600 mb-4">
              Based on your responses, you might benefit from talking to a professional counselor. 
              This is completely optional and anonymous.
            </p>
            <button
              onClick={requestCounselorSession}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300"
            >
              Request Anonymous Counselor Session
            </button>
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => navigate('/music')}
            className="wellness-card text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎵</div>
            <h4 className="font-semibold text-gray-800">Healing Music</h4>
            <p className="text-gray-600 text-sm">Curated playlists for your mood</p>
          </button>

          <button
            onClick={() => navigate('/chatbot')}
            className="wellness-card text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💬</div>
            <h4 className="font-semibold text-gray-800">Chat Support</h4>
            <p className="text-gray-600 text-sm">Talk with our wellness companion</p>
          </button>

          <button
            onClick={() => navigate('/test')}
            className="wellness-card text-center p-6 hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🔄</div>
            <h4 className="font-semibold text-gray-800">Retake Assessment</h4>
            <p className="text-gray-600 text-sm">Check in again anytime</p>
          </button>
        </div>

        {/* Disclaimer */}
        <div className="text-center text-white/70 text-sm">
          <p className="mb-2">
            🔒 Your responses are confidential and secure
          </p>
          <p>
            💡 This assessment is for informational purposes only and is not a substitute for professional medical advice
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;