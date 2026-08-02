'use client';

import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  type = 'button',
  onClick,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer';

  const variants = {
    primary: 'bg-[#0082CA] text-white hover:bg-[#0068A2] focus:ring-[#0082CA] shadow-xs',
    secondary: 'bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-900 shadow-xs',
    outline: 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-[#0082CA]',
    ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 focus:ring-slate-400',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-600 shadow-xs',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5 min-h-[36px]',
    md: 'text-sm px-5 py-2.5 rounded-lg gap-2 min-h-[44px]',
    lg: 'text-base px-6 py-3.5 rounded-lg gap-2.5 min-h-[50px]',
  };

  return (
    <button
      type={type}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin shrink-0" />
      )}
      {children}
    </button>
  );
}
