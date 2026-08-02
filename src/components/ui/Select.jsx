import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Select({ label, error, helperText, options = [], className, id, children, ...props }) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1 w-full">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-bold text-slate-700 uppercase tracking-wider select-none">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'w-full px-3.5 py-2.5 bg-white border rounded-lg text-sm text-slate-900 transition-all duration-150 cursor-pointer',
          'focus:outline-none focus:ring-2 focus:ring-[#0082CA]/20 focus:border-[#0082CA]',
          'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
          error ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-300',
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
      {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
    </div>
  );
}
