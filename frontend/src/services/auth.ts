import apiClient from '@/lib/api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/users/signin', credentials);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/users/register', data);
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
    }
    return response.data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/users/logout');
    // localStorage.removeItem('auth_token');
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const token = this.getToken();
    if (!token) throw new Error('Authentication required');
    const response = await apiClient.get<AuthResponse>('/users/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.data.user) throw new Error('User data not found in response');
    return response.data.user;
  },

  
};