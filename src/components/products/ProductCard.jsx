'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { Package, Star, Info } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';

export default function ProductCard({ product }) {
  const tProd = useTranslations('productCard');
  const locale = useLocale();

  const t = useTranslations();

  if (!product) return null;

  const id = product.slug || product._id;
  
  // Handle localized product name with fallback
  let name = 'Premium Print Item';
  if (product.name) {
    if (typeof product.name === 'object') {
      name = product.name[locale] || product.name.en || product.name;
    } else if (product.slug && t.has(`products.${product.slug}`)) {
      name = t(`products.${product.slug}`);
    } else {
      name = product.name;
    }
  }
  
  // Handle localized category name with fallback
  let categoryName = product.category?.name || 'printvenue';
  if (product.category?.slug && t.has(`categories.${product.category.slug}`)) {
    categoryName = t(`categories.${product.category.slug}`);
  } else if (product.category?.name) {
    const slugFromName = product.category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');
    if (t.has(`categories.${slugFromName}`)) {
      categoryName = t(`categories.${slugFromName}`);
    }
  }
  
  // Pricing logic
  const currentPrice = product.basePrice || 999;
  const oldPrice = Math.round(currentPrice * 1.5);
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  
  const image = product.images?.[0]?.url || product.images?.[0];

  return (
    <div className="group relative flex flex-col w-full h-full">
      {/* Image Container */}
      <div className="relative aspect-[9/10] bg-[#e6e6e6] overflow-hidden rounded-md">
        {/* Sale Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <div className="bg-rose-500 text-white px-3 py-1 text-xs font-medium capitalize tracking-wide rounded-md shadow-sm">
              {tProd('sale')} <span className="font-extrabold ml-0.5">-{discountPercent}%</span>
            </div>
          )}
          {product.featured && (
            <div className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold rounded uppercase">
              {tProd('bestseller')}
            </div>
          )}
        </div>

        <Link href={`/products/${id}`} className="block w-full h-full" draggable={false}>
          {image ? (
            <img
              src={image}
              alt={name}
              loading="lazy"
              draggable="false"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <Package className="w-10 h-10 mb-2 stroke-1" />
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col text-left pt-3 flex-1">
        {/* Brand */}
        <span className="text-[11px] text-gray-500 font-medium mb-1">
          {product.brand || categoryName || 'printvenue'}
        </span>

        {/* Product Name */}
        <Link href={`/products/${id}`} draggable={false}>
          <h3 className="text-[14px] font-bold text-black leading-snug line-clamp-2 hover:text-[#0082CA] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
          <div className="relative w-4 h-4">
            <Star className="absolute top-0 left-0 w-4 h-4 text-amber-400" />
            <div className="absolute top-0 left-0 w-[50%] h-full overflow-hidden">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            </div>
          </div>
          <span className="text-xs text-gray-500 ml-1 hover:underline cursor-pointer">{tProd('reviews', { count: 3 })}</span>
        </div>

        <div className="mt-auto">
          {/* Price Row */}
          <div className="flex items-center flex-wrap gap-2 mt-2">
            <span className="bg-slate-900 text-white text-[13px] font-bold px-2.5 py-1 rounded shadow-sm">
              ₹{currentPrice.toFixed(2)}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ₹{oldPrice.toFixed(2)}
            </span>
            <span className="text-[11px] font-bold text-black ml-0.5">
              {locale === 'hi' ? 'कर सहित' : locale === 'mr' ? 'कर समाविष्ट' : 'Incl. VAT'}
            </span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-[#8dc63f] font-bold">
              {locale === 'hi' ? '4 दिनों में डिलीवरी' : locale === 'mr' ? '4 दिवसात वितरण' : 'delivery within 4 days'}
            </span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
