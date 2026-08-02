'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, MapPin, Phone, Share2, Globe, MessageCircle, AtSign, CheckCircle2, CreditCard, ShieldCheck, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  return (
    <footer className="bg-[#111827] text-[#CBD5E1] pt-16 pb-8 select-none font-sans mt-auto">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        
        {/* Pre-Footer Newsletter Section */}
        <div className="bg-[#1F2937] rounded-lg p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 border border-[#374151] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="text-center md:text-left max-w-lg relative z-10">
            <h3 className="text-2xl font-bold text-white tracking-tight">Subscribe to our Newsletter</h3>
            <p className="text-sm text-slate-400 mt-2">Get exclusive corporate discounts, printing tips, and early access to new customizable products.</p>
          </div>
          <form className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full pl-10 pr-4 py-3 bg-[#111827] border border-[#374151] rounded-lg text-sm text-white focus:outline-none focus:border-[#0082CA] focus:ring-1 focus:ring-[#0082CA] transition-all"
                required
              />
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-[#0082CA] hover:bg-[#0068A2] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              Subscribe
            </motion.button>
          </form>
        </div>

        {/* Main Footer Directory (Large 6-Column Layout) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-[#374151]">
          
          {/* Column 1: About & Social (Takes up 2 cols on Large screens) */}
          <div className="col-span-2 space-y-6 lg:pr-8">
            <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm">
              <Image
                src="/logo-maaza.png"
                alt="Maaza Printwala"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-sm text-[#94A3B8] leading-relaxed font-medium">
              India ki Apni Online Printing Press. Premium commercial printing marketplace with fast delivery and guaranteed quality for B2B and individuals.
            </p>
            
            {/* Social Links */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Connect With Us</h5>
              <div className="flex items-center gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-[#1F2937] hover:bg-[#0082CA] text-white flex items-center justify-center transition-all shadow-sm">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1F2937] hover:bg-[#E1306C] text-white flex items-center justify-center transition-all shadow-sm">
                  <AtSign className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1F2937] hover:bg-[#1DA1F2] text-white flex items-center justify-center transition-all shadow-sm">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-[#1F2937] hover:bg-[#0A66C2] text-white flex items-center justify-center transition-all shadow-sm">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Products</h4>
            <ul className="space-y-3 text-sm text-[#94A3B8] font-medium">
              <li><Link href="/category/business-printing" className="hover:text-[#0082CA] transition-colors">Business Printing</Link></li>
              <li><Link href="/category/packaging" className="hover:text-[#0082CA] transition-colors">Packaging</Link></li>
              <li><Link href="/category/corporate-gifts" className="hover:text-[#0082CA] transition-colors">Corporate Gifts</Link></li>
              <li><Link href="/category/custom-apparel" className="hover:text-[#0082CA] transition-colors">Custom Apparel</Link></li>
              <li><Link href="/category/drinkware" className="hover:text-[#0082CA] transition-colors">Drinkware</Link></li>
              <li><Link href="/category/office-essentials" className="hover:text-[#0082CA] transition-colors">Office Essentials</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors text-[#0082CA]">View All Products &rarr;</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Resources</h4>
            <ul className="space-y-3 text-sm text-[#94A3B8] font-medium">
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Design Templates</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Artwork Guidelines</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Paper Quality Guide</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Printing Blog</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Developer API</Link></li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="space-y-6">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Support</h4>
            <ul className="space-y-3 text-sm text-[#94A3B8] font-medium">
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Help Center / FAQs</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Track Your Order</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Return Policy</Link></li>
              <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Shipping Information</Link></li>
              <li>
                <div className="pt-2 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#0082CA]" />
                  <span>1800-PRINT-NOW</span>
                </div>
              </li>
              <li>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#0082CA]" />
                  <span>support@maazaprintwala.in</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Column 5: Company & Legal */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Company</h4>
              <ul className="space-y-3 text-sm text-[#94A3B8] font-medium">
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">About Us</Link></li>
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Careers</Link></li>
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Press & Media</Link></li>
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Partner Program</Link></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3 text-sm text-[#94A3B8] font-medium">
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Terms of Service</Link></li>
                <li><Link href="/category/all" className="hover:text-[#0082CA] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Security & Payment */}
        <div className="pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          
          <div className="text-xs text-[#94A3B8] font-medium text-center lg:text-left">
            <p>© {new Date().getFullYear()} Maaza Printwala. All rights reserved.</p>
            <p className="mt-1">Commercial Printing Hub, Mumbai, India 400001</p>
          </div>
          
          {/* Security Badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-300">
            <div className="flex items-center gap-1.5 bg-[#1F2937] px-3 py-1.5 rounded-md border border-[#374151]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>ISO 9001:2015</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1F2937] px-3 py-1.5 rounded-md border border-[#374151]">
              <CheckCircle2 className="w-4 h-4 text-[#0082CA]" />
              <span>GST Compliant</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1F2937] px-3 py-1.5 rounded-md border border-[#374151]">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>256-bit SSL Secure</span>
            </div>
          </div>

          {/* Payment Icons */}
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5 text-slate-800" />
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-[#003A70] tracking-tighter hover:scale-105 transition-transform">
              VISA
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-[#EB001B] tracking-tighter italic hover:scale-105 transition-transform">
              MC
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-slate-800 tracking-tighter hover:scale-105 transition-transform">
              UPI
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
