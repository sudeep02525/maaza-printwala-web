/**
 * TemplateEngine
 * Responsible for searching, loading, and structuring Template Metadata.
 */
import axiosInstance from '@/services/axiosInstance.js';

class TemplateEngine {
  async loadTemplates(category) {
    try {
      const res = await axiosInstance.get(`/templates/product/${category}`);
      return res.data?.data?.templates || res.data?.templates || [];
    } catch (error) {
      console.error('Failed to load templates:', error);
      return [];
    }
  }

  async getTemplateById(id) {
    try {
      const res = await axiosInstance.get(`/templates/${id}`);
      return res.data?.data?.template || res.data?.template || null;
    } catch (error) {
      console.error('Failed to fetch template by ID:', error);
      return null;
    }
  }
}
  
  export const templateEngine = new TemplateEngine();
  
