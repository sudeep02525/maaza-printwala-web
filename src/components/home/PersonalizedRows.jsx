'use client';

import React, { useState, useEffect } from 'react';
import ProductCard from '../products/ProductCard.jsx';
import { Clock, PenTool } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PersonalizedRows() {
  const [isMounted, setIsMounted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  
  // Mock recently customized templates
  const RECENTLY_CUSTOMIZED = [
    { id: 1, name: 'My Corporate Card v2', category: 'Business Card', date: 'Edited 2 hrs ago', image: 'https://images.unsplash.com/photo-1574751508226-f40445d31599?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Diwali Gifting Box', category: 'Packaging', date: 'Edited yesterday', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80' },
  ];

  useEffect(() => {
    setIsMounted(true);
    try {
      const stored = localStorage.getItem('recentlyViewedProducts');
      if (stored) setRecentlyViewed(JSON.parse(stored));
    } catch(e) {}
  }, []);

  if (!isMounted) return null;

  // Don't render if there's no data
  if (recentlyViewed.length === 0 && RECENTLY_CUSTOMIZED.length === 0) return null;

  return (
    <section className="py-12 bg-[#fafafa] border-t border-slate-100">
      <div className="max-w-[1520px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6">
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Recently Viewed (Takes up 3 columns) */}
          {recentlyViewed.length > 0 && (
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2 mb-8">
                <Clock className="w-5 h-5 text-slate-400" />
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">Recently Viewed</h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                {recentlyViewed.map((prod, idx) => (
                  <div key={idx} className="w-64 shrink-0">
                    <ProductCard product={prod} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recently Customized (Sidebar style) */}
          <div className={`${recentlyViewed.length === 0 ? 'lg:col-span-4' : 'lg:col-span-1'}`}>
            <div className="flex items-center gap-2 mb-8">
              <PenTool className="w-5 h-5 text-slate-400" />
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Recently Customized</h2>
            </div>
            
            <div className={`grid gap-4 ${recentlyViewed.length === 0 ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4' : 'grid-cols-1'}`}>
              {RECENTLY_CUSTOMIZED.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  className="bg-white rounded-lg p-3 flex gap-4 items-center border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0082CA] transition-colors">{item.name}</h4>
                    <p className="text-[10px] uppercase font-bold text-slate-400 mt-1">{item.category}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{item.date}</p>
                  </div>
                </motion.div>
              ))}
              
              <button className="w-full mt-2 py-3 bg-white border-2 border-slate-200 border-dashed rounded-lg text-sm font-bold text-slate-500 hover:text-[#0082CA] hover:border-[#0082CA] transition-colors flex items-center justify-center gap-2">
                View All Designs &rarr;
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
