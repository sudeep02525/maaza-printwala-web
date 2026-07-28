import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from './Button.jsx';

export default function Pagination({ currentPage = 1, totalPages = 1, onPageChange, className }) {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-2 py-4 ${className || ''}`}>
      <Button
        variant="outline"
        size="sm"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Prev</span>
      </Button>

      <span className="text-xs font-bold text-slate-700 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200">
        Page {currentPage} of {totalPages}
      </span>

      <Button
        variant="outline"
        size="sm"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span>Next</span>
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
