/**
 * TemplateEngine
 * Responsible for searching, loading, and structuring Template Metadata.
 */
class TemplateEngine {
    constructor() {
      // Future: Load from API
      this.mockTemplates = [
        {
          id: '1',
          name: 'Minimal Professional',
          category: 'business-card',
          canvasJson: {} // Fabric json goes here
        }
      ];
    }
  
    async loadTemplates(category) {
      // Mock filtering by category
      return this.mockTemplates.filter(t => t.category === category);
    }
  
    async getTemplateById(id) {
      return this.mockTemplates.find(t => t.id === id);
    }
  }
  
  export const templateEngine = new TemplateEngine();
  
