import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
      // Store user data in localStorage for session management
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      
      // Call API to register/login user
      const response = await apiService.login(formData);
      localStorage.setItem('userId', response.userId);
      
      // Navigate to test page
      navigate('/test');
    } catch (err) {
      setError('Something went wrong. Please try again.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{
           backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), 
                            url('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center'
         }}>
      
      <div className="wellness-card max-w-md w-full fade-in">
        {/* Header with James Bond themed text */}
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🕴️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            "I'm James Bond."
          </h1>
          <p className="text-xl text-gray-600 mb-4">
            "Who are you?"
          </p>
          <p className="text-sm text-gray-500">
            Welcome to your personal mental wellness journey. 
            Every great agent starts with knowing themselves.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="wellness-input"
              placeholder="Enter your name"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Secure Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="wellness-input"
              placeholder="agent@example.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll use this to track your wellness journey securely
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full wellness-button"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Initiating Mission...
              </div>
            ) : (
              'Begin Wellness Mission 🚀'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            🔒 Your data is secure and confidential
          </p>
          <div className="flex justify-center space-x-4 mt-4">
            <span className="text-2xl">🧠</span>
            <span className="text-2xl">💙</span>
            <span className="text-2xl">🌟</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;