import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import LoginPage from './pages/LoginPage';
import TestPage from './pages/TestPage';
import ReportPage from './pages/ReportPage';
import MusicPage from './pages/MusicPage';
import ChatbotPage from './pages/ChatbotPage';
import AdminDashboard from './pages/AdminDashboard_simple';
import './styles/index.css';

// Create Material-UI theme with calming colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#4caf50', // Gentle green
      light: '#81c784',
      dark: '#2e7d32',
    },
    secondary: {
      main: '#81c784', // Light green
      light: '#a5d6a7',
      dark: '#66bb6a',
    },
    background: {
      default: '#f8fffe',
      paper: '#ffffff',
    },
    text: {
      primary: '#2e7d32',
      secondary: '#5a5a5a',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 300,
    },
    h2: {
      fontWeight: 300,
    },
    h3: {
      fontWeight: 400,
    },
    h4: {
      fontWeight: 300,
    },
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 15px rgba(76, 175, 80, 0.3)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 2px 15px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
    </ThemeProvider>
  );
}

export default App;