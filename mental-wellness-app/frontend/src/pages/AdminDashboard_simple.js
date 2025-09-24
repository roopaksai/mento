import React, { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider
} from '@mui/material';
import {
  AdminPanelSettings,
  People,
  Assessment,
  MusicNote,
  Chat,
  ExitToApp
} from '@mui/icons-material';

const AdminDashboard = () => {
  const [adminInfo, setAdminInfo] = useState({});

  useEffect(() => {
    // Get admin info from localStorage
    const userName = localStorage.getItem('userName') || 'Admin';
    const userEmail = localStorage.getItem('userEmail') || 'admin@example.com';
    
    setAdminInfo({
      name: userName,
      email: userEmail
    });
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  const stats = [
    { title: 'Total Users', value: '127', icon: <People />, color: '#4caf50' },
    { title: 'Assessments', value: '89', icon: <Assessment />, color: '#2196f3' },
    { title: 'Music Sessions', value: '234', icon: <MusicNote />, color: '#ff9800' },
    { title: 'Chat Messages', value: '456', icon: <Chat />, color: '#9c27b0' },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #e8f5e8, #f0f8f0)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box display="flex" alignItems="center">
              <Avatar
                sx={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#4caf50',
                  mr: 3
                }}
              >
                <AdminPanelSettings fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h4" component="h1" sx={{ color: '#2e7d32', fontWeight: 300 }}>
                  Admin Dashboard
                </Typography>
                <Typography variant="h6" color="text.secondary">
                  Welcome back, {adminInfo.name}!
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {adminInfo.email}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{
                borderRadius: 2,
                textTransform: 'none'
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={4}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  borderRadius: 3,
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${stat.color}30`,
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 8px 25px ${stat.color}30`
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      backgroundColor: stat.color,
                      margin: '0 auto 16px'
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: stat.color }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {stat.title}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Admin Actions */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ color: '#2e7d32', fontWeight: 400 }}>
            Quick Actions
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 2,
                  backgroundColor: '#4caf50',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                View All Users
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 2,
                  backgroundColor: '#2196f3',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Assessment Reports
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 2,
                  backgroundColor: '#ff9800',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Music Analytics
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                fullWidth
                variant="contained"
                sx={{
                  py: 2,
                  backgroundColor: '#9c27b0',
                  borderRadius: 2,
                  textTransform: 'none'
                }}
              >
                Chat Monitoring
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Success Message */}
        <Box textAlign="center" mt={4}>
          <Typography variant="h6" sx={{ color: '#4caf50', fontWeight: 300 }}>
            🎉 Admin login successful! 
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            You now have access to the admin dashboard with all management features.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminDashboard;