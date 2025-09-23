import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  Fade,
  CircularProgress
} from '@mui/material';
import {
  Person,
  Email,
  FavoriteOutlined
} from '@mui/icons-material';
import { apiService } from '../services/api';

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simple login with just name and email
      const response = await apiService.login({
        email: formData.email,
        name: formData.name
      });
      
      setSuccess('Welcome! Taking you to your wellness space...');
      
      // Store user info
      localStorage.setItem('userName', formData.name);
      localStorage.setItem('userEmail', formData.email);
      localStorage.setItem('userId', response.userId || Date.now().toString());
      
      setTimeout(() => {
        window.location.href = '/test';
      }, 1500);
      
    } catch (err) {
      setError('Having trouble connecting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e8f5e8, #f0f8f0)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            borderRadius: 4,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(144, 238, 144, 0.3)',
            textAlign: 'center'
          }}
        >
          {/* Calming Header */}
          <Box mb={4}>
            <FavoriteOutlined 
              sx={{ 
                fontSize: 60, 
                color: '#4caf50', 
                mb: 2,
                opacity: 0.8
              }} 
            />
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 300,
                color: '#2e7d32',
                mb: 1,
                letterSpacing: '-0.5px'
              }}
            >
              Welcome
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ 
                fontSize: '1.1rem',
                lineHeight: 1.6,
                color: '#5a5a5a'
              }}
            >
              Take a moment for yourself. 
              <br />
              Your wellness journey starts here.
            </Typography>
          </Box>

          {/* Error/Success Messages */}
          {error && (
            <Fade in={!!error}>
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 3,
                  backgroundColor: '#fff3e0',
                  color: '#e65100',
                  border: 'none',
                  borderRadius: 2
                }}
              >
                {error}
              </Alert>
            </Fade>
          )}

          {success && (
            <Fade in={!!success}>
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  backgroundColor: '#f1f8e9',
                  color: '#2e7d32',
                  border: 'none',
                  borderRadius: 2
                }}
              >
                {success}
              </Alert>
            </Fade>
          )}

          {/* Simple Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Your Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81c784',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4caf50',
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              variant="outlined"
              sx={{ 
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#81c784',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#4caf50',
                  }
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: '#81c784' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 2,
                backgroundColor: '#4caf50',
                '&:hover': {
                  backgroundColor: '#43a047',
                },
                borderRadius: 3,
                textTransform: 'none',
                fontSize: '1.1rem',
                fontWeight: 500,
                boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 25px rgba(76, 175, 80, 0.4)',
                }
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Continue Your Journey'
              )}
            </Button>
          </Box>

          {/* Gentle Footer */}
          <Box mt={4}>
            <Typography 
              variant="caption" 
              color="text.secondary"
              sx={{ 
                display: 'block',
                fontSize: '0.9rem',
                color: '#7a7a7a',
                lineHeight: 1.5
              }}
            >
              🔒 Your information is safe and private
            </Typography>
            <Box sx={{ mt: 2, opacity: 0.6 }}>
              <Typography variant="caption" sx={{ fontSize: '1.2rem' }}>
                🌱 💚 ✨
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;