import axios from 'axios';
import { useAuthStore } from '@/stores/auth-store';

let _basePath = '';

export function setApiBasePath(basePath: string): void {
  _basePath = basePath;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// URLs that should silently fail on 401 without redirecting to login
const SILENT_401_PATTERNS = ['/loyalty/'];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      const requestUrl = error.config?.url || '';
      const isSilent = SILENT_401_PATTERNS.some((p) => requestUrl.includes(p));

      if (!isSilent) {
        const authState = useAuthStore.getState();
        // No logout guest users (dine-in) — their token is session-scoped (login called with user = null)
        if (authState.user !== null) {
          authState.logout();
        }
        // Only redirect if basePath is set (valid restaurant) and not already on auth page
        if (_basePath && !window.location.pathname.includes('/auth/')) {
          const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `${_basePath}/auth/login?returnUrl=${returnUrl}`;
        }
      }
    }
    const message = error.response?.data?.message || error.message;
    return Promise.reject(new Error(Array.isArray(message) ? message[0] : message));
  }
);

export default api;
