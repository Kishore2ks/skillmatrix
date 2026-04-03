const API_BASE_URL = 'https://api.skillsalpha.com/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface ApiError {
  message: string;
  status?: number;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options?.headers,
        },
      });

      if (response.status === 401) {
        this.clearToken();
        window.location.href = '/login';
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    this.setToken(response.token);
    return response;
  }

  async logout() {
    this.clearToken();
  }

  // User Management APIs
  async getUserList(filters?: any) {
    return this.request('/users/list', {
      method: 'POST',
      body: JSON.stringify(filters || {}),
    });
  }

  async saveUser(userData: any) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getUser(userId: string) {
    return this.request('/users/getUser', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async bulkUploadComplete(data: any) {
    return this.request('/users/bulk-upload/complete', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkUploadUsers(data: any) {
    return this.request('/users/bulk-upload/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkUploadSkills(data: any) {
    return this.request('/users/bulk-upload/user-skills', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async bulkUploadCompetency(data: any) {
    return this.request('/users/bulk-upload/user-competency', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getUserSkills(userId: string) {
    return this.request('/users/skills/list', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async saveUserSkills(userId: string, skills: any[]) {
    return this.request('/users/skills/save', {
      method: 'POST',
      body: JSON.stringify({ userId, skills }),
    });
  }

  async getUserCompetencies(userId: string) {
    return this.request('/users/competency/list', {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async saveUserCompetencies(userId: string, competencies: any[]) {
    return this.request('/users/competency/save', {
      method: 'POST',
      body: JSON.stringify({ userId, competencies }),
    });
  }
}

export const api = new ApiClient();
