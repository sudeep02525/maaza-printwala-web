'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Package, Star, Info } from 'lucide-react';

export default function ProductCard({ product }) {
  if (!product) return null;

  const id = product.slug || product._id;
  const name = product.name || 'Men\'s Embroidered Dress Shirt - Personalized Breathable Comfort';
  const categoryName = product.category?.name || 'printvenue';
  
  // Pricing logic
  const currentPrice = product.basePrice || 999;
  const oldPrice = Math.round(currentPrice * 1.5);
  const discountPercent = Math.round(((oldPrice - currentPrice) / oldPrice) * 100);
  
  const image = product.images?.[0]?.url || product.images?.[0];

  return (
    <div className="group relative flex flex-col w-full h-full">
      {/* Image Container */}
      <div className="relative aspect-[4/5] bg-[#e6e6e6] overflow-hidden rounded-md">
        {/* Sale Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {discountPercent > 0 && (
            <div className="bg-[#cc5555] text-white px-2 py-0.5 text-[10px] font-bold rounded">
              Sale -{discountPercent}%
            </div>
          )}
          {product.featured && (
            <div className="bg-blue-600 text-white px-2 py-0.5 text-[10px] font-bold rounded uppercase">
              Bestseller
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
        <span className="text-[10px] text-gray-500 font-medium mb-1">
          {product.brand || categoryName || 'printvenue'}
        </span>

        {/* Product Name */}
        <Link href={`/products/${id}`} draggable={false}>
          <h3 className="text-[13px] font-medium text-black leading-snug line-clamp-2 hover:text-blue-600 transition-colors">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-0.5 mt-1.5">
          {[1, 2, 3, 4].map((i) => (
            <Star key={i} className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
          ))}
          <Star className="w-3.5 h-3.5 text-blue-600" />
          <span className="text-[11px] text-gray-500 ml-1">3</span>
        </div>

        <div className="mt-auto">
          {/* Price Row */}
          <div className="flex items-center flex-wrap gap-1.5 mt-2">
            <span className="bg-[#cc5555] text-white text-[11px] font-bold px-1.5 py-0.5 rounded shadow-sm">
              Rs. {currentPrice.toFixed(2)}
            </span>
            <span className="text-[10px] text-gray-400 line-through">
              Rs. {oldPrice.toFixed(2)}
            </span>
            <span className="text-[10px] font-bold text-black ml-0.5">
              Incl. VAT
            </span>
          </div>

          {/* Delivery Info */}
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[11px] text-[#8dc63f] font-medium">delivery within 4 days</span>
            <Info className="w-3.5 h-3.5 text-gray-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
