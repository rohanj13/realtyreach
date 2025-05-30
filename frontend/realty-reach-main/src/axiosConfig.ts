import axios from "axios";

// Set base URL for API requests
axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5073";

// Add a response interceptor for handling token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token is expired or invalid
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
