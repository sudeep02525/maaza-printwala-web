import React from 'react';
import { cn } from '@/lib/utils.js';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-[var(--bg-card)] rounded-lg border border-[var(--border)] transition-colors duration-150',
        hover && 'hover:border-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

