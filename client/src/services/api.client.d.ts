import { AxiosInstance, AxiosResponse } from 'axios';
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
declare const apiClient: AxiosInstance;
/**
 * Helper to extract data from standard API response shape
 */
export declare function extractData<T>(response: AxiosResponse<ApiResponse<T>>): T;
export { apiClient };
export default apiClient;
//# sourceMappingURL=api.client.d.ts.map