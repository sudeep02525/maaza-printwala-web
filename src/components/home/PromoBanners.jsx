'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Tag, Percent } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

export default function PromoBanners() {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Seasonal Offers</h2>
            <p className="text-sm text-slate-500 mt-2">Exclusive discounts on corporate printing for a limited time.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Banner 1 */}
          <Link href="/all">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background abstract shapes */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-black/10 rounded-full blur-xl" />

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-full mb-6">
                  <Tag className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Corporate Festive Sale</span>
                </div>
                
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                    Get up to <span className="text-yellow-300">40% OFF</span> <br/>on Bulk Orders
                  </h3>
                  <p className="text-white/80 font-medium max-w-sm mb-6">
                    Valid on Business Cards, Brochures, and Letterheads. Order minimum 5000 units.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white font-bold group-hover:text-yellow-300 transition-colors">
                  Claim Offer Now <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

          {/* Banner 2 */}
          <Link href="/all">
            <motion.div 
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#0082CA] to-blue-800 p-8 sm:p-10 shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              {/* Background Image / Texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-overlay group-hover:scale-110 transition-transform duration-700">
                <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80" alt="Texture" className="w-full h-full object-cover" />
              </div>

              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md w-fit px-3 py-1.5 rounded-full mb-6">
                  <Percent className="w-4 h-4 text-white" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">New Customer Bonus</span>
                </div>
                
                <div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
                    Flat <span className="text-cyan-300">₹500 OFF</span> <br/>on First Order
                  </h3>
                  <p className="text-white/80 font-medium max-w-sm mb-6">
                    Use code <span className="bg-white/20 px-2 py-0.5 rounded font-mono font-bold text-white">NEWPRINT500</span> at checkout. No minimum order value.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-white font-bold group-hover:text-cyan-300 transition-colors">
                  Shop Now <ArrowRight className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </motion.div>
          </Link>

        </div>
      </div>
    </section>
  );
}
