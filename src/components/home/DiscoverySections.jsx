'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/routing.js';
import { Search, ChevronRight } from 'lucide-react';

const PRINTING_NEEDS = [
  { name: 'Marketing Events', icon: '🎪', link: '/products?need=marketing' },
  { name: 'Office Stationery', icon: '📎', link: '/products?need=office' },
  { name: 'Product Packaging', icon: '📦', link: '/products?need=packaging' },
  { name: 'Restaurant Menus', icon: '🍔', link: '/products?need=restaurant' },
  { name: 'Corporate Gifting', icon: '🎁', link: '/products?need=corporate' },
  { name: 'Wedding Invites', icon: '💌', link: '/products?need=wedding' },
];

const POPULAR_SEARCHES = [
  'Business Cards 300 GSM', 'Custom T-Shirts Bulk', 'Spot UV Letterheads',
  'Kraft Packaging Boxes', 'Acrylic Signs', 'ID Cards with Lanyard', 
  'Canvas Tote Bags', 'Coffee Mugs Sublimation'
];

export default function DiscoverySections() {
  return (
    <section className="py-16 bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Shop By Printing Need (Takes up 2/3 of the space on Desktop) */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h2 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">Shop By Printing Need</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2">Find curated print products for your specific use-case.</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {PRINTING_NEEDS.map((need, i) => (
                <Link key={i} href={need.link}>
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -2 }}
                    className="flex flex-col items-center justify-center p-6 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] hover:border-[#0082CA] hover:bg-blue-50/50 transition-colors cursor-pointer group shadow-sm text-center"
                  >
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform">{need.icon}</span>
                    <span className="font-bold text-sm text-[var(--text-main)] group-hover:text-[#0082CA] transition-colors">{need.name}</span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <div className="mb-8 flex items-center gap-2">
              <Search className="w-5 h-5 text-[var(--text-faint)]" />
              <h2 className="text-xl font-extrabold text-[var(--text-main)] tracking-tight">Popular Searches</h2>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term, i) => (
                <Link key={i} href={`/products?search=${encodeURIComponent(term)}`}>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-[var(--hover)] rounded-full text-xs font-semibold text-[var(--text-muted)] hover:bg-[#0082CA] hover:text-white transition-colors cursor-pointer flex items-center gap-1 group"
                  >
                    {term}
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                  </motion.div>
                </Link>
              ))}
            </div>
            
            {/* Promo block in sidebar */}
            <div className="mt-8 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg border border-blue-100">
              <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Pro Tip</span>
              <h4 className="font-bold text-[var(--text-main)] mt-3 text-sm">Need help finding something?</h4>
              <Link href="/contact" className="inline-block mt-4 text-xs font-bold text-[#0082CA] hover:underline">Chat with an Expert &rarr;</Link>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
