import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance.js';

export const useCartStore = create((set, get) => ({
  items: [],
  cartTotal: 0,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/cart');
      const cart = response.data?.data?.cart || { items: [], cartTotal: 0 };
      set({
        items: cart.items || [],
        cartTotal: cart.cartTotal || 0,
        isLoading: false,
      });
      return cart;
    } catch (err) {
      set({
        isLoading: false,
        error: err.response?.data?.message || err.message || 'Failed to fetch cart',
      });
      return { items: [], cartTotal: 0 };
    }
  },

  addItemToCart: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/cart/items', payload);
      const cart = response.data?.data?.cart || { items: [], cartTotal: 0 };
      set({
        items: cart.items || [],
        cartTotal: cart.cartTotal || 0,
        isLoading: false,
      });
      return { success: true, cart };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item to cart';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateItemQuantity: async (itemId, quantity, configuration = undefined, dimensions = undefined) => {
    set({ isLoading: true, error: null });
    try {
      const payload = {};
      if (quantity !== undefined) payload.quantity = quantity;
      if (configuration !== undefined) payload.configuration = configuration;
      if (dimensions !== undefined) payload.dimensions = dimensions;

      const response = await axiosInstance.patch(`/cart/items/${itemId}`, payload);
      const cart = response.data?.data?.cart || { items: [], cartTotal: 0 };
      set({
        items: cart.items || [],
        cartTotal: cart.cartTotal || 0,
        isLoading: false,
      });
      return { success: true, cart };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update item';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  removeItem: async (itemId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/cart/items/${itemId}`);
      const cart = response.data?.data?.cart || { items: [], cartTotal: 0 };
      set({
        items: cart.items || [],
        cartTotal: cart.cartTotal || 0,
        isLoading: false,
      });
      return { success: true, cart };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove item';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  clearCart: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete('/cart');
      const cart = response.data?.data?.cart || { items: [], cartTotal: 0 };
      set({
        items: cart.items || [],
        cartTotal: cart.cartTotal || 0,
        isLoading: false,
      });
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to clear cart';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));
