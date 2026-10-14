import React from 'react';
import { Link } from '@/i18n/routing.js';
import { Compass, PackageSearch, Home, ArrowRight, HelpCircle } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-main)] px-4 py-16 relative overflow-hidden font-sans">
      
      {/* Decorative Blur Spheres */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#0082CA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl w-full bg-[var(--bg-card)]/90 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--border)] text-center relative z-10">
        
        {/* Large Gradient 404 Number */}
        <div className="relative inline-block mb-2">
          <span className="text-8xl sm:text-9xl font-black bg-gradient-to-br from-[#0082CA] via-[#00A3FF] to-indigo-600 bg-clip-text text-transparent tracking-tighter select-none">
            404
          </span>
          <div className="absolute -bottom-2 right-2 w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Compass className="w-5 h-5 animate-spin" style={{ animationDuration: '10s' }} />
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight mb-3">
          Page Not Found or Moved
        </h1>
        
        <p className="text-sm sm:text-base text-[var(--text-muted)] mb-8 font-medium leading-relaxed max-w-md mx-auto">
          The page or product link you followed doesn't exist, has been updated, or is temporarily unavailable. Let's get you back on track!
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <Link 
            href="/products" 
            className="w-full sm:w-auto px-6 py-3 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-xl transition-all shadow-md shadow-[#0082CA]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PackageSearch className="w-4 h-4" />
            <span>Browse All Products</span>
          </Link>

          <Link 
            href="/" 
            className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-4 h-4 text-[var(--text-muted)]" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Popular Categories */}
        <div className="pt-6 border-t border-[var(--border)]">
          <p className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mb-3">
            Explore Popular Printing
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Visiting Cards', href: '/visiting-cards' },
              { label: 'Custom Apparel', href: '/custom-apparel' },
              { label: 'Signage & Banners', href: '/signage-banners' },
              { label: 'Packaging Boxes', href: '/packaging' },
              { label: 'Labels & Stickers', href: '/labels-stickers' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[#0082CA]/10 hover:text-[#0082CA] border border-[var(--border)] transition-colors flex items-center gap-1"
              >
                <span>{cat.label}</span>
                <ArrowRight className="w-3 h-3 text-[var(--text-faint)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Assistance hotline footer */}
        <div className="mt-8 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex items-center justify-center gap-2 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-[#0082CA]" />
          <span>Need help with an active order? Visit our <Link href="/support" className="text-[#0082CA] font-bold hover:underline">Help & Support</Link> center.</span>
        </div>

      </div>
    </div>
  );
}
