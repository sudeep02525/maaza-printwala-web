'use client';

import React from 'react';
import Link from 'next/link';
import { Package, ArrowRight, Sparkles, Zap, ShieldCheck, Truck } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function ProductCard({ product }) {
  if (!product) return null;

  const id = product.slug || product._id;
  const name = product.name || 'Custom Print Product';
  const categoryName = product.category?.name || 'Commercial Printing';
  const price = product.basePrice || 0;
  const image = product.images?.[0]?.url || product.images?.[0];
  const shortDesc = product.shortDescription || 'Professional print quality with volume pricing.';
  const isFeatured = product.isFeatured;

  // Derive smart printing spec badge and unit rate calculation for commercial display
  const getSmartSpecs = () => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('visiting card') || lowerName.includes('card')) {
      return { spec: '300 / 350 GSM Art Card | Spot UV Available', rate: `₹${(price / 1000).toFixed(2)} / card @ 1000 qty` };
    }
    if (lowerName.includes('banner') || lowerName.includes('flex')) {
      return { spec: '340 / 440 GSM Weatherproof Flex | Metal Eyelets', rate: `₹12.00 / sq.ft on bulk` };
    }
    if (lowerName.includes('shirt') || lowerName.includes('apparel')) {
      return { spec: '100% Combed Cotton | Wash-Resistant DTG Print', rate: `₹220.00 / unit on bulk` };
    }
    if (lowerName.includes('letterhead')) {
      return { spec: '100 GSM Alabaster / 120 GSM Royal Textured', rate: `₹4.50 / sheet @ 1000 qty` };
    }
    if (lowerName.includes('standee')) {
      return { spec: '330 GSM Star Flex | Heavy Duty Aluminum Base', rate: `₹900.00 / unit on bulk` };
    }
    return { spec: 'High-Resolution CMYK Commercial Print', rate: `Volume discounts up to 35%` };
  };

  const { spec, rate } = getSmartSpecs();

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        <span className="bg-slate-900/90 text-white backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm">
          {categoryName}
        </span>
        {isFeatured ? (
          <span className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
            <Sparkles className="w-3 h-3 animate-pulse" />
            Bestseller
          </span>
        ) : (
          <span className="bg-blue-600/90 text-white backdrop-blur-md px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider shadow-xs">
            🏷️ Bulk Price
          </span>
        )}
      </div>

      {/* Image Thumbnail with Zoom effect */}
      <Link href={`/products/${id}`} className="block aspect-4/3 bg-slate-50 relative overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-slate-100">
            <Package className="w-12 h-12 mb-2" />
            <span className="text-xs font-semibold">No Image Available</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Instant Online Pricing & Proofing
          </span>
        </div>
      </Link>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Spec Pill */}
          <div className="inline-block bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-tight mb-2 border border-blue-100">
            {spec}
          </div>

          <Link href={`/products/${id}`}>
            <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug">
              {name}
            </h3>
          </Link>

          <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 font-normal leading-relaxed">
            {shortDesc}
          </p>
        </div>

        {/* Delivery & Assurance Strip */}
        <div className="py-2 px-3 bg-slate-50 rounded-lg flex items-center justify-between text-[11px] font-semibold text-slate-600 border border-slate-100">
          <span className="flex items-center gap-1.5 text-emerald-700">
            <Truck className="w-3.5 h-3.5 shrink-0" /> Dispatch in 24-48 Hrs
          </span>
          <span className="text-slate-400">|</span>
          <span className="flex items-center gap-1 text-slate-600">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500 shrink-0" /> Staff Checked
          </span>
        </div>

        {/* Pricing & CTA Block */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Starting From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">₹{price}</span>
              <span className="text-[10px] font-semibold text-slate-500">pack</span>
            </div>
            <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{rate}</span>
          </div>

          <Link href={`/products/${id}`} className="shrink-0">
            <Button
              variant="primary"
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm hover:shadow-md transition-all px-4 py-2"
            >
              <span>Customize</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
