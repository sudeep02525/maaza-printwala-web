'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '../../services/axiosInstance.js';
import ProductCard from '../products/ProductCard.jsx';
import Skeleton from '../ui/Skeleton.jsx';

export default function ProductGrids() {
  const [activeTab, setActiveTab] = useState('best-sellers');

  const { data, isLoading } = useQuery({
    queryKey: ['products-grid', activeTab],
    queryFn: () => axiosInstance.get('/products'),
    retry: false,
  });

  // Mock splitting data based on tab for demo
  const products = data?.data?.products || [];
  let displayedProducts = [];
  if (activeTab === 'best-sellers') displayedProducts = products.slice(0, 8);
  if (activeTab === 'recommended') displayedProducts = products.slice(8, 16);
  if (activeTab === 'collections') displayedProducts = products.slice(16, 24);

  const TABS = [
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'recommended', label: 'Recommended for You' },
    { id: 'collections', label: 'Explore Collections' }
  ];

  return (
    <section className="py-12 bg-white border-y border-slate-100">
      <div className="max-w-[1520px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
        
        {/* Tabs Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Curated for You</h2>
          
          <div className="flex p-1 bg-slate-100 rounded-lg max-w-full overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  activeTab === tab.id ? 'text-[#0082CA]' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="active-tab" 
                    className="absolute inset-0 bg-white shadow-sm rounded-lg border border-slate-200" 
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        <div className="min-h-[400px]">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <Skeleton key={i} className="h-96 rounded-lg" />)}
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {displayedProducts.length > 0 ? (
                  displayedProducts.map(p => <ProductCard key={p._id} product={p} />)
                ) : (
                  <div className="col-span-full py-12 text-center text-slate-500">
                    No products found for this section.
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

      </div>
    </section>
  );
}
