import axios from 'axios';

const API_URL = 'https://budgetflow-backend-c4uu.onrender.com/api/';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await axios.post('http://127.0.0.1:8000/api/token/', { username, password });
  localStorage.setItem('access_token', response.data.access);
  return response.data;
};

export const register = async (username, password, email = '') => {
  const response = await axios.post('http://127.0.0.1:8000/api/register/', { username, password, email });
  return response.data;
};

export const forgotPassword = async (email) => {
  const response = await axios.post('http://127.0.0.1:8000/api/forgot-password/', { email });
  return response.data;
};

export const resetPasswordConfirm = async (uid, token, newPassword) => {
  const response = await axios.post('http://127.0.0.1:8000/api/reset-password-confirm/', { uid, token, new_password: newPassword });
  return response.data;
};

export const getTransactions = () => api.get('/transactions/');
export const createTransaction = (data) => api.post('/transactions/', data);
export const deleteTransaction = (id) => api.delete(`/transactions/${id}/`);
export const getStats = () => api.get('/stats/');

export default api;