import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import Pages
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ResultsPage from './pages/ResultsPage';
import MusicPage from './pages/MusicPage';
import ChatbotPage from './pages/ChatbotPage';
import InstitutionDashboard from './pages/InstitutionDashboard';

// Import Components
import Navbar from './components/Navbar';
import LoadingSpinner from './components/LoadingSpinner';

// Import Utils
import { getStoredUser, removeStoredUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getStoredUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    removeStoredUser();
    setUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        
        <Routes>
          {/* Public Routes */}
          {!user ? (
            <>
              <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            /* Protected Routes */
            <>
              <Route path="/test" element={<TestPage user={user} />} />
              <Route path="/results" element={<ResultsPage user={user} />} />
              <Route path="/music" element={<MusicPage user={user} />} />
              <Route path="/chatbot" element={<ChatbotPage user={user} />} />
              <Route path="/institution" element={<InstitutionDashboard user={user} />} />
              <Route path="/" element={<Navigate to="/test" replace />} />
              <Route path="*" element={<Navigate to="/test" replace />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;