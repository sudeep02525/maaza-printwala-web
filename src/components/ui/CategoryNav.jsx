'use client';

import React from 'react';
import Link from 'next/link';

export default function CategoryNav({ categories = [], currentCategorySlug = null }) {
  return (
    <div className="relative z-40 mb-10 w-full">
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2 px-1 w-full mask-edges">
        <Link
          href="/category/all"
          className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-bold shrink-0 shadow-sm ${
            !currentCategorySlug
              ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/30 scale-105'
              : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md border border-slate-200'
          }`}
        >
          <span className="whitespace-nowrap">All Products</span>
        </Link>

        {categories.map((cat) => {
          const isSelected = currentCategorySlug === cat.slug;
          return (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className={`flex items-center px-5 py-2.5 rounded-full transition-all duration-300 text-sm font-bold shrink-0 shadow-sm ${
                isSelected
                  ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/30 scale-105'
                  : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:shadow-md border border-slate-200'
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
