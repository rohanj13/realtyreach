import React from 'react';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';
import { useAuth } from '../../Context/useAuth';

const UnauthorizedPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, getUserRole } = useAuth();
  const userRole = getUserRole();
  const isAuthenticated = isLoggedIn();

  // Determine where to redirect the user based on their role
  const handleRedirect = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (userRole === 'Customer') {
      navigate('/customerdashboard');
    } else if (userRole === 'Professional') {
      navigate('/professionaldashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh'
      }}>
        <Paper 
          elevation={3}
          sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: 2,
            maxWidth: '600px',
            width: '100%'
          }}
        >
          <Box sx={{ color: 'error.main', mb: 2 }}>
            <ErrorOutlineIcon sx={{ fontSize: 80 }} />
          </Box>
          
          <Typography variant="h4" component="h1" gutterBottom>
            Access Denied
          </Typography>
          
          <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
            You don't have permission to access this page. This area might be restricted to specific user roles or require authentication.
          </Typography>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleRedirect}
              size="large"
            >
              {!isAuthenticated ? 'Log In' : 'Go to Dashboard'}
            </Button>
            
            <Button
              variant="outlined"
              color="primary"
              component={Link}
              to="/"
              size="large"
            >
              Return to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
