import axios from 'axios';
import { getStoredToken } from './auth';

// Create axios instance with base configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle response errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - redirect to login
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/login', userData);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/api/auth/register', userData);
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Test endpoints
export const submitTestResponses = async (testData) => {
  try {
    const response = await api.post('/api/test/submit', testData);
    return response;
  } catch (error) {
    console.error('Test submission error:', error);
    throw error;
  }
};

export const getTestResults = async (userId) => {
  try {
    const response = await api.get(`/api/test/results/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching test results:', error);
    throw error;
  }
};

export const getLatestTestResults = async (userId) => {
  try {
    const response = await api.get(`/api/test/results/latest/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching latest test results:', error);
    throw error;
  }
};

// Music & motivation endpoints
export const getMusicRecommendations = async (severity, mood) => {
  try {
    const response = await api.get(`/api/music/recommendations`, {
      params: { severity, mood }
    });
    return response;
  } catch (error) {
    console.error('Error fetching music recommendations:', error);
    throw error;
  }
};

export const getMotivationalContent = async (severity) => {
  try {
    const response = await api.get(`/api/motivation/content`, {
      params: { severity }
    });
    return response;
  } catch (error) {
    console.error('Error fetching motivational content:', error);
    throw error;
  }
};

// Chatbot endpoints
export const sendChatMessage = async (message, userId, context = null) => {
  try {
    const response = await api.post('/api/chatbot/message', {
      message,
      user_id: userId,
      context
    });
    return response;
  } catch (error) {
    console.error('Chatbot error:', error);
    throw error;
  }
};

export const getChatHistory = async (userId) => {
  try {
    const response = await api.get(`/api/chatbot/history/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
};

// Institution endpoints
export const checkInstitutionPartnership = async (email) => {
  try {
    const response = await api.post('/api/institution/check', { email });
    return response;
  } catch (error) {
    console.error('Institution check error:', error);
    throw error;
  }
};

export const requestCounselorSession = async (userId, severity, anonymous = true) => {
  try {
    const response = await api.post('/api/institution/counselor-request', {
      user_id: userId,
      severity,
      anonymous
    });
    return response;
  } catch (error) {
    console.error('Counselor request error:', error);
    throw error;
  }
};

export const getInstitutionAlerts = async (institutionId) => {
  try {
    const response = await api.get(`/api/institution/alerts/${institutionId}`);
    return response;
  } catch (error) {
    console.error('Error fetching institution alerts:', error);
    throw error;
  }
};

// Emergency support
export const triggerEmergencyAlert = async (userId, testResultId) => {
  try {
    const response = await api.post('/api/emergency/alert', {
      user_id: userId,
      test_result_id: testResultId
    });
    return response;
  } catch (error) {
    console.error('Emergency alert error:', error);
    throw error;
  }
};

// Institution Dashboard API calls
export const getCounselorRequests = async () => {
  try {
    const response = await api.get('/api/institution/requests');
    return response;
  } catch (error) {
    console.error('Get counselor requests error:', error);
    throw error;
  }
};

export const getInstitutionStats = async () => {
  try {
    const response = await api.get('/api/institution/stats');
    return response;
  } catch (error) {
    console.error('Get institution stats error:', error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId, status) => {
  try {
    const response = await api.patch(`/api/institution/requests/${requestId}`, { status });
    return response;
  } catch (error) {
    console.error('Update request status error:', error);
    throw error;
  }
};

// User Profile API calls
export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/user/profile');
    return response;
  } catch (error) {
    console.error('Get user profile error:', error);
    throw error;
  }
};

// Institution API calls
export const getInstitutions = async () => {
  try {
    const response = await api.get('/api/institutions');
    return response;
  } catch (error) {
    console.error('Get institutions error:', error);
    throw error;
  }
};

export default api;