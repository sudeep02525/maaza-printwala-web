'use client';
import { useEffect } from 'react';
import { Link } from '@/i18n/routing.js';

export default function ErrorPage({ error, reset }) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFCFF] text-slate-800 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
        <h1 className="text-3xl font-black text-rose-600 mb-4">Oops! Something went wrong.</h1>
        <p className="text-slate-500 mb-8 font-medium">We encountered an unexpected error while loading this page. Our team has been notified.</p>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => reset()} 
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
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
