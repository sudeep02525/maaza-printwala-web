import { Suspense, use } from 'react';
import { ProductDetailContent } from './ProductView.jsx';

export async function generateMetadata({ params }) {
  const unwrappedParams = await params;
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/products/${unwrappedParams.slug}`, {
      next: { revalidate: 3600 }
    });
    const data = await res.json();
    const product = data?.data?.product;
    
    if (product) {
      return {
        title: product.metaTitle || `${product.name} | Maza Printwala`,
        description: product.metaDescription || product.shortDescription || `Buy ${product.name} at Maza Printwala`,
        keywords: product.keywords || product.name
      };
    }
  } catch (e) {
    console.error('Metadata fetch error', e);
  }
  
  return {
    title: 'Product | Maza Printwala',
    description: 'Buy premium printed products'
  };
}

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0082CA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading product specifications...</p>
      </div>
    }>
      <ProductDetailContent slug={unwrappedParams.slug} />
    </Suspense>
  );
}
