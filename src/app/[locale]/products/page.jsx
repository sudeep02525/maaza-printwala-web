import { Suspense } from 'react';
import { CatalogueContent } from './ProductsView.jsx';

export const metadata = {
  title: 'All Products | Maza Printwala',
  description: 'Explore our complete catalogue of premium printed products. From business cards to large format printing, we have you covered.'
};

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0082CA]/20 border-t-[#0082CA] rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preparing Enterprise Catalogue...</p>
        </div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
