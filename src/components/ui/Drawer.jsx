'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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

  const slideVariants = {
    closed: {
      x: side === 'left' ? '-100%' : '100%',
      transition: {
        type: 'spring',
        damping: 32,
        stiffness: 320,
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        damping: 32,
        stiffness: 320,
      },
    },
  };

  const backdropVariants = {
    closed: { opacity: 0, transition: { duration: 0.25, ease: 'easeInOut' } },
    open: { opacity: 1, transition: { duration: 0.25, ease: 'easeInOut' } },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          {/* Smooth animated backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Smooth animated drawer panel */}
          <motion.div
            variants={slideVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className={cn(
              'relative z-10 bg-[var(--bg-card)] text-[var(--text-main)] w-80 max-w-[85vw] h-full shadow-2xl flex flex-col',
              side === 'left' ? 'mr-auto border-r border-[var(--border)]' : 'ml-auto border-l border-[var(--border)]',
              className
            )}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] bg-[var(--bg-subtle)] shrink-0">
              <h3 className="text-base font-bold text-[var(--text-main)]">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-[var(--text-faint)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] rounded-lg transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
