import React from 'react';
import { cn } from '@/lib/utils.js';

export default function Select({ label, error, helperText, options = [], className, id, children, ...props }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-[var(--text-main)] uppercase tracking-wider select-none">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-3.5 py-2.5 bg-[var(--bg-card)] border rounded-lg text-sm text-[var(--text-main)] transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#0082CA]/20 focus:border-[#0082CA]',
          'disabled:bg-[var(--bg-subtle)] disabled:text-[var(--text-muted)] disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-[var(--border-strong)]',
          className
        )}
        {...props}
      >
        {children ? (
          children
        ) : (
          options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label || opt.value}
            </option>
          ))
        )}
      </select>
      {error && <p className="text-xs font-semibold text-red-600 mt-1">{error}</p>}
      {helperText && !error && <p className="text-xs text-[var(--text-muted)] mt-1">{helperText}</p>}
    </div>
  );
}
