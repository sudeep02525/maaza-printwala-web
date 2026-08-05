/**
 * ProductConfigurationEngine
 * Centralizes all product specifications and overrides to configure the canvas correctly.
 */
class ProductConfigurationEngine {
    constructor() {
      // Future: load from API
      this.configs = {
        'premium-matte-visiting-card-30': {
          type: 'business-card',
          width: 1050, // 3.5 inches at 300 DPI
          height: 600, // 2.0 inches at 300 DPI
          safeAreaMargin: 37, // 0.125 inches
          bleedMargin: 37, // 0.125 inches
          minDpi: 300,
          defaultOrientation: 'landscape'
        },
        // add more
      };
    }
  
    async getProductConfiguration(slug) {
      // Simulating API fetch
      return this.configs[slug] || this.configs['premium-matte-visiting-card-30'];
    }
  }
  
  export const productConfigEngine = new ProductConfigurationEngine();
  
