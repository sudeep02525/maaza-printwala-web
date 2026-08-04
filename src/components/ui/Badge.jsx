import React from 'react';
import { cn } from '@/lib/utils.js';

export default function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded shrink-0 select-none';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-slate-900 text-white',
    accent: 'bg-[#0082CA] text-white',
    success: 'bg-slate-100 text-slate-800 border border-slate-300',
    warning: 'bg-slate-100 text-slate-800 border border-slate-300',
    error: 'bg-slate-100 text-red-700 border border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5',
    md: 'text-xs px-2 py-0.5',
    lg: 'text-xs px-2.5 py-1',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}

