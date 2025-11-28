import { create } from 'zustand';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

// Replace with your API endpoint
const API_URL = 'https://your-api.com';

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });
      set({ user: response.data.user, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },

  setUser: (user: User | null) => {
    set({ user, isAuthenticated: user !== null });
  },
}));
