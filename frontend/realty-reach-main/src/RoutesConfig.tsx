import React from "react";
import { Routes, Route } from "react-router-dom";
// Make sure the file exists at this path, or update the path if needed
import ProtectedRoute from "./Routes/ProtectedRoute";
import LandingPage from "./Pages/LandingPage/LandingPage";
import LoginPage from "./Pages/LoginPage/LoginPage";
import RegisterPage from "./Pages/RegisterPage/RegisterPage";
import CustomerDashboard from "./Pages/UserDashboard/CustomerDashboard";
import ProfessionalDashboard from "./Pages/UserDashboard/ProfessionalDashboard";
import ProfLandingPage from "./Pages/LandingPage/ProfLandingPage";
import CustomerProfileCompletionPage from "./Pages/RegisterPage/CustomerProfileCompletion";
import ProfProfileCompletionPage from "./Pages/RegisterPage/ProfProfileCompletion";
import UnauthorizedPage from "./Pages/ErrorPages/UnauthorizedPage";
import MyJobs from "./Pages/UserDashboard/MyJobs";
import AvailableJobs from "./Pages/UserDashboard/AvailableJobs";

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/professionals" element={<ProfLandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes for Customers */}
      <Route
        path="/customerdashboard"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my-jobs"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <MyJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/customerregistration"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <CustomerProfileCompletionPage />
          </ProtectedRoute>
        }
      />
      
      {/* Protected Routes for Professionals */}
      <Route
        path="/professionaldashboard"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <ProfessionalDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/available-jobs"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <AvailableJobs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professionalregistration"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <ProfProfileCompletionPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutesConfig;
