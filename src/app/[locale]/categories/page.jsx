import { Suspense } from 'react';
import CategoriesView from './CategoriesView.jsx';

export const metadata = {
  title: 'All Print Categories | Maza Printwala',
  description: 'Explore our complete directory of printing categories including Visiting Cards, Packaging, Stationery, Apparel, Signage, and Corporate Gifts.'
};

export default function CategoriesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--bg-subtle)] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-[#0082CA]/20 border-t-[#0082CA] rounded-full animate-spin"></div>
            <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">Loading Categories Directory...</p>
          </div>
        </div>
      }
    >
      <CategoriesView />
    </Suspense>
  );
}
