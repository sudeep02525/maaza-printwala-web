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
        <div className="max-w-[1560px] mx-auto px-5 flex items-center gap-6 h-12 animate-pulse">
          <div className="h-4 w-24 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
          <div className="h-4 w-28 bg-slate-200 rounded"></div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-slate-50 text-slate-800 text-sm border-t border-b border-slate-200/50 relative select-none">
      <div className="max-w-[1550px] mx-auto w-full px-4 md:px-8">
        {/* Category Items */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar h-14 w-full">
          <Link
            href="/products"
            className={`flex items-center h-full px-2 transition-colors shrink-0 ${
              activeCategory === 'view-all'
                ? 'text-slate-900 border-b-[3px] border-slate-900 font-bold'
                : 'text-slate-700 hover:text-slate-900 border-b-[3px] border-transparent hover:border-slate-800'
            }`}
            onMouseEnter={() => setActiveCategory('view-all')}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <span>View All</span>
          </Link>

          {categories.slice(0, 8).map((cat) => {
            const isHovered = activeCategory === cat._id;
            return (
              <div
                key={cat._id}
                className="h-full flex items-center shrink-0 group"
                onMouseEnter={() => setActiveCategory(cat._id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/category/${cat.slug || cat._id}`}
                  className={`flex items-center h-full px-2 transition-all ${
                    isHovered
                      ? 'text-slate-900 border-b-[3px] border-slate-900 font-bold'
                      : 'text-slate-700 hover:text-slate-900 border-b-[3px] border-transparent'
                  }`}
                >
                  <span className="whitespace-nowrap">{cat.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL WIDTH MEGA MENU DROP-DOWN PANEL */}
      {activeCategory && (
        <div 
          className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-200 z-[9998] animate-fade-in"
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          {(() => {
            const isViewAll = activeCategory === 'view-all';
            const cat = categories.find(c => c._id === activeCategory);
            
            if (!cat && !isViewAll) return null;
            
            if (isViewAll) {
              return (
                <div>
                  <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
                      {/* Column 1 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Business Essentials</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Visiting Cards</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Signs, Posters & Marketing</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Stationery, Letterheads</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Labels, Stickers & Packaging</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Stamps & Ink</Link></li>
                        </ul>
                      </div>
  
                      {/* Column 2 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Love your new look</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Clothing, Caps & Bags</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Custom Polo T-Shirts</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Printed T-Shirts</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Custom Office Shirts</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Bags</Link></li>
                        </ul>
                      </div>
  
                      {/* Column 3 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Made by You</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Photo Albums</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Personalised Pens</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Magnets</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Notebooks & Diaries</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Calendars</Link></li>
                        </ul>
                      </div>
  
                      {/* Column 4 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Home & Gifts</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Mugs, Albums & Gifts</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Drinkware</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Mugs</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Gift Hampers</Link></li>
                        </ul>
                      </div>
  
                      {/* Column 5 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Design & Logo</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Design Services</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Logo Maker</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">QR Code Generator</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Ideas and Advice</Link></li>
                        </ul>
                      </div>
  
                      {/* Column 6 */}
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-slate-600 mb-2">Looking for more?</h4>
                        <ul className="space-y-3">
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Technology</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Invitations & Announcements</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Awards & Plaques</Link></li>
                          <li><Link href="/products" className="text-slate-900 hover:underline text-[13px]">Face Masks</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // Specific Category Rendering
            return (
              <div>
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                  <div className="flex gap-12">
                    <div className="w-1/4">
                      <h4 className="text-lg font-bold text-slate-900 mb-4">{cat.name}</h4>
                      <p className="text-sm text-slate-500 mb-6">Explore our wide range of premium {cat.name.toLowerCase()} options tailored for your brand.</p>
                      <Link href={`/category/${cat.slug || cat._id}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#0082CA] hover:underline">
                        Shop All {cat.name} <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                    
                    <div className="w-1/4">
                      <h4 className="text-sm font-semibold text-slate-600 mb-3">Popular Options</h4>
                      <ul className="space-y-3">
                        <li><Link href={`/category/${cat.slug || cat._id}`} className="text-slate-900 hover:underline text-[13px]">Standard {cat.name}</Link></li>
                        <li><Link href={`/category/${cat.slug || cat._id}`} className="text-slate-900 hover:underline text-[13px]">Premium Quality {cat.name}</Link></li>
                        <li><Link href={`/category/${cat.slug || cat._id}`} className="text-slate-900 hover:underline text-[13px]">Eco-Friendly {cat.name}</Link></li>
                        <li><Link href={`/category/${cat.slug || cat._id}`} className="text-slate-900 hover:underline text-[13px]">Custom Printed {cat.name}</Link></li>
                        <li><Link href={`/category/${cat.slug || cat._id}`} className="text-slate-900 hover:underline text-[13px]">Bulk {cat.name} Orders</Link></li>
                      </ul>
                    </div>
  
                    <div className="w-1/2 rounded-xl overflow-hidden relative h-[220px]">
                      <img 
                        src={getCategoryImage(cat.name)} 
                        alt={cat.name} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-6 flex flex-col justify-end">
                        <h3 className="text-white font-bold text-2xl mb-1">{cat.name} Showcase</h3>
                        <p className="text-white/90 text-sm">Design exactly what you need.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </nav>
  );
}
