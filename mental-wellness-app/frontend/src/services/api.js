import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // User authentication
  login: async (userData) => {
    try {
      const response = await api.post('/auth/login', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Submit mental health assessment
  submitAssessment: async (assessmentData) => {
    try {
      const response = await api.post('/assessment/submit', assessmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get assessment analysis
  getAnalysis: async (userId) => {
    try {
      const response = await api.get(`/assessment/analysis/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get music recommendations
  getMusicRecommendations: async (severityLevel) => {
    try {
      const response = await api.get(`/music/recommendations/${severityLevel}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Chatbot interaction
  sendChatMessage: async (message, userId) => {
    try {
      const response = await api.post('/chatbot/message', { message, userId });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Check institution partnership
  checkInstitution: async (email) => {
    try {
      const response = await api.post('/institution/check', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Request counselor session (for high severity cases)
  requestCounselorSession: async (userId, anonymousData) => {
    try {
      const response = await api.post('/counselor/request', { userId, anonymousData });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin API functions
  admin: {
    // Get all students
    getStudents: async () => {
      try {
        const response = await api.get('/admin/students');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get all assessments
    getAssessments: async (emailFilter = '') => {
      try {
        const url = emailFilter ? `/admin/assessments?email=${encodeURIComponent(emailFilter)}` : '/admin/assessments';
        const response = await api.get(url);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    // Get analytics data
    getAnalytics: async () => {
      try {
        const response = await api.get('/admin/analytics');
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    }
  }
};

export default api;