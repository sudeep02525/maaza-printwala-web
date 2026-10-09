import React, { Suspense, use } from 'react';
import { CategoryContent } from '../CategoryView.jsx';
import PageSkeleton from '@/components/ui/PageSkeleton.jsx';

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/categories/${unwrappedParams.slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const category = data?.category;
    
    // Attempt to find subcategory name if possible
    let subName = unwrappedParams.subSlug;
    if (category?.subcategoryGroups) {
      for (const group of category.subcategoryGroups) {
        const found = group.items?.find(item => item.slug === unwrappedParams.subSlug);
        if (found) {
          subName = found.name;
          break;
        }
      }
    }
    
    if (category) {
      return {
        title: `${subName} | ${category.name} | Maza Printwala`,
        description: `Explore ${subName} in ${category.name} at Maza Printwala`
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

export default function SubcategoryPage({ params }) {
  const unwrappedParams = use(params);
  
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryContent 
        subSlug={unwrappedParams.subSlug} 
        key={unwrappedParams.subSlug}
      />
    </Suspense>
  );
}
