const fs = require('fs');
const path = require('path');

class SimpleDatabase {
  constructor() {
    this.dbPath = path.join(__dirname, 'database.json');
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(this.dbPath)) {
        const rawData = fs.readFileSync(this.dbPath, 'utf8');
        return JSON.parse(rawData);
      }
    } catch (error) {
      console.error('Error loading database:', error);
    }
    
    // Return default structure if file doesn't exist or is corrupted
    return {
      users: [],
      assessments: [],
      institutions: [],
      counselorRequests: [],
      musicRecommendations: []
    };
  }

  saveData() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving database:', error);
      return false;
    }
  }

  // User operations
  findUser(query) {
    return this.data.users.find(user => {
      if (query.email) return user.email === query.email;
      if (query.id) return user.id === query.id;
      if (query.name) return user.name.toLowerCase().includes(query.name.toLowerCase());
      return false;
    });
  }

  createUser(userData) {
    const newUser = {
      id: 'user-' + Date.now(),
      ...userData,
      isAdmin: this.isAdminEmail(userData.email) || this.isAdminName(userData.name),
      role: this.isAdminEmail(userData.email) || this.isAdminName(userData.name) ? 'admin' : 'student',
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    this.data.users.push(newUser);
    this.saveData();
    return newUser;
  }

  updateUser(id, updates) {
    const userIndex = this.data.users.findIndex(user => user.id === id);
    if (userIndex !== -1) {
      this.data.users[userIndex] = { ...this.data.users[userIndex], ...updates };
      this.saveData();
      return this.data.users[userIndex];
    }
    return null;
  }

  isAdminEmail(email) {
    return email && email.toLowerCase().includes('admin');
  }

  isAdminName(name) {
    return name && name.toLowerCase().includes('admin');
  }

  // Assessment operations
  createAssessment(assessmentData) {
    const newAssessment = {
      id: 'assessment-' + Date.now(),
      ...assessmentData,
      createdAt: new Date().toISOString()
    };
    
    this.data.assessments.push(newAssessment);
    this.saveData();
    return newAssessment;
  }

  getUserAssessments(userId) {
    return this.data.assessments.filter(assessment => assessment.userId === userId);
  }

  // Institution operations
  getInstitutions() {
    return this.data.institutions.filter(inst => inst.isActive);
  }

  // Music operations
  getMusicRecommendations(mood = null, severity = null) {
    let recommendations = this.data.musicRecommendations;
    
    if (mood) {
      recommendations = recommendations.filter(music => music.mood === mood);
    }
    
    if (severity) {
      recommendations = recommendations.filter(music => music.severityLevel === severity);
    }
    
    return recommendations;
  }

  // Counselor request operations
  createCounselorRequest(requestData) {
    const newRequest = {
      id: 'request-' + Date.now(),
      ...requestData,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    this.data.counselorRequests.push(newRequest);
    this.saveData();
    return newRequest;
  }

  getCounselorRequests(status = null) {
    if (status) {
      return this.data.counselorRequests.filter(req => req.status === status);
    }
    return this.data.counselorRequests;
  }

  // Generic get all operations
  getAllUsers() {
    return this.data.users;
  }

  getAllAssessments() {
    return this.data.assessments;
  }
}

module.exports = new SimpleDatabase();