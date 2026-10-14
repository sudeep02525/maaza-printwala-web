'use client';

import React from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing.js';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export function AuthHeader() {
  return (
    <header className="w-full bg-[var(--bg-card)] backdrop-blur-md border-b border-[var(--border)] py-3.5 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2 group" aria-label="Maza Printwala Home">
        <Image
          src="/logo-maaza.png"
          alt="Maza Printwala"
          width={130}
          height={32}
          priority
          className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102 dark:hidden"
        />
        <Image
          src="/logo-maaza-dark.png"
          alt="Maza Printwala"
          width={130}
          height={32}
          priority
          className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-102 hidden dark:block"
        />
      </Link>
      
      <div className="flex items-center gap-4 text-xs font-bold text-[var(--text-muted)]">
        <Link
          href="/support"
          className="hidden sm:flex items-center gap-1.5 hover:text-[#0082CA] transition-colors"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          <span>Need Help?</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 py-1.5 px-3 rounded-lg bg-[var(--hover)] hover:bg-[var(--border)] text-[var(--text-main)] transition-colors"
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
    <footer className="w-full py-6 px-4 border-t border-[var(--border)] bg-[var(--bg-card)] text-center text-xs text-[var(--text-muted)]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>&copy; {new Date().getFullYear()} Maza Printwala. All rights reserved.</p>
        <div className="flex items-center gap-4 font-semibold text-[var(--text-muted)]">
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
