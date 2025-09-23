import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ReportPage from './pages/ReportPage';
import MusicPage from './pages/MusicPage';
import ChatbotPage from './pages/ChatbotPage';
import AdminDashboard from './pages/AdminDashboard_new';
import './styles/index.css';

function App() {
  return (
    <Router>
      <div className="App min-h-screen">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/music" element={<MusicPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;