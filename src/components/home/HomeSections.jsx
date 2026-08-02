'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Heart } from 'lucide-react';
import ProductCard from '../products/ProductCard.jsx';
import HorizontalSlider from '../common/HorizontalSlider.jsx';

const SectionHeader = ({ title, subtitle, linkText = "View All" }) => (
  <div className="flex justify-between items-end mb-8">
    <div>
      <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
    </div>
    {linkText && (
      <Link href="/category/all" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#0082CA] hover:underline">
        {linkText} <ArrowRight className="w-4 h-4" />
      </Link>
    )}
  </div>
);

// 1. FEATURED PRODUCTS (Horizontal Scroll)
export const FeaturedSlider = ({ products = [] }) => {
  if (!products?.length) return null;

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title="Featured Products" subtitle="Handpicked premium prints for you" />
        <HorizontalSlider cardWidthClass="w-[280px] sm:w-[300px] lg:w-[calc(25%-18px)]">
          {products.map((p) => (
            <ProductCard key={p._id || p.slug} product={p} />
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
};

// 2. CORPORATE PRINTING (Asymmetrical Layout)
export const CorporateSection = ({ products = [] }) => {
  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title="Corporate Printing & Gifting" subtitle="Elevate your brand with premium quality" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Hero Banner */}
          <div className="lg:col-span-5 relative rounded-lg overflow-hidden group">
            <img loading="lazy" src="/images/cat_corporate_gifts_1785433724640.png" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Corporate Gifting" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent p-8 flex flex-col justify-end">
              <span className="text-yellow-400 font-bold text-xs uppercase tracking-widest mb-2">B2B Bulk Orders</span>
              <h3 className="text-3xl font-extrabold text-white mb-3">Premium Corporate Welcome Kits</h3>
              <p className="text-white/80 text-sm mb-6">Notebooks, metallic pens, and ID cards bundled perfectly for your new employees.</p>
              <Link href="/category/all" className="w-fit px-6 py-2.5 bg-white text-slate-900 font-bold rounded-lg text-sm hover:bg-[#0082CA] hover:text-white transition-colors">
                Explore Kits
              </Link>
            </div>
          </div>
          
          {/* 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
            {products.slice(0,4).map((p, i) => (
              <ProductCard key={i} product={p} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 3. WEDDING PRINTING (Elegant Layout)
export const WeddingSection = () => {
  return (
    <section className="py-16 bg-[#FFF5F5] border-y border-red-50">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif text-slate-900 italic tracking-wide mb-3">The Wedding Boutique</h2>
        <p className="text-slate-600 text-sm">Elegant invitations, save-the-dates, and personalized return gifts.</p>
      </div>
      
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Premium Invitations", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80" },
            { title: "Welcome Boards", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80" },
            { title: "Personalised Gifts", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80" }
          ].map((item, i) => (
            <Link key={i} href="/category/all" className="group block relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
              <img loading="lazy" src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent flex items-end justify-center p-8">
                <h3 className="text-white font-serif text-2xl tracking-wide">{item.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. CUSTOM MERCHANDISE (Masonry/Circular Layout)
export const CustomMerchSection = () => {
  return (
    <section className="py-16 bg-white border-b border-slate-100">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title="Custom Merchandise" subtitle="Wear your brand with pride" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: "Polo T-Shirts", img: "/images/cat_polo_new_1785478171451.png" },
            { name: "Cotton Tees", img: "/images/cat_tshirt_new_1785478181285.png" },
            { name: "Custom Mugs", img: "/images/cat_mugs_new_1785478141544.png" },
            { name: "Eco Packaging", img: "/images/cat_packaging_1785433687115.png" }
          ].map((item, i) => (
            <Link key={i} href="/category/all" className="group flex flex-col items-center gap-4 w-full">
              <div className="w-full aspect-square max-w-[280px] rounded-full border border-slate-200 overflow-hidden shadow-sm transition-colors bg-[#f1f1f1] flex items-center justify-center relative">
                <img loading="lazy" src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
              </div>
              <span className="text-sm sm:text-base font-bold text-slate-700 text-center leading-tight group-hover:text-[#0082CA]">{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. TOP RATED LIST VIEW
export const TopRatedSection = ({ products = [] }) => {
  return (
    <section className="py-16 bg-[#1e293b]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl sm:text-[28px] font-extrabold text-white tracking-tight">Top Rated Products</h2>
            <p className="text-sm text-slate-400 mt-1">Loved by thousands of businesses</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {products.slice(0, 4).map((p, i) => {
            const image = p?.images?.[0] || p?.images?.[0]?.url || '/images/cat_visiting_cards_new_1785478123231.png';
            const price = p?.basePrice || 499;
            return (
              <Link key={i} href="/category/all" className="group flex items-center gap-4 sm:gap-6 bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 rounded-lg p-4 sm:p-5 transition-all">
                <div className="w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden bg-slate-900 relative">
                  <img loading="lazy" src={image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={p.name} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1.5">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-slate-400 ml-1">(4.9)</span>
                  </div>
                  <h3 className="font-bold text-white text-base sm:text-lg truncate mb-1">{p.name || 'Premium Print Item'}</h3>
                  <p className="text-sm text-slate-400 truncate mb-3">{p.category?.name || 'High Quality Print'}</p>
                  <div className="text-white font-extrabold">₹{price}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
