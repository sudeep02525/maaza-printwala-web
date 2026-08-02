import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function Alert({ title, children, variant = 'info', className, icon }) {
  const variants = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-red-50 border-red-200 text-red-900',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
  };

  return (
    <div className={cn('p-4 rounded-lg border flex items-start gap-3 shadow-xs', variants[variant], className)}>
      {icon !== false && (icon || icons[variant])}
      <div className="flex-1 text-xs md:text-sm">
        {title && <h4 className="font-bold mb-1">{title}</h4>}
        <div className="leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
