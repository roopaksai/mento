// Authentication utilities for storing and retrieving user data

const USER_STORAGE_KEY = 'mento_user';
const TOKEN_STORAGE_KEY = 'mento_token';

export const storeUser = (userData) => {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Failed to store user data:', error);
  }
};

export const getStoredUser = () => {
  try {
    const userData = localStorage.getItem(USER_STORAGE_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Failed to retrieve user data:', error);
    return null;
  }
};

export const removeStoredUser = () => {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to remove user data:', error);
  }
};

export const storeToken = (token) => {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (error) {
    console.error('Failed to store token:', error);
  }
};

export const getStoredToken = () => {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to retrieve token:', error);
    return null;
  }
};

export const isUserLoggedIn = () => {
  const user = getStoredUser();
  const token = getStoredToken();
  return user && token;
};

export const getUserInstitution = (email) => {
  // Extract domain from email to check for institutional partnerships
  const domain = email.split('@')[1];
  
  // List of partner institutions (you can expand this)
  const partnerInstitutions = {
    'university.edu': {
      name: 'University Mental Health Center',
      type: 'university',
      contact: 'counseling@university.edu'
    },
    'college.edu': {
      name: 'College Wellness Center',
      type: 'college',
      contact: 'wellness@college.edu'
    },
    'company.com': {
      name: 'Employee Assistance Program',
      type: 'corporate',
      contact: 'eap@company.com'
    },
    'hospital.org': {
      name: 'Hospital Mental Health Services',
      type: 'healthcare',
      contact: 'mentalhealth@hospital.org'
    }
  };
  
  return partnerInstitutions[domain] || null;
};