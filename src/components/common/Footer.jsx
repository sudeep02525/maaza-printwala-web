'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t-4 border-[#0A58CA] select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Service Highlights (Neutral & Trustworthy) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-12 border-b border-slate-800 text-left">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Professional Print Standards</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                High-resolution CMYK digital and offset print reproduction tailored for business applications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Standard Logistics</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Reliable packaging and dispatch across major commercial destinations via partner courier networks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transparent Pricing</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Server-calculated volume pricing tiers with upfront specifications and clear unit breakdowns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Dedicated QC Review</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Staff check of submitted artwork guidelines including resolution, safe zone, and bleed boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white p-3 rounded-xl shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0A58CA] via-[#D63384] to-[#FFC107] flex items-center justify-center font-black text-white text-lg">
                  M
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-slate-900 text-xl tracking-tight leading-none">MAAZA</span>
                  <span className="text-[9px] font-bold text-[#D63384] uppercase tracking-widest mt-0.5">Printwala</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India ki Apni Online Printing Press. Providing structured, schema-driven custom commercial printing solutions with streamlined artwork review and transparent volume pricing.
            </p>
            <div className="pt-2 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0A58CA]" />
                <span>Commercial Printing Hub, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D63384]" />
                <span>support@maazaprintwala.in</span>
              </div>
            </div>
          </div>

          {/* Catalogue Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Print Catalogue</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products" className="hover:text-white transition-colors">View All Products</Link></li>
              <li><Link href="/products?category=business-cards" className="hover:text-white transition-colors">Business Cards</Link></li>
              <li><Link href="/products?category=marketing-signage" className="hover:text-white transition-colors">Marketing & Signage</Link></li>
              <li><Link href="/products?category=custom-apparel" className="hover:text-white transition-colors">Custom Apparel</Link></li>
            </ul>
          </div>

          {/* Customization Options */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Design Experiences</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="/products" className="hover:text-white transition-colors">Upload Custom Artwork</Link></li>
              <li><Link href="/products" className="hover:text-white transition-colors">Customise Predefined Templates</Link></li>
              <li><span className="text-slate-600">Artwork Guidelines & Formatting</span></li>
              <li><span className="text-slate-600">Volume & Corporate Pricing</span></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Information</h5>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">About Maaza Printwala</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Standard Dispatch Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy & Data Security</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Maaza Printwala. All rights reserved.</p>
          <p className="text-[11px] text-slate-500">
            Professional printing-commerce platform architecture.
          </p>
        </div>
      </div>
    </footer>
  );
}
