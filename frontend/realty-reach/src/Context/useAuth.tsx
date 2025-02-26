import { createContext, useEffect, useState } from "react";
import { CustomerProfile, ProfessionalProfile, UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { backendRegisterAPI, getUser, loginAPI, registerAPI } from "../services/AuthService";
import { toast } from "react-toastify";
import React from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useToast } from "@chakra-ui/react";

type UserContextType = {
  user: UserProfile | null;
  token: string | null;
  registerUser: (email: string, password: string, role: string) => void;
  loginUser: (username: string, password: string) => void;
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
  const toast = useToast();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (email: string, password: string, role: string) => {
    await registerAPI(email, password, role)
      .then((res) => {
        if (res) {
          // localStorage.setItem("token", res?.data.token);
          // const decodedToken: { email: string; userId: string } = jwtDecode(res?.data.token);
          // const userObj = {
          //   email: decodedToken.email,
          //   userId: decodedToken.userId,
          // };
          // localStorage.setItem("user", JSON.stringify(userObj));
          // setUser(userObj);

          // setToken(res?.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
          toast({
            title: "Frontend Registered Successfully",
            status: "success",
            isClosable: true,
          });
        }
      })
      .catch(() =>
        toast({
          title: "Error Registering",
          status: "error",
          isClosable: true,
        })
      );

    await backendRegisterAPI()
      .then((res) => {
        if (res?.status === 200) {
          toast({
            title: "Backend Registration Successful",
            status: "success",
            isClosable: true,
          });
          navigate("/login");
        } else {
          toast({
            title: "Error Registering",
            status: "error",
            isClosable: true,
          });
        }
      })
      .catch(() =>
        toast({
          title: "Error Registering",
          status: "error",
          isClosable: true,
        })
      );
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          const token = res?.data.token;
          localStorage.setItem("token", token);
          setToken(token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  
          
          const role  = getUserRole();
          toast({
            title: "Login Successful",
            status: "success",
            isClosable: true,
          });
          if (role === "admin") {
            navigate("/admindashboard");
          } else {
            getUserDataBasedOnRole(role);
          }
        }
      })
      .catch(() =>
        toast({
          title: "Error Logging In",
          status: "error",
          isClosable: true,
        })
      );
  };
  
  const getUserDataBasedOnRole = async (role: string) => {
    await getUser()
      .then((res) => {
        if (res?.status === 200) {
          let userObj: UserProfile | CustomerProfile | ProfessionalProfile;
  
          if (role === "Customer") {
            userObj = {
              Id: res.data.userId,
              Email: res.data.email,
              FirstName: res.data.firstName || "",
              LastName: res.data.lastName || "",
              FirstLogin: res.data.firstLogin || "",
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
              FirstLogin: res.data.firstLogin || "",
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
          toast({
            title: "Error Retrieving User Data",
            status: "error",
            isClosable: true,
          });
        }
      })
      .catch(() =>
        toast({
          title: "Error Retrieving User Data",
          status: "error",
          isClosable: true,
        })
      );
  };

  const isLoggedIn = () => {
    if (!token) return false; // No token means the user is not logged in
  
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
    setToken("");
    navigate("/");
  };

  const getUserRole = () => {
    if (!token) return null;
    const decodedToken: any = jwtDecode(token);
    return decodedToken?.role;
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser, getUserRole }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
