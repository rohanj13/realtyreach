import { createContext, useEffect, useState } from "react";
import { UserProfile } from "../Models/User";
import { useNavigate } from "react-router-dom";
import { backendRegisterAPI, loginAPI, registerAPI } from "../Services/AuthService";
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
    // const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    if (token) {
    //   setUser(JSON.parse(user));
      setToken(token);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
    }
    setIsReady(true);
  }, []);

  const registerUser = async (
    email: string,
    password: string,
    role: string
  ) => {
    await registerAPI(email, password, role)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          const decodedToken: { email: string } = jwtDecode(res?.data.token);
          const userObj = {
            email: decodedToken.email
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj!);

          setToken(res?.data.token!);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
        toast({
            title: "Registered Successfully",
            status: "success",
            isClosable: true,
          });
          navigate("/dashboard");
        }
      })
      .catch((e) => toast({
        title: "Error Registering",
        status: "error",
        isClosable: true,
      }));

      await backendRegisterAPI()
      .then((res) => {
        if (res?.status === 200) {
            toast({
                title: "Registration Successful",
                status: "success",
                isClosable: true,
              });
              navigate("/dashboard");
        }
        else {
            toast({
                title: "Error Registering",
                status: "error",
                isClosable: true,
              });
        }
      })
      .catch((e) => toast({
        title: "Error Registering",
        status: "error",
        isClosable: true,
      }));
  };

  const loginUser = async (username: string, password: string) => {
    await loginAPI(username, password)
      .then((res) => {
        if (res) {
          localStorage.setItem("token", res?.data.token);
          setToken(res?.data.token!);
          axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
          const decodedToken: { email: string } = jwtDecode(res?.data.token);
          const userObj = {
            email: decodedToken.email
          };
          localStorage.setItem("user", JSON.stringify(userObj));
          setUser(userObj!);
          toast({
            title: "Login Successful",
            status: "success",
            isClosable: true,
          });
          navigate("/dashboard");
        }
      })
      .catch((e) => toast({
        title: "Error Logging In",
        status: "error",
        isClosable: true,
      }));
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