import axios from 'axios';
import { useAuthStore } from '../store/authStore';

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      if (typeof (config.headers as any)?.set === 'function') {
        (config.headers as any).set('Authorization', `Bearer ${token}`);
      } else if (config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }
    // Don't intercept refresh/login/register requests
    if (originalRequest.url?.includes('/auth/')) {
       return Promise.reject(error);
    }
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          useAuthStore.getState().logout();
          return Promise.reject(error);
        }

        const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefreshToken, userId, email, roles } = res.data.data;
        
        localStorage.setItem('refreshToken', newRefreshToken);
        useAuthStore.getState().setAuth({ accessToken, userId, email, roles });
        
        if (typeof (originalRequest.headers as any)?.set === 'function') {
          (originalRequest.headers as any).set('Authorization', `Bearer ${accessToken}`);
        } else if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
