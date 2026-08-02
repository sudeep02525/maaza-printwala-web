const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function fetchServerApi(endpoint, options = {}) {
  const { revalidate = 3600, tags = [], method = 'GET', body, ...rest } = options;

  try {
    const res = await fetch(`${BASE_URL}/api${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...rest.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
      next: {
        revalidate,
        tags,
      },
      ...rest,
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch API: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Server API Fetch Error:', error.message);
    throw error;
  }
}

// Helper methods with default revalidation times for MaazaPrintwala
export const serverApi = {
  // Categories: 1 day revalidate
  getCategories: () => fetchServerApi('/categories', { revalidate: 86400 }),
  
  // Featured products: 1 hour revalidate
  getFeaturedProducts: () => fetchServerApi('/products?featured=true', { revalidate: 3600 }),
  
  // Custom queries
  get: (endpoint, revalidate = 3600) => fetchServerApi(endpoint, { revalidate })
};
