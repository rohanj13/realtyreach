import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
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
          localStorage.setItem("token", res?.data.token);
          setToken(res?.data.token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

          // const decodedToken: { email: string; userId: string } = jwtDecode(res?.data.token);
          // const userObj = {
          //   email: decodedToken.email,
          //   userId: decodedToken.userId,
          // };
          // localStorage.setItem("user", JSON.stringify(userObj));
          // setUser(userObj);

          toast({
            title: "Login Successful",
            status: "success",
            isClosable: true,
          });
        }
      })
      .catch(() =>
        toast({
          title: "Error Logging In",
          status: "error",
          isClosable: true,
        })
      );

      await getUser()
      .then((res) => {
        if (res?.status === 200) {
          if (res.data.firstName || res.data.lastName) {
            const userObj = {
              Id: res.data.userId,
              Email: res.data.email,
              FirstName: res.data.firstName,
              LastName: res.data.lastName,
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            navigate("/customerdashboard");
          }
          else {
            const userObj = {
              Id: res.data.userId,
              Email: res.data.email,
              FirstName: "",
              LastName: "",
            };
            localStorage.setItem("user", JSON.stringify(userObj));
            setUser(userObj);
            navigate("/customerregistration");
          }
        } else {
          toast({
            title: "Error Logging In",
            status: "error",
            isClosable: true,
          });
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

  const isLoggedIn = () => {
    return !!token;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken("");
    navigate("/");
  };

  return (
    <UserContext.Provider
      value={{ loginUser, user, token, logout, isLoggedIn, registerUser }}
    >
      {isReady ? children : null}
    </UserContext.Provider>
  );
};

export const useAuth = () => React.useContext(UserContext);
