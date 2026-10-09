'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Edit3, ArrowRight } from 'lucide-react';
import { Link, useRouter } from '@/i18n/routing.js';
import axiosInstance from '@/services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';

export default function DesignTemplates() {
  const [templates, setTemplates] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axiosInstance.get('/templates').then(res => {
      const allTemplates = res.data?.data?.templates || res.data?.templates || [];
      setTemplates(allTemplates.slice(0, 4));
    }).catch(err => console.error(err));
  }, []);

  if (templates.length === 0) return null;

  return (
    <section className="py-20 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-[#0082CA] font-bold text-xs uppercase tracking-wider mb-2 block">Online Studio</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Customizable Templates</h2>
            <p className="text-sm text-slate-500 mt-2">Pick a premium template and customize it in our browser editor.</p>
          </div>
          <Link href="/products" className="hidden sm:flex items-center gap-1 text-[#0082CA] font-bold hover:underline">
            View All Templates <ArrowRight className="w-4 h-4"/>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((temp, i) => (
            <motion.div 
              key={temp._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5 }}
              className="group bg-white rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => {
                if (temp.product) {
                  router.push(`/products/${temp.product.slug || temp.product._id}/design?templateId=${temp._id}`);
                }
              }}
            >
              {/* Image Container with Editor Overlay */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden flex items-center justify-center p-2">
                <img 
                  src={getImageUrl(temp.thumbnail || temp.previewFront) || 'https://images.unsplash.com/photo-1574751508226-f40445d31599?auto=format&fit=crop&w=600&q=80'} 
                  alt={temp.name} 
                  className="w-full h-full object-cover rounded-md group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Editor Overlay */}
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                  <button className="bg-[#0082CA] text-white px-5 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-blue-600 transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300">
                    <Edit3 className="w-4 h-4" /> Customize Now
                  </button>
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-bold text-[#0082CA] uppercase tracking-wider mb-1">
                  {temp.product?.name || 'Template'}
                </p>
                <h3 className="font-extrabold text-slate-900 truncate">{temp.name}</h3>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
