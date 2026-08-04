import { categoryData } from '@/config/categoryData.js';

export default function sitemap() {
  const baseUrl = 'https://maazaprintwala.in';
  
  // Create language alternates helper
  const getAlternates = (path) => ({
    languages: {
      en: `${baseUrl}${path}`,
      hi: `${baseUrl}/hi${path}`,
      mr: `${baseUrl}/mr${path}`
    }
  });

  // Base routes
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
      alternates: getAlternates('')
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
      alternates: getAlternates("/category/all")
    }
  ];

  // Category Routes
  Object.values(categoryData).forEach((cat) => {
    routes.push({
      url: `${baseUrl}/category/${cat.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      alternates: getAlternates(`/category/${cat.slug}`)
    });

    // Subcategory Routes
    if (cat.subcategories) {
      cat.subcategories.forEach((sub) => {
        routes.push({
          url: `${baseUrl}/category/${cat.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: getAlternates(`/category/${cat.slug}/${sub.slug}`)
        });
      });
    }
  });

  return routes;
}
