import identityApi from "@/authApi";
import backendApi from "@/axiosConfig";

export const registerAPI = async (email: string, password: string, role: string) => {
  try {
    return await identityApi.post("/api/Auth/register", { email, password, role });
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginAPI = async (email: string, password: string) => {
  try {
    return await identityApi.post("/api/Auth/login", { email, password });
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};

export const getUser = async () => {
  try {
    return await backendApi.get("/api/User");
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const createUserInBackend = async () => {
  try {
    return await backendApi.post("/api/User");
  } catch (error) {
    console.error("Error creating user in backend:", error);
    throw error;
  }
};
