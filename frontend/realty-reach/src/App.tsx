import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Pages/LoginPage/LoginPage';
import UserRegistrationPage from './Pages/RegisterPage/RegisterPage';
import { ChakraProvider } from '@chakra-ui/react';
import ProtectedRoute from './Routes/ProtectedRoute';
import LandingPage from './Pages/LandingPage/LandingPage';
import Dashboard from './Pages/UserDashboard/Dashboard';
import { UserProvider } from './Context/useAuth';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import CustomerDashboard from './Pages/UserDashboard/CustomerDashboard';
import ProfessionalDashboard from './Pages/UserDashboard/ProfessionalDashboard';
import ProfLandingPage from './Pages/LandingPage/ProfLandingPage';
import UserProfileCompletionPage from './Pages/RegisterPage/UserProfileCompletion';

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/customerdashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/professionaldashboard" element={<ProfessionalDashboard />} />
            <Route path="/professionals" element={<ProfLandingPage />} />
            <Route path="/customerregistration" element={<ProtectedRoute><UserProfileCompletionPage /></ProtectedRoute>} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            {/* Add other routes here */}
          </Routes>
        </UserProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
