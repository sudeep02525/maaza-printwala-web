import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance.js';

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  register: async (name, email, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/register', { name, email, password, phone });
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
      return res.data;
    } catch (error) {
      set({ error: error.message, isLoading: false, isAuthenticated: false });
      throw error;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
    } catch (e) {
      console.error('Logout error', e);
    } finally {
      set({ user: null, isAuthenticated: false });
    }
  },

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/me');
      set({ user: res.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
