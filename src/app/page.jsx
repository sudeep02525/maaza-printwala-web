'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Heart, ChevronRight, ChevronLeft, Search } from 'lucide-react';

import axiosInstance from '../services/axiosInstance.js';
import ProductCard from '../components/products/ProductCard.jsx';
import HeroBanner from '../components/home/HeroBanner.jsx';
import TestimonialCarousel from '../components/home/TestimonialCarousel.jsx';
import { 
  FeaturedSlider, 
  CorporateSection, 
  WeddingSection, 
  CustomMerchSection, 
  TopRatedSection 
} from '../components/home/HomeSections.jsx';

// --- MOCK DATA ---
const SHOP_BY_PRODUCT = [
  { name: 'Visiting Cards', image: '/images/cat_flyers_brochures_1785433655247.png' },
  { name: 'Flyers', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Brochure', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Letterhead', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Envelope', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Sticker', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Labels', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Packaging Box', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Mug', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Bottle', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'T-Shirt', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Hoodie', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const INDUSTRIES = [
  { name: 'Restaurant', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'School', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Hospital', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Real Estate', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Manufacturing', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Startup', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const OCCASIONS = [
  { name: 'Wedding', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Festival', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Corporate Events', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Exhibition', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const BRANDS = ['HP', 'Dell', 'Puma', 'Adidas', 'Samsung', 'Boat', 'Reliance', 'Tata'];

const POPULAR_SEARCHES = [
  'Business Cards', 'Custom Tshirt', 'Sticker Printing', 'Packaging', 'Mug Printing', 'Standee', 'Letterhead', 'ID Cards', 'Lanyards', 'Flyers', 'Brochure Design', 'Corporate Gifts'
];

const INSTAGRAM_POSTS = [
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
];

const BLOGS = [
  { title: 'Understanding Paper GSM for Business Cards', date: 'Jul 24, 2026', image: '/images/cat_visiting_cards_1785433645262.png' },
  { title: 'Top 5 Corporate Gifting Trends this Year', date: 'Jul 18, 2026', image: '/images/cat_visiting_cards_1785433645262.png' },
];

// --- HELPER COMPONENT FOR SECTION TITLES ---
const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-end mb-8">
    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
  </div>
);

export default function HomePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [canScrollExploreLeft, setCanScrollExploreLeft] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => axiosInstance.get('/products?featured=true'),
    retry: false,
  });

  const categories = catData?.data?.categories || [];
  
  // Create mock arrays for the vast number of sections by slicing the main products array
  // If the array is too short, we'll repeat it for visual completeness.
  const baseProducts = prodData?.data?.products || [];
  const getSlice = (start, length = 6) => {
    if (baseProducts.length === 0) return [];
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(baseProducts[(start + i) % baseProducts.length]);
    }
    return result;
  };

  const bestSellers = getSlice(0, 6);
  const newArrivals = getSlice(6, 6);
  const businessEssentials = getSlice(12, 6);
  const customClothing = getSlice(18, 6);
  const packaging = getSlice(24, 6);
  const marketingMaterials = getSlice(30, 6);
  const corporateGifts = getSlice(36, 6);
  const trendingProducts = getSlice(42, 6);
  const recentlyViewed = getSlice(48, 6);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
      
      {/* 3. HERO & TRUST STRIP */}
      <HeroBanner />

      {/* 4. EXPLORE ALL CATEGORIES (PrintVenue Circular Style) */}
      <section className="py-14 bg-white border-b border-slate-100">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title="Explore all categories" />
          <div className="relative group/slider mt-10">
            {canScrollExploreLeft && (
              <button 
                onClick={() => document.getElementById('explore-categories-scroll')?.scrollBy({ left: -300, behavior: 'smooth' })} 
                className="absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50"
              >
                <ChevronLeft className="w-6 h-6 text-slate-800" />
              </button>
            )}

            <div 
              id="explore-categories-scroll" 
              className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4" 
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              onScroll={(e) => setCanScrollExploreLeft(e.currentTarget.scrollLeft > 0)}
            >
              {categories.slice(0, 10).map((cat, index) => {
                const exploreImages = [
                  '/images/explore_business_cards_1785478383406.png',
                  '/images/explore_tshirts_1785478392413.png',
                  '/images/cat_visiting_cards_new_1785478123231.png',
                  '/images/cat_notebooks_new_1785478132458.png',
                  '/images/cat_clothing_new_1785478162007.png',
                  '/images/cat_mugs_new_1785478141544.png'
                ];
                const displayImage = exploreImages[index % exploreImages.length];

                return (
                  <Link key={cat._id} href={`/products?category=${cat.slug || cat._id}`} className="snap-start shrink-0 group flex flex-col items-center gap-4 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(20%-1.2rem)]">
                    <div className="w-full aspect-square max-w-[280px] rounded-full border border-slate-200 overflow-hidden shadow-sm group-hover:border-[#0082CA] transition-colors bg-[#f1f1f1] flex items-center justify-center relative">
                      <img src={displayImage} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className="text-sm sm:text-base font-bold text-slate-700 text-center leading-tight group-hover:text-[#0082CA]">{cat.name}</span>
                  </Link>
                );
              })}
            </div>

            <button 
              onClick={() => document.getElementById('explore-categories-scroll')?.scrollBy({ left: 300, behavior: 'smooth' })} 
              className="absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50"
            >
              <ChevronRight className="w-6 h-6 text-slate-800" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. VISUAL CATEGORY BLOCKS (VistaPrint Square Style) */}
      <section className="py-14 bg-[#fafafa]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 space-y-16">
          
          {/* Business Essentials Block */}
          <div>
            <SectionHeader title="Business Essentials" linkText="" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {[
                { name: 'Visiting Cards', img: '/images/cat_visiting_cards_new_1785478123231.png' },
                { name: 'Notebooks', img: '/images/cat_notebooks_new_1785478132458.png' },
                { name: 'Custom Mugs', img: '/images/cat_mugs_new_1785478141544.png' },
                { name: 'Custom Clothing, Bags & Caps', img: '/images/cat_clothing_new_1785478162007.png' }
              ].map((item, i) => (
                <Link key={i} href="/products" className="group flex flex-col gap-3">
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                </Link>
              ))}
            </div>
          </div>

          {/* Love your new look Block */}
          <div>
            <SectionHeader title="Love your new look" linkText="" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
              {[
                { name: 'Custom Polo T-shirts', img: '/images/cat_polo_new_1785478171451.png' },
                { name: 'Custom T-shirts', img: '/images/cat_tshirt_new_1785478181285.png' },
                { name: 'Custom Formal Shirts', img: '/images/cat_formal_new_1785478190948.png' },
                { name: 'Custom Caps', img: '/images/cat_caps_new_1785478209032.png' }
              ].map((item, i) => (
                <Link key={i} href="/products" className="group flex flex-col gap-3">
                  <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden shadow-sm border border-slate-200 relative">
                    <img src={item.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      <FeaturedSlider products={bestSellers} />
      
      {/* BEST SELLING (Standard Grid) */}
      <section className="py-14 bg-[#fafafa]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title="Best Selling Prints" linkText="View All Best Sellers" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((p, i) => <ProductCard key={`bs-${p._id || 'x'}-${i}`} product={p} />)}
          </div>
        </div>
      </section>

      <CorporateSection products={businessEssentials} />
      <WeddingSection />
      <CustomMerchSection />
      
      {/* RECENTLY ADDED (Standard Grid with 'New' implication) */}
      <section className="py-14 bg-[#fafafa]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title="Recently Added" subtitle="Fresh new templates and products" linkText="View All New" />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.map((p, i) => <ProductCard key={`new-${p._id || 'x'}-${i}`} product={p} />)}
          </div>
        </div>
      </section>

      <TopRatedSection products={trendingProducts} />

      {/* 17. POPULAR SEARCHES (SEO) */}
      <section className="py-14 bg-[#fafafa]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title="Popular Searches" />
          <div className="flex flex-wrap gap-3">
            {POPULAR_SEARCHES.map((search, i) => (
              <Link key={i} href={`/products?search=${encodeURIComponent(search)}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm rounded-full hover:border-[#0082CA] hover:text-[#0082CA] hover:shadow-sm transition-all">
                <Search className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                {search}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 18. CUSTOMER GALLERY */}
      <section className="py-14 bg-white border-y border-slate-100">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">Customer Gallery</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">Tag us on Instagram <span className="font-bold text-[#0082CA]">@MaazaPrintwala</span> to get featured.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {INSTAGRAM_POSTS.map((img, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden group border border-slate-200">
                <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Gallery" />
                <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Heart className="w-8 h-8 text-white fill-white shadow-sm" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 19. WHY CHOOSE US & PROCESS (Testimonials) */}
      <TestimonialCarousel />

      {/* 20. BLOG & FAQ */}
      <section className="py-14 bg-white">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Blog */}
            <div>
              <h2 className="text-[28px] font-extrabold text-slate-900 mb-8 tracking-tight">Print Knowledge Base</h2>
              <div className="space-y-6">
                {BLOGS.map((blog, idx) => (
                  <Link key={idx} href="#" className="flex gap-4 group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                      <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt="Blog" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="text-[10px] font-extrabold text-[#0082CA] uppercase tracking-wider">{blog.date}</span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1 group-hover:text-[#0082CA] transition-colors leading-tight">{blog.title}</h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 font-medium">Learn the best practices for commercial printing and ensure your brand looks professional.</p>
                    </div>
                  </Link>
                ))}
              </div>
              <button className="mt-8 text-sm font-bold text-[#0082CA] hover:underline flex items-center gap-1">Read All Articles <ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* FAQ */}
            <div>
              <h2 className="text-[28px] font-extrabold text-slate-900 mb-8 tracking-tight">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {[
                  { q: 'What is the standard delivery time?', a: 'Standard production takes 2-3 days, followed by 3-4 days of shipping depending on your location.' },
                  { q: 'Can I get a GST invoice for my business?', a: 'Yes, you can enter your company GSTIN during checkout to receive a B2B tax invoice.' },
                  { q: 'Do you verify artwork before printing?', a: 'Yes! Our pre-press team manually reviews all uploaded files for bleed, safe zones, and resolution.' },
                  { q: 'What if I need bulk corporate ordering?', a: 'We offer tiered volume pricing. Please contact our corporate sales team for orders exceeding ₹50,000.' },
                ].map((faq, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                    <button onClick={() => setActiveFaq(activeFaq === idx ? null : idx)} className="w-full p-5 text-left font-bold text-slate-900 flex justify-between items-center text-sm hover:bg-slate-50 transition-colors">
                      {faq.q}
                      <ChevronRight className={`w-4 h-4 transition-transform ${activeFaq === idx ? 'rotate-90 text-[#0082CA]' : 'text-slate-400'}`} />
                    </button>
                    {activeFaq === idx && (
                      <div className="px-5 pb-5 text-sm text-slate-600 font-medium leading-relaxed border-t border-slate-100 pt-4 bg-slate-50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
