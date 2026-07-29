'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Truck, RefreshCw, Award, Mail, MapPin, CheckCircle2 } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#1F2937] text-[#CBD5E1] pt-12 pb-8 border-t border-[#374151] select-none font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Service Highlights (Clean Monochrome Outline on Charcoal) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-10 border-b border-[#374151] text-left">
          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-slate-500 transition-colors">
            <div className="p-2.5 bg-slate-800 text-[#0082CA] rounded shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Professional Print Standards</h4>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                High-resolution CMYK digital and offset print reproduction tailored for corporate applications.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-slate-500 transition-colors">
            <div className="p-2.5 bg-slate-800 text-[#0082CA] rounded shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Standard Logistics</h4>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                Reliable packaging and dispatch across major commercial destinations via partner courier networks.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-slate-500 transition-colors">
            <div className="p-2.5 bg-slate-800 text-[#0082CA] rounded shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Transparent Pricing</h4>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                Server-calculated volume pricing tiers with upfront specifications and clear unit breakdowns.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-lg bg-[#1F2937] border border-[#374151] hover:border-slate-500 transition-colors">
            <div className="p-2.5 bg-slate-800 text-[#0082CA] rounded shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">Dedicated QC Review</h4>
              <p className="text-xs text-[#CBD5E1] mt-1 leading-relaxed font-normal">
                Staff check of submitted artwork guidelines including resolution, safe zone, and bleed boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 py-10 border-b border-[#374151]">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-block bg-white px-3 py-2 rounded-md shadow-xs">
              <img
                src="/logo-maaza.png"
                alt="Maaza Printwala — India ki Apni Online Printing Press"
                className="h-9 sm:h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#CBD5E1] leading-relaxed max-w-sm font-normal">
              India ki Apni Online Printing Press. Providing structured, schema-driven custom commercial printing solutions with streamlined artwork review and transparent volume pricing.
            </p>
            <div className="pt-1 text-xs text-[#CBD5E1] space-y-2 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#0082CA] shrink-0" />
                <span>Commercial Printing Hub, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#0082CA] shrink-0" />
                <span>support@maazaprintwala.in</span>
              </div>
            </div>
          </div>

          {/* Catalogue Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Print Catalogue</h5>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">View All Products</Link></li>
              <li><Link href="/products?category=business-cards" className="hover:text-[#0082CA] transition-colors">Business Cards</Link></li>
              <li><Link href="/products?category=marketing-signage" className="hover:text-[#0082CA] transition-colors">Marketing &amp; Signage</Link></li>
              <li><Link href="/products?category=custom-apparel" className="hover:text-[#0082CA] transition-colors">Custom Apparel</Link></li>
              <li><Link href="/products?category=corporate-gifts" className="hover:text-[#0082CA] transition-colors">Corporate Gifts</Link></li>
            </ul>
          </div>

          {/* Customization Options */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Design Experiences</h5>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">Upload Custom Artwork</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">Customise Predefined Templates</Link></li>
              <li><span className="text-slate-400">Artwork Guidelines &amp; Formatting</span></li>
              <li><span className="text-slate-400">Volume &amp; Corporate Pricing</span></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider">Information</h5>
            <ul className="space-y-2 text-xs text-[#CBD5E1] font-medium">
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">About Maaza Printwala</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">Standard Dispatch Policy</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">Privacy &amp; Data Security</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 font-medium">
          <p>© {new Date().getFullYear()} Maaza Printwala. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-slate-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>100% Server-Authoritative Pricing</span>
            </span>
            <span>•</span>
            <span>Commercial B2B Marketplace Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
