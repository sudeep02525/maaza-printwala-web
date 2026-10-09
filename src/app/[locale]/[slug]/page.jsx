import { Suspense, use } from 'react';
import PageSkeleton from '@/components/ui/PageSkeleton.jsx';
import { CategoryContent } from './CategoryView.jsx';

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories/${unwrappedParams.slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const category = data?.category;
    
    if (category) {
      return {
        title: category.metaTitle || `${category.name} | Maza Printwala`,
        description: category.metaDescription || category.description || `Explore ${category.name} at Maza Printwala`
      };
    }
  } catch (e) {
    console.error('Metadata fetch error', e);
  }
  
  return {
    title: 'Category | Maza Printwala',
    description: 'Explore premium printed products'
  };
}

export default function CategoryPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryContent key={unwrappedParams?.slug} />
    </Suspense>
  );
}
