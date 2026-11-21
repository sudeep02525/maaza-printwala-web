'use client';

import React, { useEffect, useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { 
  RotateCcw, Home, PackageSearch, 
  ChevronDown, MessageCircle, Copy, Check, 
  WifiOff, ArrowRight, ShieldCheck
} from 'lucide-react';

export default function ErrorPage({ error, reset }) {
  const [showDetails, setShowDetails] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    console.error('[Maaza Printwala Error Boundary]:', error);
    if (typeof window !== 'undefined') {
      setIsOnline(navigator.onLine);
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, [error]);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 400);
  };

  const copyErrorToClipboard = async () => {
    try {
      const errorText = `[Maaza Printwala Error Report]\nTimestamp: ${new Date().toISOString()}\nMessage: ${error?.message || 'Unknown Error'}\nStack: ${error?.stack || 'N/A'}`;
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(errorText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } catch (e) {
      console.warn('Could not copy error to clipboard:', e);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-main)] px-4 py-16 font-sans select-none">
      
      {/* Clean Minimal Card */}
      <div className="max-w-xl w-full bg-[var(--bg-card)] p-8 sm:p-12 rounded-2xl shadow-sm border border-[var(--border)] text-center transition-all">
        
        {/* Clean Logo Header */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo-maaza.png"
            alt="Maaza Printwala"
            className="h-10 w-auto object-contain dark:hidden"
          />
          <img
            src="/logo-maaza-dark.png"
            alt="Maaza Printwala"
            className="h-10 w-auto object-contain hidden dark:block"
          />
        </div>

        {/* Offline Detection Banner */}
        {!isOnline && (
          <div className="mb-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-200 text-xs font-semibold flex items-center justify-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-600 shrink-0" />
            <span>You appear to be offline. Please check your internet connection and retry.</span>
          </div>
        )}

        {/* Main Heading */}
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight mb-3">
          Unable to Load This Page
        </h1>
        
        {/* Explanatory Copy */}
        <p className="text-sm sm:text-base text-[var(--text-muted)] mb-8 font-normal leading-relaxed max-w-md mx-auto">
          We encountered an issue while communicating with our server. 
          Your cart items and saved data are completely safe.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-8">
          <button 
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto px-6 py-3 bg-[#0082CA] hover:bg-[#006EA8] text-white font-bold text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
          >
            <RotateCcw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
            <span>{isRetrying ? 'Retrying...' : 'Try Again'}</span>
          </button>

          <Link 
            href="/products" 
            className="w-full sm:w-auto px-6 py-3 bg-[var(--bg-subtle)] hover:bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)] font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <PackageSearch className="w-4 h-4 text-[#0082CA]" />
            <span>Explore Catalogue</span>
          </Link>

          <Link 
            href="/" 
            className="w-full sm:w-auto px-5 py-3 text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Link>
        </div>

        {/* Quick Navigation to Categories */}
        <div className="pt-6 border-t border-[var(--border)]">
          <p className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-wider mb-3">
            Popular Categories
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { label: 'Visiting Cards', href: '/visiting-cards' },
              { label: 'Custom Apparel', href: '/custom-apparel' },
              { label: 'Packaging Boxes', href: '/packaging' },
              { label: 'Flyers & Brochures', href: '/flyers-brochures' },
              { label: 'Labels & Stickers', href: '/labels-stickers' },
            ].map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[var(--bg-subtle)] hover:bg-[#0082CA]/10 hover:text-[#0082CA] border border-[var(--border)] transition-colors flex items-center gap-1"
              >
                <span>{cat.label}</span>
                <ArrowRight className="w-3 h-3 text-[var(--text-faint)]" />
              </Link>
            ))}
          </div>
        </div>

        {/* Collapsible Technical Diagnostics */}
        {error && (
          <div className="mt-6 pt-5 border-t border-[var(--border)] text-left">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors cursor-pointer py-1"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>Technical Diagnostics</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`} />
              </button>

              {showDetails && (
                <button
                  onClick={copyErrorToClipboard}
                  className="text-[11px] font-bold text-[#0082CA] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-600">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Details</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {showDetails && (
              <div className="mt-3 p-3 bg-black/5 dark:bg-black/50 border border-[var(--border)] rounded-xl text-xs font-mono overflow-x-auto leading-relaxed">
                <div className="text-rose-500 font-bold mb-1">
                  {error.name || 'Error'}: {error.message || String(error)}
                </div>
                {error.digest && (
                  <div className="text-slate-400 text-[11px]">
                    Digest: {error.digest}
                  </div>
                )}
                {error.stack && (
                  <pre className="text-[10px] text-slate-500 whitespace-pre-wrap mt-2 pt-2 border-t border-[var(--border)] max-h-32 overflow-y-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            )}
          </div>
        )}

        {/* WhatsApp & Support */}
        <div className="mt-8 pt-4 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Support: imagemazaprintwala@gmail.com</span>
          </div>
          <a
            href="https://wa.me/917700054984?text=Hello%20Maza%20Printwala%20Team%2C%20I%20faced%20an%20issue%20loading%20the%20website."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-500/20 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp (+91 7700054984)</span>
          </a>
        </div>

      </div>
    </div>
  );
}
