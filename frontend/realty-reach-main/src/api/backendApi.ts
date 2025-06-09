import axios from 'axios';

export const backendApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5073',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the auth token
backendApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
); 