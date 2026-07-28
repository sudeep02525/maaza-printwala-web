import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl border border-slate-200 shadow-xs transition-all duration-200',
        hover && 'hover:shadow-md hover:border-slate-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
