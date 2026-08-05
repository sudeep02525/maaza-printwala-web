'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Download, ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

const TEMPLATES = [
  { id: 1, title: 'Modern Corporate', category: 'Business Card', image: 'https://images.unsplash.com/photo-1574751508226-f40445d31599?auto=format&fit=crop&w=600&q=80' },
  { id: 2, title: 'Creative Agency', category: 'Letterhead', image: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80' },
  { id: 3, title: 'Minimalist Cafe', category: 'Menu Card', image: 'https://images.unsplash.com/photo-1544465544-1b71aee9dfa3?auto=format&fit=crop&w=600&q=80' },
  { id: 4, title: 'Real Estate Elite', category: 'Brochure', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80' },
];

export default function DesignTemplates() {
  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#0082CA] font-bold text-xs uppercase tracking-wider mb-2 block">Online Studio</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customizable Templates</h2>
            <p className="text-sm text-slate-500 mt-2">Pick a premium template and customize it in our browser editor.</p>
          </div>
          <Link href="/all" className="hidden sm:flex items-center gap-1 text-[#0082CA] font-bold hover:underline">
            View All Templates <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEMPLATES.map((temp, i) => (
            <motion.div 
              key={temp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Image Container with Editor Overlay */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img src={temp.image} alt={temp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                
                {/* Editor Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="bg-[#0082CA] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <Edit3 className="w-4 h-4" /> Edit Online
                  </button>
                  <button className="bg-white/20 text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-white/30 transition-colors transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75">
                    <Download className="w-4 h-4" /> Download PSD
                  </button>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-bold text-[#0082CA] uppercase tracking-wider mb-1">{temp.category}</p>
                <h3 className="font-extrabold text-slate-900">{temp.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
