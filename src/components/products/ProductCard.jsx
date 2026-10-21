'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { Package, Star, Info } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import { slugify } from '@/lib/devkit';

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
    const slugFromName = slugify(product.category.name);
    if (t.has(`categories.${slugFromName}`)) {
      categoryName = t(`categories.${slugFromName}`);
    }
  }
  
  // Pricing logic
  const currentPrice = product.basePrice || 999;
  const oldPrice = product.mrp || null;
  const hasDiscount = oldPrice && oldPrice > currentPrice;
  const discountPercent = hasDiscount ? Math.round(((oldPrice - currentPrice) / oldPrice) * 100) : 0;
  
  const image = product.images?.[0]?.url || product.images?.[0];

  return (
    <div className="group relative flex flex-col w-full h-full">
      {/* Image Container */}
      <div className="relative aspect-[9/10] bg-[var(--hover)] overflow-hidden rounded-md border border-[var(--border)]">
        {/* Sale Badge */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 flex flex-col gap-1 z-10">
          {hasDiscount && discountPercent > 0 && (
            <div className="bg-rose-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium capitalize tracking-wide rounded-md shadow-sm">
              {tProd('sale')} <span className="font-extrabold ml-0.5">-{discountPercent}%</span>
            </div>
          )}
          {product.featured && (
            <div className="bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold rounded uppercase">
              {tProd('bestseller')}
            </div>
          )}
        </div>

        <Link href={`/products/${id}`} className="block w-full h-full" draggable={false}>
          {image ? (
            <img
              src={getImageUrl(image)}
              alt={name}
              loading="lazy"
              draggable="false"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-[var(--text-faint)]">
              <Package className="w-10 h-10 mb-2 stroke-1" />
            </div>
          )}
        </Link>
      </div>

      {/* Product Info */}
      <div className="flex flex-col text-left pt-2.5 sm:pt-3 flex-1">
        {/* Brand */}
        <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] font-medium mb-0.5 sm:mb-1">
          {product.brand || categoryName || 'printvenue'}
        </span>

        {/* Product Name */}
        <Link href={`/products/${id}`} draggable={false}>
          <h3 className="text-[13px] sm:text-[14px] font-bold text-[var(--text-main)] leading-snug line-clamp-2 hover:text-[#0082CA] transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating — only show if product actually has verified reviews */}
        {product.reviewCount > 0 && product.averageRating > 0 ? (
          <div className="flex items-center gap-0.5 mt-1 sm:mt-1.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${
                  star <= Math.round(product.averageRating)
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-[var(--border-strong)]'
                }`}
              />
            ))}
            <span className="text-[11px] sm:text-xs text-[var(--text-muted)] ml-1 font-medium">
              ({product.averageRating.toFixed(1)})
            </span>
          </div>
        ) : null}

        <div className="mt-auto">
          {/* Price Row */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            <span className="bg-[var(--text-main)] text-[var(--bg-card)] text-[12px] sm:text-[13px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-sm">
              ₹{currentPrice.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-[11px] text-[var(--text-faint)] line-through">
                ₹{oldPrice.toFixed(2)}
              </span>
            )}
            <span className="text-[10px] sm:text-[11px] font-bold text-[var(--text-main)] ml-0.5">
              {locale === 'hi' ? 'जीएसटी सहित' : locale === 'mr' ? 'जीएसटी समाविष्ट' : 'Incl. GST'}
            </span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[11px] text-[#8dc63f] font-bold">
              {locale === 'hi' ? '4 दिनों में डिलीवरी' : locale === 'mr' ? '4 दिवसात वितरण' : 'delivery within 4 days'}
            </span>
            <Info className="w-3.5 h-3.5 text-[var(--text-faint)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
