import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserRegistrationPage from './UserRegistrationPage';
import { ChakraProvider } from '@chakra-ui/react';
import ProtectedRoute from './ProtectedRoute';
import LandingPage from './LandingPage';
import Dashboard from './dashboard/Dashboard';
import { AuthProvider } from './Auth';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* Add other routes here */}
          </Routes>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
