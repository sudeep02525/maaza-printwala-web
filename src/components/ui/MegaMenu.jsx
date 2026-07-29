'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, Grid, ArrowRight, Layers, Sparkles, CheckCircle2 } from 'lucide-react';

export default function MegaMenu({ categories = [], isLoading = false }) {
  const [activeCategory, setActiveCategory] = useState(null);

  // Fallback commercial images for rich mega menu visual experience
  const getCategoryImage = (catName = '') => {
    const lower = catName.toLowerCase();
    if (lower.includes('card') || lower.includes('visiting')) {
      return 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('banner') || lower.includes('signage') || lower.includes('flex')) {
      return 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('apparel') || lower.includes('t-shirt') || lower.includes('cloth')) {
      return 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('box') || lower.includes('packag') || lower.includes('gift')) {
      return 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80';
    }
    if (lower.includes('brochure') || lower.includes('flyer') || lower.includes('book')) {
      return 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=400&q=80';
    }
    return 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=400&q=80';
  };

  if (isLoading) {
    return (
      <nav className="bg-[#F7F8FA] border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 h-12 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-[#F7F8FA] text-slate-800 text-xs font-semibold border-b border-slate-200 relative select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-12">
        {/* Category Items */}
        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar h-full py-1">
          <Link
            href="/products"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md hover:bg-white text-slate-700 hover:text-[#0082CA] font-bold transition-colors shrink-0 border border-transparent hover:border-slate-200 hover:shadow-2xs"
          >
            <Grid className="w-3.5 h-3.5 text-[#0082CA]" />
            <span>All Products</span>
          </Link>

          {categories.slice(0, 8).map((cat) => {
            const catImg = cat.image || getCategoryImage(cat.name);
            return (
              <div
                key={cat._id}
                className="relative h-full flex items-center shrink-0"
                onMouseEnter={() => setActiveCategory(cat._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/products?category=${cat.slug || cat._id}`}
                  className={`flex items-center gap-1 px-3 py-2 rounded-md transition-all font-semibold ${
                    activeCategory === cat._id
                      ? 'bg-white text-[#0082CA] border border-slate-200 shadow-2xs'
                      : 'text-slate-700 hover:bg-white/70 hover:text-slate-900'
                  }`}
                >
                  <span>{cat.name}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${activeCategory === cat._id ? 'rotate-180 text-[#0082CA]' : 'text-slate-400'}`} />
                </Link>

                {/* Rich Image-Enriched Dropdown Panel */}
                {activeCategory === cat._id && (
                  <div className="absolute top-full left-0 w-96 bg-white text-slate-900 rounded-b-lg shadow-xl border border-slate-200 p-4 z-megamenu animate-fade-in">
                    <div className="grid grid-cols-3 gap-3.5 pb-3 border-b border-slate-100 items-center">
                      {/* Thumbnail Image */}
                      <div className="col-span-1 aspect-4/3 rounded-md bg-slate-100 overflow-hidden relative border border-slate-200">
                        <img
                          src={catImg}
                          alt={cat.name}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          300 GSM+
                        </span>
                      </div>

                      {/* Info & Sub-specs */}
                      <div className="col-span-2 space-y-1">
                        <h4 className="font-bold text-slate-900 text-sm flex items-center justify-between">
                          <span>{cat.name}</span>
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            Pan-India
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-500 line-clamp-2 font-normal leading-tight">
                          {cat.description || 'Custom commercial print specification with instant server-calculated bulk pricing.'}
                        </p>
                      </div>
                    </div>

                    {/* Quick Config Pills / Sub-Links */}
                    <div className="py-2.5 border-b border-slate-100 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                        Popular Specifications
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {['Standard Art Card', 'Premium UV Coated', 'Spot UV & Embossed', 'Volume Packs', 'Eco-Friendly'].map((spec, idx) => (
                          <Link
                            key={idx}
                            href={`/products?category=${cat.slug || cat._id}&search=${encodeURIComponent(spec)}`}
                            onClick={() => setActiveCategory(null)}
                            className="text-[11px] px-2 py-1 rounded bg-slate-50 hover:bg-[#0082CA] text-slate-700 hover:text-white transition-colors border border-slate-200 hover:border-[#0082CA]"
                          >
                            {spec}
                          </Link>
                        ))}
                      </div>
                    </div>

                    <div className="pt-3">
                      <Link
                        href={`/products?category=${cat.slug || cat._id}`}
                        onClick={() => setActiveCategory(null)}
                        className="flex items-center justify-between px-3.5 py-2.5 rounded-md bg-[#0082CA] hover:bg-[#0068A2] text-white text-xs font-bold transition-colors shadow-xs group"
                      >
                        <span className="flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5" />
                          <span>Explore {cat.name} Catalogue</span>
                        </span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Feature Link */}
        <div className="hidden lg:flex items-center gap-2 text-xs font-bold text-slate-600 pl-4 border-l border-slate-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>GST Invoicing &amp; Volume Pricing</span>
        </div>
      </div>
    </nav>
  );
}
