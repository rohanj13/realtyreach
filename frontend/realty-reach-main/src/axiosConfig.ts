import axios from "axios";

const backendApi = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5073", // backend service URL
});

// Add token to request headers
backendApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired token (401)
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default backendApi;