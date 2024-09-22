import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (email: string, password: string) => Promise<void>;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!token);
    const navigate = useNavigate();

    useEffect(() => {
        axios.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : '';

        // Interceptor to handle token refresh
        const interceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response.status === 401 && refreshToken) {
                    try {
                        const response = await axios.post('http://localhost:5073/refresh', {
                            token: refreshToken,
                        }, {
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/json',
                            }
                        });
                        const newToken = response.data.accessToken;
                        setToken(newToken);
                        localStorage.setItem('token', newToken);
                        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
                        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                        return axios(originalRequest);
                    } catch (refreshError) {
                        console.error('Token refresh failed:', refreshError);
                        logout();
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.response.eject(interceptor);
        };
    }, [token, refreshToken]);

    const login = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:5073/login', { 
                email, 
                password 
            }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const { accessToken, refreshToken } = response.data;
            setToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setIsAuthenticated(true);
            navigate('/dashboard'); // or wherever you want to redirect after login
        } catch (error: any) {
            console.error('Login failed:', error.response ? error.response.data : error.message);
            setIsAuthenticated(false);
        }
    };

    const logout = () => {
        setToken(null);
        setRefreshToken(null);
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const register = async (email: string, password: string) => {
        try {
            const response = await axios.post('http://localhost:5073/register', { 
                email, 
                password 
            }, {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            const { accessToken, refreshToken } = response.data;
            setToken(accessToken);
            setRefreshToken(refreshToken);
            localStorage.setItem('token', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            setIsAuthenticated(true);
            navigate('/dashboard');
        } catch (error: any) {
            console.error('Registration failed:', error.response ? error.response.data : error.message);
            setIsAuthenticated(false);
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, register, token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
