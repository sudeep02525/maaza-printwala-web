'use client';

import React, { Suspense, use } from 'react';
import { ProductDetailContent } from '../../products/[slug]/page.jsx';

export default function SubcategoryPage({ params }) {
  const unwrappedParams = use(params);
  
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0082CA]/20 border-t-[#0082CA] rounded-full animate-spin"></div>
      </div>
    }>
      <ProductDetailContent 
        slug={unwrappedParams.subSlug} 
        fallbackCategorySlug={unwrappedParams.slug} 
      />
    </Suspense>
  );
}
