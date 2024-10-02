import axios from "axios";
import { handleError } from "../Helpers/ErrorHandler";
import { UserProfileToken } from "../Models/User";

//Template this out, pull it from env variable file
const identityAPI = "http://localhost:5209/api/Auth/";
const backendAPI = "http://localhost:5073/api/";

export const loginAPI = async (email: string, password: string) => {
  try {
    const data = await axios.post<UserProfileToken>(identityAPI + "login", {
      email: email,
      password: password,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const registerAPI = async (
  email: string,
  password: string,
  role: string
) => {
  try {
    const data = await axios.post<UserProfileToken>(identityAPI + "register", {
      email: email,
      password: password,
      role: role,
    });
    return data;
  } catch (error) {
    handleError(error);
  }
};

export const backendRegisterAPI = async () => {
  try {
    const data = await axios.post(backendAPI + "User");
    return data;
  } catch (error) {
    handleError(error);
  }
};