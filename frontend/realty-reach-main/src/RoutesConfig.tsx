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
import ProfessionalProfileEdit from "./Pages/UserDashboard/ProfessionalProfileEdit";
import UnauthorizedPage from "./Pages/ErrorPages/UnauthorizedPage";
import MyJobs from "./Pages/UserDashboard/MyJobs";
import JobMatches from "./Pages/UserDashboard/JobMatches";

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
        path="/job/:jobId/matches"
        element={
          <ProtectedRoute allowedRoles={["Customer"]}>
            <JobMatches />
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
        path="/professionalregistration"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <ProfProfileCompletionPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/professional/profile/edit"
        element={
          <ProtectedRoute allowedRoles={["Professional"]}>
            <ProfessionalProfileEdit />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default RoutesConfig;
