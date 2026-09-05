import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach JWT bearer token if available
    if (config.url && config.baseURL === '/api' && config.url.startsWith('/api/')) {
      config.url = config.url.slice(4);
    }
    const token = localStorage.getItem('dealflow_token') || localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Extract error messages uniformly
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ error?: { message?: string; code?: string } }>) => {
    const customMessage = error.response?.data?.error?.message || error.message || 'An unexpected error occurred';
    return Promise.reject(new Error(customMessage));
  }
);

export function extractData<T>(response: AxiosResponse<{ success?: boolean; data?: T }>): T {
  return response.data.data as T;
}

export default apiClient;

