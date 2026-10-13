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
    default: 'bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)]',
    primary: 'bg-[var(--text-main)] text-[var(--bg-card)]',
    accent: 'bg-[#0082CA] text-white',
    success: 'bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border-strong)]',
    warning: 'bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border-strong)]',
    error: 'bg-[var(--hover)] text-red-700 border border-red-200',
    neutral: 'bg-[var(--hover)] text-[var(--text-main)] border border-[var(--border)]',
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

