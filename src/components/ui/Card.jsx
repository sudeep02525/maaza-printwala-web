import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg border border-slate-200 transition-colors duration-150',
        hover && 'hover:border-slate-400',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

