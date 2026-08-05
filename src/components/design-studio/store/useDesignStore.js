import { create } from 'zustand';

export const useDesignStore = create((set) => ({
  activeElementId: null,
  zoomLevel: 100,
  productConfig: null,
  templateData: null,
  isDirty: false,
  canvasReady: false,

  setActiveElement: (id) => set({ activeElementId: id }),
  setZoom: (zoom) => set({ zoomLevel: zoom }),
  setProductConfig: (config) => set({ productConfig: config }),
  setTemplateData: (data) => set({ templateData: data }),
  setCanvasReady: (ready) => set({ canvasReady: ready }),
  markDirty: () => set({ isDirty: true }),
  clearDirty: () => set({ isDirty: false }),
}));
