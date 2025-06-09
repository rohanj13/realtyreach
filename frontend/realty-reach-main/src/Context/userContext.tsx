import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { Alert, Snackbar } from "@mui/material";

import { registerAPI, loginAPI, getUser, createUserInBackend } from "../services/AuthService";
import { CustomerProfile, ProfessionalProfile, UserProfile } from "../Models/User";
import backendApi from "@/axiosConfig";

type UserContextType = {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  token: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  registerUser: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
  getUserRole: () => string | null;
};

export const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ message: string; severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);
      backendApi.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000);
  };

  const registerUser = async (email: string, password: string, role: string) => {
    try {
      const response = await registerAPI(email, password, role);
      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        setToken(token);
        backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await createUserInBackend();
        showAlert("Registration successful! Please log in.", "success");
        navigate("/login");
      }
    } catch {
      showAlert("Registration failed. Please try again.", "error");
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await loginAPI(email, password);
      const token = response.data.token;
      
      if (token) {
        // Set token in localStorage and API headers first
        localStorage.setItem("token", token);
        setToken(token);
        backendApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        // Get role using the fresh token, not the state
        const role = getUserRoleFromToken(token);
        console.log("User role:", role); // Debug log
        
        if (role === "admin") {
          showAlert("Login successful!", "success");
          navigate("/admindashboard");
        } else {
          // Fetch user data first, then navigate
          await handleUserDataFetch(role);
          showAlert("Login successful!", "success");
        }
      }
    } catch (error) {
      console.error("Login error:", error); // Debug log
      showAlert("Login failed. Please check your credentials.", "error");
      throw error; // Re-throw to be caught in the component
    }
  };

  const handleUserDataFetch = async (role: string | null) => {
    if (!role) {
      console.log("No role provided to handleUserDataFetch"); // Debug log
      return;
    }
    
    try {
      console.log("Fetching user data for role:", role); // Debug log
      const res = await getUser();
      
      if (res?.status !== 200) {
        showAlert("Error retrieving user data", "error");
        return;
      }
      
      const { id, email, firstName, lastName, firstLogin, ABN, LicenseNumber, CompanyName } = res.data;
      let userObj: UserProfile;
      let redirectPath: string;
      
      if (role === "Customer") {
        userObj = { 
          Id: id, 
          Email: email, 
          FirstName: firstName || "", 
          LastName: lastName || "", 
          FirstLogin: firstLogin || false 
        };
        redirectPath = userObj.FirstLogin ? "/customerregistration" : "/customerdashboard";
      } else {
        userObj = {
          Id: id,
          Email: email,
          FirstName: firstName || "",
          LastName: lastName || "",
          FirstLogin: firstLogin || false,
          ABN: ABN || "",
          LicenseNumber: LicenseNumber || "",
          CompanyName: CompanyName || "",
        } as ProfessionalProfile;
        redirectPath = userObj.FirstLogin ? "/professionalregistration" : "/professionaldashboard";
      }
      
      // Set user data in localStorage and state
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      
      console.log("Navigating to:", redirectPath); // Debug log
      // Navigate after everything is set
      navigate(redirectPath);
      
    } catch (error) {
      console.error("Error in handleUserDataFetch:", error); // Debug log
      showAlert("Error retrieving user data", "error");
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete backendApi.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const isLoggedIn = () => {
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {
        logout();
        return false;
      }
      return true;
    } catch {
      logout();
      return false;
    }
  };

  const getUserRole = () => {
    try {
      const decoded: any = jwtDecode(token || "");
      return decoded?.role || null;
    } catch {
      return null;
    }
  };

  const getUserRoleFromToken = (tokenValue: string) => {
  try {
    const decoded: any = jwtDecode(tokenValue || "");
    return decoded?.role || null;
  } catch {
    return null;
  }
};

  return (
    <UserContext.Provider value={{ user, setUser, token, loginUser, logout, isLoggedIn, registerUser, getUserRole }}>
      {alert && (
        <Snackbar open={!!alert} autoHideDuration={5000} onClose={() => setAlert(null)}>
          <Alert severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
      {children}
    </UserContext.Provider>
  );
};