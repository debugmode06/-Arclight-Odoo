import apiClient from '@/services/api.client';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  company?: string;
  customerId?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: UserProfile;
}

export class AuthService {
  public static async login(email: string, password: string): Promise<AuthResponse> {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
      '/auth/login',
      { email, password }
    );
    const auth = res.data.data;
    if (auth?.accessToken) {
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(auth.user));
    }
    return auth;
  }

  public static async signup(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
    company?: string;
  }): Promise<AuthResponse> {
    const res = await apiClient.post<{ success: boolean; data: AuthResponse; message?: string }>(
      '/auth/signup',
      data
    );
    const auth = res.data.data;
    if (auth?.accessToken) {
      localStorage.setItem('accessToken', auth.accessToken);
      localStorage.setItem('currentUser', JSON.stringify(auth.user));
    }
    return auth;
  }

  public static getCurrentUser(): UserProfile | null {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  }
}
