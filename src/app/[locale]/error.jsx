'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { 
  AlertTriangle, RotateCcw, Home, PackageSearch, 
  ChevronDown, Headphones, ArrowRight, ShieldAlert 
} from 'lucide-react';

export default function ErrorPage({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error('Application Error Boundary caught error:', error);
  }, [error]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-main)] px-4 py-12 relative overflow-hidden font-sans">
      
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#0082CA]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-xl w-full bg-[var(--bg-card)]/90 backdrop-blur-xl p-8 sm:p-12 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-[var(--border)] text-center relative z-10 transition-all">
        
        {/* Animated Badge Icon */}
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-orange-500/15 border border-amber-500/25 flex items-center justify-center text-amber-500 mx-auto shadow-sm mb-6">
          <AlertTriangle className="w-10 h-10 text-amber-500 animate-pulse" />
        </div>

        <span className="inline-block text-[11px] font-extrabold uppercase tracking-widest text-[#0082CA] bg-[#0082CA]/10 border border-[#0082CA]/20 px-3 py-1 rounded-full mb-3">
          Printing Snag Detected
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight mb-3">
          Something Unexpected Happened
        </h1>
        
        <p className="text-sm sm:text-base text-[var(--text-muted)] mb-8 font-medium leading-relaxed max-w-md mx-auto">
          We encountered an issue while loading this page. Our automated diagnostic system has logged the details so we can fix it.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <button 
            onClick={() => reset()} 
            className="w-full sm:w-auto px-6 py-3 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-xl transition-all shadow-md shadow-[#0082CA]/25 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link 
            href="/products" 
            className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)] font-bold rounded-xl transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
          >
            <PackageSearch className="w-4 h-4 text-[#0082CA]" />
            <span>Explore Catalogue</span>
          </Link>

          <Link 
            href="/" 
            className="w-full sm:w-auto px-5 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Popular Quick Links */}
        <div className="pt-6 border-t border-[var(--border)]">
          <p className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Visiting Cards', href: '/visiting-cards' },
              { label: 'Custom Apparel', href: '/custom-apparel' },
              { label: 'Signage & Banners', href: '/signage-banners' },
              { label: 'Packaging', href: '/packaging' },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[#0082CA]/10 hover:text-[#0082CA] border border-[var(--border)] transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Technical Diagnostics (Collapsible) */}
        {error?.message && (
          <div className="mt-6 pt-4 border-t border-[var(--border)] text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-between w-full transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                Technical Diagnostics
              </span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetails ? 'rotate-180' : ''}`} />
            </button>
            {showDetails && (
              <pre className="mt-3 p-3 bg-black/5 dark:bg-black/50 border border-[var(--border)] rounded-lg text-[11px] font-mono text-rose-500 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {error.message || String(error)}
              </pre>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
