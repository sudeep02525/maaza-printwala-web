'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/routing.js';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-subtle)] text-[var(--text-main)] p-4">
      <div className="max-w-md w-full bg-[var(--bg-card)] p-8 rounded-2xl shadow-sm border border-[var(--border)] text-center">
        <h1 className="text-3xl font-black text-rose-600 mb-4">Oops! Something went wrong.</h1>
        <p className="text-[var(--text-muted)] mb-8 font-medium">We encountered an unexpected error while loading this page. Our team has been notified.</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => reset()} 
            className="px-6 py-2.5 bg-[var(--hover)] hover:bg-[var(--border)] text-[var(--text-main)] font-bold rounded-lg transition-colors"
          >
            Try Again
          </button>
          <Link 
            href="/" 
            className="px-6 py-2.5 bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
