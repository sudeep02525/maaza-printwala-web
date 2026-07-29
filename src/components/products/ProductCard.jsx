'use client';

import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';

export default function ProductCard({ product }) {
  if (!product) return null;

  const id = product.slug || product._id;
  const name = product.name || 'Custom Print Product';
  const categoryName = product.category?.name || 'Commercial Printing';
  const price = product.basePrice || 0;
  const image = product.images?.[0]?.url || product.images?.[0];
  const shortDesc = product.shortDescription || 'Professional print quality with volume pricing.';
  const isFeatured = product.isFeatured;

  // 100% API-Driven Badges (Zero Frontend Guesswork)
  const badgeText = product.badgeText || (isFeatured ? 'Best Seller' : null);
  const isOfferOrNew = badgeText && (badgeText.toLowerCase().includes('offer') || badgeText.toLowerCase().includes('new') || badgeText.toLowerCase().includes('sale') || badgeText.toLowerCase().includes('%'));

  // Consume spec dynamically from backend schema attributes
  const getDynamicSpec = () => {
    if (product.attributes && product.attributes.length > 0) {
      const firstAttr = product.attributes[0];
      const val = Array.isArray(firstAttr.values) ? firstAttr.values[0] : firstAttr.value;
      if (val) return `${firstAttr.name}: ${val}`;
    }
    if (product.specSummary) return product.specSummary;
    return shortDesc;
  };

  const dynamicSpec = getDynamicSpec();
  const taxLabel = product.taxLabel || product.priceSuffix || null; // Backend-driven tax/price suffix

  return (
    <div className="group bg-white rounded-lg border border-slate-200 transition-all duration-200 hover:border-slate-300 hover:shadow-xs flex flex-col overflow-hidden">
      {/* Studio Image Thumbnail (Square 1:1 for product dominance) */}
      <Link href={`/products/${id}`} className="block aspect-square bg-[#F7F8FA] relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-[#F7F8FA]">
            <Package className="w-10 h-10 mb-1.5 stroke-1" />
            <span className="text-xs font-medium">No Image</span>
          </div>
        )}

        {/* Minimalist Flat Top Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          <span className="bg-white/90 backdrop-blur-xs text-slate-700 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide shadow-2xs">
            {categoryName}
          </span>
          {badgeText && (
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide shadow-2xs ${
                isOfferOrNew
                  ? 'bg-[#F7B718] text-slate-900 font-extrabold'
                  : 'bg-[#0082CA] text-white'
              }`}
            >
              {badgeText}
            </span>
          )}
        </div>
      </Link>

      {/* Content Area - Ultra-Minimalist & Easy to Scan */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="block text-[11px] font-medium text-slate-500 mb-1 truncate">
            {categoryName}
          </span>

          <Link href={`/products/${id}`}>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0082CA] transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>

          <p className="text-xs text-slate-500 line-clamp-1 mt-1 font-normal">
            {dynamicSpec}
          </p>
        </div>

        {/* Scan-Friendly Pricing & Minimalist CTA */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none tracking-wider">
              Starting From
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-extrabold text-slate-900">₹{price}</span>
              {taxLabel && <span className="text-[10px] font-medium text-slate-500">{taxLabel}</span>}
            </div>
          </div>

          <Link href={`/products/${id}`} className="shrink-0">
            <span className="inline-flex items-center justify-center bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-md px-3.5 py-1.5 text-xs transition-colors shadow-2xs">
              Configure
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
