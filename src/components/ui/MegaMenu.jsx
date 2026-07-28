'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Grid, ArrowRight, Sparkles, Folder } from 'lucide-react';

export default function MegaMenu({ categories = [], isLoading = false }) {
  const [activeCategory, setActiveCategory] = useState(null);

  if (isLoading) {
    return (
      <nav className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-12 animate-pulse">
          <div className="h-4 w-24 bg-slate-800 rounded"></div>
          <div className="h-4 w-28 bg-slate-800 rounded"></div>
          <div className="h-4 w-32 bg-slate-800 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-900 text-white text-sm font-semibold border-b border-slate-800 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        {/* Category Items */}
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar h-full py-1">
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white transition-colors shrink-0"
          >
            <Grid className="w-4 h-4 text-pink-500" />
            <span>All Products</span>
          </Link>

          {categories.slice(0, 6).map((cat) => (
            <div
              key={cat._id}
              className="relative h-full flex items-center shrink-0"
              onMouseEnter={() => setActiveCategory(cat._id)}
              onMouseLeave={() => setActiveCategory(null)}
            >
              <Link
                href={`/products?category=${cat.slug || cat._id}`}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors text-slate-200 hover:text-white ${
                  activeCategory === cat._id ? 'bg-slate-800 text-white' : 'hover:bg-slate-800/60'
                }`}
              >
                <span>{cat.name}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${activeCategory === cat._id ? 'rotate-180 text-pink-400' : 'text-slate-400'}`} />
              </Link>

              {/* Dropdown Panel */}
              {activeCategory === cat._id && (
                <div className="absolute top-full left-0 w-72 bg-white text-slate-900 rounded-b-xl shadow-xl border border-slate-200 p-4 z-50 animate-fade-in">
                  <div className="flex items-start gap-3 pb-3 border-b border-slate-100">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0A58CA] flex items-center justify-center font-bold text-lg shrink-0">
                      {cat.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{cat.name}</h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5 font-normal">
                        {cat.description || 'Custom printing and personalization for professional business requirements.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 space-y-1">
                    <Link
                      href={`/products?category=${cat.slug || cat._id}`}
                      onClick={() => setActiveCategory(null)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-[#0A58CA] text-slate-800 hover:text-white text-xs font-bold transition-all group"
                    >
                      <span>Browse {cat.name} Catalogue</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Feature Link */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-300 pl-4 border-l border-slate-800">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Schema-Driven Custom Print Specs</span>
        </div>
      </div>
    </nav>
  );
}
