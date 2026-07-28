import { create } from 'zustand';
import axiosInstance from '../services/axiosInstance.js';

export const useCheckoutStore = create((set, get) => ({
  draft: null,
  deliveryMethods: [],
  isLoading: false,
  error: null,
  priceChangedNotice: false,
  currentStep: 1, // 1: Contact, 2: Delivery Address, 3: Billing & GST, 4: Delivery Method, 5: Review & Prepare Payment

  setStep: (step) => set({ currentStep: step }),
  resetError: () => set({ error: null }),
  clearPriceNotice: () => set({ priceChangedNotice: false }),

  initCheckout: async () => {
    set({ isLoading: true, error: null, priceChangedNotice: false });
    try {
      const response = await axiosInstance.get('/checkout/init');
      const draft = response.data?.data?.draft || null;
      const priceChanged = response.data?.data?.priceChanged || false;

      // Determine appropriate starting step based on existing draft data
      let step = 1;
      if (draft?.contactDetails?.fullName && draft?.contactDetails?.phone) {
        step = 2;
        if (draft?.deliveryAddress?.streetAddress && draft?.deliveryAddress?.pinCode) {
          step = 3;
          if (draft?.billingDetails?.address?.streetAddress || draft?.billingDetails?.sameAsDelivery) {
            step = 4;
            if (draft?.selectedDeliveryRule) {
              step = 5;
            }
          }
        }
      }

      set({
        draft,
        isLoading: false,
        priceChangedNotice: priceChanged,
        currentStep: step,
      });
      return { success: true, draft, priceChanged };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to initialize checkout';
      set({ isLoading: false, error: msg, draft: null });
      return { success: false, error: msg };
    }
  },

  fetchDeliveryMethods: async (pinCode) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/checkout/delivery-methods?pinCode=${pinCode}`);
      const methods = response.data?.data?.deliveryMethods || [];
      set({ deliveryMethods: methods, isLoading: false });
      return { success: true, methods };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to fetch delivery methods';
      set({ isLoading: false, error: msg, deliveryMethods: [] });
      return { success: false, error: msg };
    }
  },

  updateContact: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const draftId = get().draft?._id;
      const response = await axiosInstance.patch('/checkout/contact', { ...payload, draftId });
      const draft = response.data?.data?.draft || null;
      set({ draft, isLoading: false, currentStep: 2 });
      return { success: true, draft };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update contact details';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateAddress: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const draftId = get().draft?._id;
      const response = await axiosInstance.patch('/checkout/address', { ...payload, draftId });
      const draft = response.data?.data?.draft || null;
      set({ draft, isLoading: false, currentStep: 3 });
      return { success: true, draft };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update delivery address';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  updateBilling: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const draftId = get().draft?._id;
      const response = await axiosInstance.patch('/checkout/billing', { ...payload, draftId });
      const draft = response.data?.data?.draft || null;
      set({ draft, isLoading: false, currentStep: 4 });
      return { success: true, draft };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update billing details';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  selectDeliveryRule: async (deliveryRuleId) => {
    set({ isLoading: true, error: null });
    try {
      const draftId = get().draft?._id;
      const response = await axiosInstance.post('/checkout/delivery-method', { draftId, deliveryRuleId });
      const draft = response.data?.data?.draft || null;
      set({ draft, isLoading: false, currentStep: 5 });
      return { success: true, draft };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to apply delivery method';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },

  preparePayment: async () => {
    set({ isLoading: true, error: null });
    try {
      const draftId = get().draft?._id;
      const response = await axiosInstance.post('/checkout/prepare-payment', { draftId });
      const draft = response.data?.data?.draft || null;
      set({ draft, isLoading: false });
      return { success: true, draft };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to validate checkout for payment';
      set({ isLoading: false, error: msg });
      return { success: false, error: msg };
    }
  },
}));
