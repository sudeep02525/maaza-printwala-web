'use client';

import React from 'react';
import Link from 'next/link';
import { Package, Star, Info, PenTool, UploadCloud } from 'lucide-react';

export default function ProductCard({ product }) {
  if (!product) return null;

  const id = product.slug || product._id;
  const name = product.name || 'Custom Print Product';
  const categoryName = product.category?.name || 'printvenue';
  
  // Pricing logic
  const currentPrice = product.basePrice || 499;
  const oldPrice = Math.round(currentPrice * 1.5);
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  
  const image = product.images?.[0]?.url || product.images?.[0];

  // Mock colors resembling the target image
  const colors = ['#f4f169', '#242a3a', '#c2272d', '#134e35', '#1a1a1a', '#e3e4e5'];
  const displayColors = colors.slice(0, 6);
  const hasMoreColors = colors.length > 6;

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 h-full border border-slate-100"
    >
      {/* Image Container */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        {/* Sleek Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-rose-500 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
              Sale {discountPercent}%
            </span>
          )}
          {product.isFeatured && (
             <span className="bg-slate-900 text-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-sm">
               Hot
             </span>
          )}
        </div>

        {/* Quick Actions (Hover Slide-in) */}
        <div className="absolute bottom-4 left-0 w-full px-4 flex justify-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
          <button className="flex-1 bg-white/90 backdrop-blur-sm hover:bg-[#0082CA] hover:text-white text-slate-900 shadow-md rounded-full py-2.5 flex items-center justify-center gap-2 font-semibold text-sm transition-colors">
            <PenTool className="w-4 h-4" /> Customize
          </button>
          <button className="w-10 h-10 shrink-0 bg-white/90 backdrop-blur-sm hover:bg-[#0082CA] hover:text-white text-slate-900 shadow-md rounded-full flex items-center justify-center transition-colors" title="Upload Design">
            <UploadCloud className="w-4 h-4" />
          </button>
        </div>

        <Link href={`/products/${id}`} className="block w-full h-full">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <Package className="w-10 h-10 mb-2 stroke-1" />
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col text-left flex-1 p-5">
        {/* Brand */}
        <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">
          {product.brand || categoryName || 'printvenue'}
        </span>

        {/* Product Name */}
        <Link href={`/products/${id}`}>
          <h3 className="font-bold text-base text-slate-800 leading-snug mb-2 hover:text-[#0082CA] transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>

        {/* Rating (Simplified) */}
        <div className="flex items-center gap-1.5 mb-3">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span className="text-sm font-bold text-slate-700">4.8</span>
          <span className="text-xs text-slate-400 ml-1">(124)</span>
        </div>

        {/* Price Row */}
        <div className="flex items-end flex-wrap gap-2 mt-auto">
          <span className="text-xl font-extrabold text-slate-900">
            ₹{currentPrice.toFixed(0)}
          </span>
          <span className="text-sm text-slate-400 line-through mb-0.5">
            ₹{oldPrice.toFixed(0)}
          </span>
        </div>

        {/* Delivery Info */}
        <div className="flex items-center gap-1.5 mt-3 text-xs">
           <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">MOQ: 50</span>
           <span className="text-slate-300">•</span>
           <span className="text-slate-500 font-medium">Ships in 24 hrs</span>
        </div>

        {/* Color Variants (Clean Dots) */}
        <div className="flex items-center gap-1.5 mt-4">
          {displayColors.map((color, idx) => (
            <div 
              key={idx} 
              className="w-4 h-4 rounded-full shadow-inner border border-black/5"
              style={{ backgroundColor: color }}
            />
          ))}
          {hasMoreColors && (
            <span className="text-xs text-slate-500 font-medium ml-1">+{colors.length - 6}</span>
          )}
        </div>
      </div>
    </div>
  );
}
