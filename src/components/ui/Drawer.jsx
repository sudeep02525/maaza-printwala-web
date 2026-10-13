'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function Drawer({ isOpen, onClose, title, children, side = 'left', className }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={cn(
          'bg-[var(--bg-card)] text-[var(--text-main)] w-80 max-w-[85vw] h-full shadow-2xl flex flex-col transition-transform duration-300',
          side === 'left' ? 'mr-auto border-r border-[var(--border)]' : 'ml-auto border-l border-[var(--border)]',
          className
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-subtle)]">
          <h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--text-faint)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}
