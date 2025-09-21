import React, { useState } from 'react';
import { storeUser } from '../utils/auth';
import { loginUser } from '../utils/api';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginUser(formData);
      const userData = {
        id: response.data.user_id,
        name: formData.name,
        email: formData.email,
        institution: response.data.institution || null
      };
      
      storeUser(userData);
      onLogin(userData);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center p-4">
      {/* Background Image Effect */}
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')`
        }}
      ></div>

      {/* Login Form */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🕵️‍♂️</div>
          <h1 className="text-4xl font-bold text-white mb-2">
            I'm James Bond.
          </h1>
          <h2 className="text-2xl text-blue-200 mb-4">
            Who are you?
          </h2>
          <p className="text-gray-300 text-sm">
            Welcome to your confidential mental wellness assessment
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Agent Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your code name..."
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-white text-sm font-semibold mb-2">
              Secure Communication Channel
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="agent@mi6.gov.uk"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Authenticating...
              </div>
            ) : (
              'Begin Mission 🎯'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            🔒 Your data is encrypted and confidential
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Mental wellness assessment • Institutional support available
          </p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 text-white/20 text-6xl animate-float" style={{animationDelay: '1s'}}>
        💙
      </div>
      <div className="absolute bottom-20 right-10 text-white/20 text-6xl animate-float" style={{animationDelay: '2s'}}>
        🌟
      </div>
      <div className="absolute top-1/2 right-20 text-white/20 text-4xl animate-float" style={{animationDelay: '0.5s'}}>
        🧠
      </div>
    </div>
  );
};

export default LoginPage;