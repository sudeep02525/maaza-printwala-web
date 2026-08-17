'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing.js';

export default function RecentlyViewedProducts() {
  const [isMounted, setIsMounted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('recentlyViewedProducts');
      if (stored) {
        setRecentlyViewed(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse recently viewed products", e);
    }
  }, []);

  if (!isMounted || recentlyViewed.length === 0) return null;

  return (
    <section className="py-12 bg-white">
      <div className="max-w-[1520px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight mb-8">
          Recently viewed products
        </h2>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {recentlyViewed.slice(0, 4).map((prod) => (
            <motion.div 
              key={prod._id || prod.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="h-full"
            >
              <Link href={`/products/${prod.slug}`} className="block group">
                <div className="w-full aspect-square bg-slate-50 border border-slate-200 rounded-xl overflow-hidden mb-3">
                  <img 
                    src={getImageUrl(prod.images?.[0]?.url || prod.images?.[0]) || 'https://via.placeholder.com/400'} 
                    alt={prod.name?.en || prod.name || 'Product'} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-[#0082CA] transition-colors line-clamp-1">
                  {typeof prod.name === 'object' ? (prod.name.en || prod.name) : (prod.name || 'Premium Item')}
                </h3>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
