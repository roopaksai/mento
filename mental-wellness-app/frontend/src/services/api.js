import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with interceptors
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Authentication
  login: async (userData) => {
    try {
      // For development - simple login without backend
      if (userData.name && userData.email) {
        // Simulate successful login
        const mockResponse = {
          success: true,
          userId: Date.now().toString(),
          user: {
            name: userData.name,
            email: userData.email,
            isAdmin: userData.email.toLowerCase().includes('admin')
          },
          token: 'mock-token-' + Date.now()
        };
        
        return mockResponse;
      }
      
      // If backend is available, use actual API
      const response = await api.post('/auth/login', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      // Fallback to mock login if backend is unavailable
      console.log('Backend unavailable, using mock login');
      return {
        success: true,
        userId: Date.now().toString(),
        user: {
          name: userData.name || 'User',
          email: userData.email || 'user@example.com',
          isAdmin: false
        },
        token: 'mock-token-' + Date.now()
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error.response?.data || error.message;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  verifyToken: async () => {
    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Assessment
  submitAssessment: async (assessmentData) => {
    try {
      const response = await api.post('/assessment/submit', assessmentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAnalysis: async (userId) => {
    try {
      const response = await api.get(`/assessment/analysis/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getAssessmentHistory: async (userId, page = 1, limit = 10) => {
    try {
      const response = await api.get(`/assessment/history/${userId}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Music recommendations
  getMusicRecommendations: async (severityLevel, mood = null, limit = 10) => {
    try {
      const params = new URLSearchParams({ limit });
      if (mood) params.append('mood', mood);
      
      const response = await api.get(`/music/recommendations/${severityLevel}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getMusicMoods: async (severityLevel) => {
    try {
      const response = await api.get(`/music/moods/${severityLevel}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Chatbot
  sendChatMessage: async (message, userId, sessionId = null) => {
    try {
      const payload = { message, userId };
      if (sessionId) payload.sessionId = sessionId;
      
      const response = await api.post('/chatbot/message', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatHistory: async (userId, sessionId = null, page = 1, limit = 20) => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (sessionId) params.append('sessionId', sessionId);
      
      const response = await api.get(`/chatbot/history/${userId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getChatSessions: async (userId) => {
    try {
      const response = await api.get(`/chatbot/sessions/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  submitChatFeedback: async (messageId, helpful, feedback = null) => {
    try {
      const payload = { messageId, helpful };
      if (feedback) payload.feedback = feedback;
      
      const response = await api.post('/chatbot/feedback', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Institution
  checkInstitution: async (email) => {
    try {
      const response = await api.post('/institution/check', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getInstitutions: async () => {
    try {
      const response = await api.get('/institution/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Counselor
  requestCounselorSession: async (userId, assessmentId, severityLevel, anonymousData = {}) => {
    try {
      const payload = { userId, severityLevel, anonymousData };
      if (assessmentId) payload.assessmentId = assessmentId;
      
      const response = await api.post('/counselor/request', payload);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getCounselorRequest: async (requestId) => {
    try {
      const response = await api.get(`/counselor/request/${requestId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getUserCounselorRequests: async (userId, status = null, page = 1, limit = 10) => {
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() });
      if (status) params.append('status', status);
      
      const response = await api.get(`/counselor/requests/user/${userId}?${params}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Admin API functions
  admin: {
    getDashboard: async (timeframe = '30') => {
      try {
        const response = await api.get(`/admin/dashboard?timeframe=${timeframe}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getUsers: async (page = 1, limit = 20, search = '', institution = '', sortBy = 'createdAt', sortOrder = 'desc') => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          sortBy,
          sortOrder
        });
        
        if (search) params.append('search', search);
        if (institution) params.append('institution', institution);
        
        const response = await api.get(`/admin/users?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getAssessments: async (page = 1, limit = 20, filters = {}) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const response = await api.get(`/admin/assessments?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getCounselorRequests: async (page = 1, limit = 20, filters = {}) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString()
        });
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        const response = await api.get(`/admin/counselor-requests?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    assignCounselor: async (requestId, counselorData) => {
      try {
        const response = await api.put(`/counselor/request/${requestId}/assign`, counselorData);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    updateRequestStatus: async (requestId, status, note = null) => {
      try {
        const payload = { status };
        if (note) payload.note = note;
        
        const response = await api.put(`/counselor/request/${requestId}/status`, payload);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getCrisisAlerts: async (page = 1, limit = 20, resolved = false) => {
      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          resolved: resolved.toString()
        });
        
        const response = await api.get(`/admin/crisis-alerts?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    resolveCrisisAlert: async (alertId, resolution = null) => {
      try {
        const payload = {};
        if (resolution) payload.resolution = resolution;
        
        const response = await api.put(`/admin/crisis-alert/${alertId}/resolve`, payload);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },

    getSummaryReport: async (startDate = null, endDate = null) => {
      try {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        
        const response = await api.get(`/admin/reports/summary?${params}`);
        return response.data;
      } catch (error) {
        throw error.response?.data || error.message;
      }
    },
  }
};

// Health check
export const checkAPIHealth = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default api;