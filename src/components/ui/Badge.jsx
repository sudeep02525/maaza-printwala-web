import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-bold tracking-wider uppercase rounded-full shrink-0 select-none';

  const variants = {
    default: 'bg-slate-100 text-slate-700 border border-slate-200',
    primary: 'bg-blue-50 text-[#0A58CA] border border-blue-200',
    accent: 'bg-pink-50 text-[#D63384] border border-pink-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
    neutral: 'bg-slate-900 text-white',
  };

  const sizes = {
    sm: 'text-[9px] px-2 py-0.5',
    md: 'text-[10px] px-2.5 py-1',
    lg: 'text-xs px-3 py-1.5',
  };

  return (
    <span className={cn(baseStyles, variants[variant], sizes[size], className)} {...props}>
      {children}
    </span>
  );
}
