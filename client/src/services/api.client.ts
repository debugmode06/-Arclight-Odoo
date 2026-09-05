import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/constants';
import { ApiResponse } from '@/types';

/**
 * Shared Axios HTTP client
 * Owner: Member 1
 *
 * All API modules should use this client instance.
 * It handles:
 * - Base URL
 * - Authorization header injection
 * - Response unwrapping
 * - 401 handling (token refresh — to be implemented by Member 1)
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ─── Request Interceptor: Inject access token ─────────────────────────────
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Prevent duplicate prefix when baseURL is '/api' and config.url starts with '/api/'
    if (config.url && config.baseURL === '/api' && config.url.startsWith('/api/')) {
      config.url = config.url.slice(4);
    }
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor: Handle 401 and unwrap ─────────────────────────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // TODO: Member 1 — Implement token refresh flow
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Helper to extract data from standard API response shape
 */
export function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (!response.data.success || response.data.data === undefined) {
    throw new Error(response.data.error?.message || 'API error');
  }
  return response.data.data;
}

export { apiClient };
export default apiClient;
