'use client';

import React, { Suspense, use } from 'react';
import { CategoryContent } from '../page.jsx';
import PageSkeleton from '@/components/ui/PageSkeleton.jsx';

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
