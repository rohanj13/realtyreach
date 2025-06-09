import { createContext, useEffect, useState } from "react";
import { CustomerProfile, ProfessionalProfile, UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React from "react";
import { Alert, Snackbar } from "@mui/material";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string, role: string) => Promise<void>;
  loginUser: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: () => boolean;
  getUserRole: () => string | null;
};

type Props = { children: React.ReactNode };

const UserContext = createContext<UserContextType>({} as UserContextType);

export const UserProvider = ({ children }: Props) => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [alert, setAlert] = useState<{ message: string, severity: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setIsReady(true);
  }, []);

  const registerUser = async (email: string, password: string, role: string) => {
    try {
      const response = await axios.post("/api/Auth/register", { email, password, role });
      
      if (response && response.status === 200) {
        showAlert("Registration successful! Please log in.", "success");
        navigate("/login");
        return;
      }
    } catch (error) {
      showAlert("Registration failed. Please try again.", "error");
    }
  };

  const loginUser = async (username: string, password: string) => {
    try {
      const response = await axios.post("/api/Auth/login", { email: username, password });
      
      if (response?.data.token) {
        const token = response.data.token;
        localStorage.setItem("token", token);
        setToken(token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        
        const role = getUserRole();
        showAlert("Login successful!", "success");
        
        if (role === "admin") {
          navigate("/admindashboard");
        } else {
          await getUserDataBasedOnRole(role);
        }
      }
    } catch (error) {
      showAlert("Login failed. Please check your credentials.", "error");
    }
  };

  const getUserDataBasedOnRole = async (role: string | null) => {
    if (!role) return;
    
    try {
      const res = await axios.get("/api/User");
      
      if (res?.status === 200) {
        let userObj: UserProfile | CustomerProfile | ProfessionalProfile;
  
        if (role === "Customer") {
          userObj = {
            Id: res.data.userId,
            Email: res.data.email,
            FirstName: res.data.firstName || "",
            LastName: res.data.lastName || "",
            FirstLogin: res.data.firstLogin || false,
          } as CustomerProfile;
  
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);
  
          if (userObj.FirstLogin) {
            navigate("/customerregistration");
          } else {
            navigate("/customerdashboard");
          }
        } else if (role === "Professional") {
          userObj = {
            Id: res.data.userId,
            Email: res.data.email,
            FirstName: res.data.firstName || "",
            LastName: res.data.lastName || "",
            FirstLogin: res.data.firstLogin || false,
            ABN: res.data.ABN || "",
            LicenseNumber: res.data.LicenseNumber || "",
            CompanyName: res.data.CompanyName || "",
          } as ProfessionalProfile;
  
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj);
  
          if (userObj.FirstLogin) {
            navigate("/professionalregistration");
          } else {
            navigate("/professionaldashboard");
          }
        }
      } else {
        showAlert("Error retrieving user data", "error");
      }
    } catch (error) {
      showAlert("Error retrieving user data", "error");
    }
  };

  const isLoggedIn = () => {
    if (!token) return false;
  
    try {
      const decodedToken: any = jwtDecode(token);
      const isExpired = decodedToken.exp * 1000 < Date.now(); // Convert exp to milliseconds
      if (isExpired) {
        logout(); // Automatically log out if the token is expired
        return false;
      }
      return true; // Valid and non-expired token
    } catch (error) {
      logout(); // Invalid token
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common["Authorization"];
    navigate("/");
  };

  const getUserRole = () => {
    if (!token) return null;
    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken?.role;
    } catch {
      return null;
    }
  };
  
  const showAlert = (message: string, severity: 'success' | 'error' | 'info' | 'warning') => {
    setAlert({ message, severity });
    setTimeout(() => setAlert(null), 5000); // Auto close after 5 seconds
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser, getUserRole }}
    >
      {alert && (
        <Snackbar open={!!alert} autoHideDuration={5000} onClose={() => setAlert(null)}>
          <Alert severity={alert.severity} sx={{ width: '100%' }}>
            {alert.message}
          </Alert>
        </Snackbar>
      )}
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
