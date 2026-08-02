import React from 'react';
import { cn } from '../../lib/utils.js';

export default function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-slate-200', className)}
      {...props}
    />
  );
}
