import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfiguratorStore = create(
  persist(
    (set) => ({
      activeProductSlug: null,
      activeProductId: null,
      configuration: {},
      quantity: 100,
      priceResult: null, // Authoritative server price snapshot
      isValid: false,
      designReadyState: null, // { type: 'UPLOAD' | 'TEMPLATE', payload: {...} }

      setProductContext: (slug, id, defaultQty = 100, defaultConfig = {}) =>
        set((state) => {
          if (state.activeProductId === id) return state; // Preserve if same product
          return {
            activeProductSlug: slug,
            activeProductId: id,
            configuration: defaultConfig,
            quantity: defaultQty,
            priceResult: null,
            isValid: false,
            designReadyState: null,
          };
        }),

      updateConfiguration: (key, val) =>
        set((state) => ({
          configuration: { ...state.configuration, [key]: val },
          designReadyState: null, // Reset ready state on config change
        })),

      updateQuantity: (qty) =>
        set(() => ({
          quantity: qty,
          designReadyState: null,
        })),

      setServerPriceResult: (priceResult, isValid = true) =>
        set(() => ({
          priceResult,
          isValid,
        })),

      setDesignReady: (type, payload) =>
        set(() => ({
          designReadyState: {
            type,
            payload,
            completedAt: new Date().toISOString(),
          },
        })),

      resetConfigurator: () =>
        set(() => ({
          activeProductSlug: null,
          activeProductId: null,
          configuration: {},
          quantity: 100,
          priceResult: null,
          isValid: false,
          designReadyState: null,
        })),
    }),
    {
      name: 'maaza_configurator_state',
      getStorage: () => (typeof window !== 'undefined' ? sessionStorage : null),
    }
  )
);
