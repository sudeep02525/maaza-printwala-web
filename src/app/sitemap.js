import { serverApi } from '@/lib/server-api.js';

export default async function sitemap() {
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
      alternates: getAlternates("/all")
    }
  ];

  try {
    const res = await serverApi.getCategories();
    const categories = res?.data?.categories || [];

    // Category Routes
    categories.forEach((cat) => {
      routes.push({
        url: `${baseUrl}/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
        alternates: getAlternates(`/${cat.slug}`)
      });

      // Subcategory Routes
      const allSubs = cat.subcategoryGroups?.flatMap(g => g.items) || [];
      allSubs.forEach((sub) => {
        routes.push({
          url: `${baseUrl}/${cat.slug}/${sub.slug}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: getAlternates(`/${cat.slug}/${sub.slug}`)
        });
      });
    });
  } catch (error) {
    console.error('Failed to fetch categories for sitemap:', error);
  }

  return routes;
}
