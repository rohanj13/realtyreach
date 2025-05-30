import axios from "../axiosConfig";

export const registerAPI = async (email: string, password: string, role: string) => {
  try {
    return await axios.post("/api/Auth/register", { email, password, role });
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const backendRegisterAPI = async () => {
  try {
    return await axios.post("/api/User");
  } catch (error) {
    console.error("Error registering with backend:", error);
    throw error;
  }
};

export const loginAPI = async (email: string, password: string) => {
  try {
    return await axios.post("/api/Auth/login", { email, password });
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    return await axios.get("/api/User");
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};
