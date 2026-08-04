import React from 'react';
import { Link } from '@/i18n/routing.js';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function Breadcrumbs({ items, className }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs font-semibold text-slate-500 space-x-1.5 overflow-x-auto py-1', className)}>
      <Link href="/" className="hover:text-slate-900 flex items-center gap-1 shrink-0 transition-colors">
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="hover:text-slate-900 shrink-0 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-900 font-bold truncate max-w-[200px] sm:max-w-xs">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
