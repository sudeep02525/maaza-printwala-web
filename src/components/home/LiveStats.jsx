'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Users, LayoutTemplate, Briefcase } from 'lucide-react';

const STATS = [
  { label: 'Orders Delivered', value: '1.2M+', icon: Truck, color: 'text-[#0082CA]', bg: 'bg-blue-50' },
  { label: 'Happy Customers', value: '100k+', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { label: 'Design Templates', value: '5000+', icon: LayoutTemplate, color: 'text-amber-500', bg: 'bg-amber-50' },
  { label: 'Corporate Partners', value: '10k+', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50' },
];

export default function LiveStats() {
  return (
    <section className="py-20 bg-slate-900 border-b border-slate-800 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">India&apos;s Fastest Growing Print Network</h2>
          <p className="text-sm text-slate-400 mt-2">Trusted by individuals and enterprises alike.</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="bg-white/10 backdrop-blur-md p-8 rounded-[24px] border border-white/10 text-center shadow-2xl hover:bg-white/15 transition-colors"
            >
              <div className={`w-14 h-14 mx-auto rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <motion.h3 
                initial={{ scale: 0.8 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + (idx * 0.1), type: "spring" }}
                className="text-4xl font-extrabold text-white tracking-tight mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
