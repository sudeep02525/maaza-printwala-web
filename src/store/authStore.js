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
      set({ user: res.data?.user || res.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/forgot-password', { email });
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  resetPassword: async (token, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/reset-password', { token, newPassword });
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.post('/auth/change-password', { currentPassword, newPassword });
      set({ isLoading: false });
      return res;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.put('/auth/profile', data);
      const updatedUser = res.data?.user || res.user;
      set((state) => ({
        user: { ...state.user, ...updatedUser },
        isLoading: false,
      }));
      return res;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  addresses: [],
  addressesLoading: false,

  fetchAddresses: async () => {
    set({ addressesLoading: true });
    try {
      const res = await axiosInstance.get('/auth/addresses');
      set({ addresses: res.data?.addresses || [], addressesLoading: false });
    } catch (error) {
      set({ addressesLoading: false });
    }
  },

  addAddress: async (data) => {
    const res = await axiosInstance.post('/auth/addresses', data);
    const newAddress = res.data?.address;
    if (newAddress) {
      set((state) => {
        let updatedList = newAddress.isDefault
          ? state.addresses.map((a) => ({ ...a, isDefault: false }))
          : [...state.addresses];
        return { addresses: [newAddress, ...updatedList] };
      });
    }
    return res;
  },

  updateAddress: async (id, data) => {
    const res = await axiosInstance.put(`/auth/addresses/${id}`, data);
    const updated = res.data?.address;
    if (updated) {
      set((state) => ({
        addresses: state.addresses.map((a) => {
          if (a._id === id) return updated;
          if (updated.isDefault) return { ...a, isDefault: false };
          return a;
        }),
      }));
    }
    return res;
  },

  deleteAddress: async (id) => {
    await axiosInstance.delete(`/auth/addresses/${id}`);
    set((state) => ({
      addresses: state.addresses.filter((a) => a._id !== id),
    }));
  },

  setDefaultAddress: async (id) => {
    const res = await axiosInstance.patch(`/auth/addresses/${id}/default`);
    set((state) => ({
      addresses: state.addresses.map((a) => ({
        ...a,
        isDefault: a._id === id,
      })),
    }));
    return res;
  },
}));
