// RoutesConfig.tsx
import React from "react";
import { Routes, Route } from "react-router-dom";
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

const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/professionals" element={<ProfLandingPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      {/* Protected Routes */}
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
      <Route
        path="/professionaldashboard"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <ProfessionalDashboard />
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
