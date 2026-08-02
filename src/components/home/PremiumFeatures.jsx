'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Award, Package, ShieldCheck, Headset, Palette } from 'lucide-react';

export default function PremiumFeatures() {
  return (
    <section className="py-20 bg-white border-y border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-50/50 rounded-full blur-[100px] pointer-events-none" />
        
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-12 relative z-10">Premium Experience Guaranteed</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          {[
            { icon: Truck, title: "Fast Delivery", desc: "Reliable and tracked shipping across all major Indian commercial hubs." },
            { icon: Award, title: "Unmatched Quality", desc: "Best-in-class paper stocks and high-density CMYK offset printing." },
            { icon: Package, title: "Bulk Orders", desc: "Exclusive volume pricing tiers for corporate and agency resellers." },
            { icon: ShieldCheck, title: "GST Invoicing", desc: "100% tax compliant B2B invoices with direct ITC support." },
            { icon: Headset, title: "24x7 Support", desc: "Dedicated human support for critical corporate printing deadlines." },
            { icon: Palette, title: "Design Help", desc: "Expert pre-press checks on every file to ensure perfect safe zones." }
          ].map((feature, idx) => (
            <motion.div key={idx} whileHover={{ y: -8, scale: 1.02 }} className="group bg-white p-8 rounded-lg border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,130,202,0.1)] transition-all duration-300 relative overflow-hidden text-left">
              {/* Subtle hover gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 to-[#0082CA]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 shadow-sm border border-blue-200/50 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#0082CA]" />
                </div>
                <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-[#0082CA] transition-colors">{feature.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
