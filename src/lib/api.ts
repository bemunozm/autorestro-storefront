import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      useAuthStore.getState().logout();
      if (!window.location.pathname.includes('/auth/')) {
        window.location.href = window.location.pathname.split('/').slice(0, 2).join('/') + '/auth/login';
      }
    }
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
  }
);

export default api;
