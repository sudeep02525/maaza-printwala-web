import { create } from 'zustand';
import axiosInstance from '@/services/axiosInstance.js';

export const useSettingsStore = create((set, get) => ({
  settings: {
    storeName: 'Maza Printwala',
    tagline: 'Enterprise Commercial Printing & Merchandising',
    supportEmail: 'support@maazaprintwala.in',
    supportPhone: '1800-PRINT-NOW',
    dispatchCity: 'Mumbai, Maharashtra',
    gstRate: 18,
    freeShippingThreshold: 999,
    standardShippingFee: 99,
    minOrderValue: 199,
    defaultDpiCheck: 300,
    autoApproveProof: false,
  },
  isLoading: false,
  isFetched: false,

  fetchSettings: async () => {
    if (get().isFetched) return;
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get('/settings');
      const data = res?.data?.settings || res?.settings;
      if (data) {
        set((state) => ({
          settings: { ...state.settings, ...data },
          isFetched: true,
        }));
      }
    } catch (e) {
      // Keep sensible defaults on connection failure
    } finally {
      set({ isLoading: false });
    }
  },
}));
