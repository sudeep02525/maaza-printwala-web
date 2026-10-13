'use client';

import React from 'react';
import { Link } from '@/i18n/routing.js';

export default function CategoryNav({ categories = [], currentCategorySlug = null }) {
  return (
    <div className="relative z-40 mb-10 w-full">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 w-full mask-edges">
        <Link
          href="/products"
          className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-bold shrink-0 shadow-sm ${
            !currentCategorySlug
              ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/30 scale-105'
              : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] hover:shadow-md border border-[var(--border)]'
          }`}
        >
          <span className="whitespace-nowrap">All Products</span>
        </Link>

        {categories.map((cat) => {
          const isSelected = currentCategorySlug === cat.slug;
          return (
            <Link
              key={cat._id}
              href={`/${cat.slug}`}
              className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-bold shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/30 scale-105'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] hover:shadow-md border border-[var(--border)]'
              }`}
            >
              <span className="whitespace-nowrap">{cat.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
