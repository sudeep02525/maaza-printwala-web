const fs = require('fs');

// 1. Rewrite SubcategoryPage to just act as a Product Page
const subcategoryPagePath = 'c:/maaza-printwala/maaza-printwala-web/src/app/[locale]/[slug]/[subSlug]/page.jsx';
const subcategoryContent = `'use client';

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
`;
fs.writeFileSync(subcategoryPagePath, subcategoryContent);

// 2. Update ProductCard.jsx links
const productCardPath = 'c:/maaza-printwala/maaza-printwala-web/src/components/products/ProductCard.jsx';
let productCardContent = fs.readFileSync(productCardPath, 'utf-8');

// The category slug could be available at product.category.slug or product.category (if populated as string)
// If not available, fallback to 'products'
const linkRegex1 = /href=\{\`\/products\/\$\{id\}\`\}/g;
productCardContent = productCardContent.replace(
  linkRegex1, 
  "href={`/${product.category?.slug || 'products'}/${id}`}"
);

fs.writeFileSync(productCardPath, productCardContent);

console.log('Routing updated successfully!');
