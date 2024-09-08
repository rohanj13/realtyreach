import axios from 'axios';

const API_BASE_URL = 'http://localhost:5073'; // Replace with your actual backend URL

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
}

export const login = async (data: LoginData): Promise<void> => {
  const response = await axios.post(`${API_BASE_URL}/login`, data);
  localStorage.setItem('authToken', response.data.token); // Assuming the response includes a token
};

export const register = async (data: RegisterData): Promise<void> => {
  await axios.post(`${API_BASE_URL}/register`, data);
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
};
