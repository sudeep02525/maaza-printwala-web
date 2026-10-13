'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing.js';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export function AuthHeader() {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-slate-100 py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2 group" aria-label="Maza Printwala Home">
        <Image
          src="/logo-maaza.png"
          alt="Maza Printwala"
          width={130}
          height={32}
          priority
          className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102"
        />
      </Link>
      
      <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
        <Link
          href="/support"
          className="hidden sm:flex items-center gap-1.5 hover:text-[#0082CA] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Need Help?</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Store</span>
        </Link>
      </div>
    </header>
  );
}

export function AuthFooter() {
  return (
    <footer className="w-full py-6 px-4 border-t border-slate-100 bg-white text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Maza Printwala. All rights reserved.</p>
        <div className="flex items-center gap-4 font-semibold text-slate-600">
          <Link href="/privacy" className="hover:text-[#0082CA] transition-colors">
            Privacy Policy
          </Link>
          <span>&bull;</span>
          <Link href="/terms" className="hover:text-[#0082CA] transition-colors">
            Terms of Service
          </Link>
          <span>&bull;</span>
          <Link href="/support" className="hover:text-[#0082CA] transition-colors">
            Support & FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
}
