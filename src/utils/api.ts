import { mockAPI } from './mockApi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
const USE_MOCK_API = false; // Use real API

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface MoodLog {
  id: string;
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
  createdAt: string;
}

export interface Badge {
  id: string;
  badgeId: string;
  name: string;
  icon: string;
  unlocked: boolean;
  description: string;
  unlockedAt?: string;
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalLogs: number;
  lastLogDate?: string;
}

export interface DashboardData {
  user: User;
  stats: UserStats;
  badges: Badge[];
  recentLogs: MoodLog[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface MoodLogRequest {
  date: string;
  mood: string;
  emoji: string;
  intensity: number;
  note?: string;
}

// API utility functions
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('mindlink_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleResponse<T>(response);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: data ? JSON.stringify(data) : undefined
    });
    return this.handleResponse<T>(response);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    return this.handleResponse<T>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);

// Auth API functions
export const authAPI = {
  register: async (data: RegisterRequest): Promise<ApiResponse<AuthResponse>> => {
    if (USE_MOCK_API) return mockAPI.register(data);

    const response = await api.post('/auth/register', data);
    // Transform response to match expected format
    return {
      success: true,
      data: response.data
    };
  },

  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    if (USE_MOCK_API) return mockAPI.login(data);

    const response = await api.post('/auth/login', data);
    // Transform response to match expected format
    return {
      success: true,
      data: response.data
    };
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const response = await api.get('/auth/me');
    // Transform response to match expected format
    return {
      success: true,
      data: response.data
    };
  },

  forgotPassword: (email: string): Promise<ApiResponse> =>
    api.post('/auth/forgotpassword', { email }),

  resetPassword: (token: string, password: string): Promise<ApiResponse<AuthResponse>> =>
    api.put(`/auth/resetpassword/${token}`, { password })
};

// Mood API functions (now using journals endpoint)
export const moodAPI = {
  getLogs: async (page = 1, limit = 50): Promise<ApiResponse<MoodLog[] & { pagination: any }>> => {
    if (USE_MOCK_API) return mockAPI.getJournal();

    const response = await api.get(`/journals?page=${page}&limit=${limit}`);
    // Transform response to match expected format
    return {
      success: true,
      data: response.data,
      pagination: response.pagination
    };
  },

  getLog: async (id: string): Promise<ApiResponse<MoodLog>> => {
    const response = await api.get(`/journals/${id}`);
    return {
      success: true,
      data: response.data
    };
  },

  createLog: async (data: MoodLogRequest): Promise<ApiResponse<MoodLog>> => {
    if (USE_MOCK_API) return mockAPI.createLog(data);

    const response = await api.post('/journals', data);
    return {
      success: true,
      data: response.data
    };
  },

  updateLog: async (id: string, data: Partial<MoodLogRequest>): Promise<ApiResponse<MoodLog>> => {
    const response = await api.put(`/journals/${id}`, data);
    return {
      success: true,
      data: response.data
    };
  },

  deleteLog: async (id: string): Promise<ApiResponse> => {
    const response = await api.delete(`/journals/${id}`);
    return {
      success: true,
      message: response.message || 'Log deleted'
    };
  }
};

// User API functions
export const userAPI = {
  getStats: async (): Promise<ApiResponse<UserStats>> => {
    const response = await api.get('/user/stats');
    return {
      success: true,
      data: response.data
    };
  },

  getBadges: async (): Promise<ApiResponse<Badge[]>> => {
    const response = await api.get('/user/badges');
    return {
      success: true,
      data: response.data
    };
  },

  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    if (USE_MOCK_API) return mockAPI.getDashboard();

    const response = await api.get('/user/dashboard');
    return {
      success: true,
      data: response.data
    };
  }
};

// Journal API functions (now integrated with journals endpoint)
export const journalAPI = {
  getEntries: async (page = 1, limit = 20): Promise<ApiResponse<MoodLog[] & { pagination: any }>> => {
    if (USE_MOCK_API) return mockAPI.getJournal();

    const response = await api.get(`/journals?page=${page}&limit=${limit}`);
    return {
      success: true,
      data: response.data,
      pagination: response.pagination
    };
  },

  getEntry: async (id: string): Promise<ApiResponse<MoodLog>> => {
    const response = await api.get(`/journals/${id}`);
    return {
      success: true,
      data: response.data
    };
  },

  updateEntry: async (id: string, note: string): Promise<ApiResponse<MoodLog>> => {
    const response = await api.put(`/journals/${id}`, { note });
    return {
      success: true,
      data: response.data
    };
  },

  getTodayEntry: async (): Promise<ApiResponse<MoodLog | null>> => {
    const response = await api.get('/journals/today');
    return {
      success: true,
      data: response.data
    };
  },

  getStreakStats: async (): Promise<ApiResponse<{ currentStreak: number; longestStreak: number }>> => {
    const response = await api.get('/journals/streak/stats');
    return {
      success: true,
      data: response.data
    };
  }
};
