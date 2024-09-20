import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserRegistrationPage from './UserRegistrationPage';
import { ChakraProvider } from '@chakra-ui/react';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './SharedComponents/UserLandingPage/LandingPage';
import Dashboard from './Users/dashboard/Dashboard';
import { AuthProvider } from './Auth';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
      <Auth0Provider
            domain="dev-god8ylqmp1m1i5gj.au.auth0.com"
            clientId="0lkP3nSn1ETZWoWDLKACYtJUfjgXKMKZ"
            authorizationParams={{
              redirect_uri: window.location.origin
            }}
          >
          <Routes>
            <Route path="/" element={<LandingPageWithAuthCheck />} />
            {/* <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<UserRegistrationPage />} /> */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* Add other routes here */}
          </Routes>
        </Auth0Provider>
      </Router>
    </ChakraProvider>
  );
};

export default App;

const LandingPageWithAuthCheck: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard'); // Redirect to dashboard if authenticated
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show a loading spinner or the landing page based on authentication status
  return isLoading ? <div>Loading...</div> : <LandingPage />;
};