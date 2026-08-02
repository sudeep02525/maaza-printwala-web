import React from 'react';
import Link from 'next/link';
import { Heart, Search, ChevronRight } from 'lucide-react';

import { serverApi } from '../lib/server-api.js';
import ExploreCategories from '../components/home/ExploreCategories.jsx';
import VisualCategories from '../components/home/VisualCategories.jsx';
import FaqAccordion from '../components/home/FaqAccordion.jsx';
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

export default async function HomePage() {
  const catData = await serverApi.getCategories().catch(() => ({ data: { categories: [] } }));
  const prodData = await serverApi.getFeaturedProducts().catch(() => ({ data: { products: [] } }));

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
      <ExploreCategories categories={categories} />

      {/* 5. VISUAL CATEGORY BLOCKS (VistaPrint Square Style) */}
      <VisualCategories />

      <FeaturedSlider products={bestSellers} />
      
      {/* BEST SELLING (Standard Grid) */}
      <section className="py-14 bg-[#fafafa]">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title="Best Sellers" linkText="View All Best Sellers" />
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
          <SectionHeader title="New Arrivals" subtitle="Fresh new templates and products" linkText="View All New" />
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
              <div key={i} className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
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
              <h2 className="text-[28px] font-extrabold text-slate-900 mb-8 tracking-tight">Help Center</h2>
              <div className="space-y-6">
                {BLOGS.map((blog, idx) => (
                  <Link key={idx} href="#" className="flex gap-4 group">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0 border border-slate-200">
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
              <FaqAccordion faqs={[
                { q: 'What is the standard delivery time?', a: 'Standard production takes 2-3 days, followed by 3-4 days of shipping depending on your location.' },
                { q: 'Can I get a GST invoice for my business?', a: 'Yes, you can enter your company GSTIN during checkout to receive a B2B tax invoice.' },
                { q: 'Do you verify artwork before printing?', a: 'Yes! Our pre-press team manually reviews all uploaded files for bleed, safe zones, and resolution.' },
                { q: 'What if I need bulk corporate ordering?', a: 'We offer tiered volume pricing. Please contact our corporate sales team for orders exceeding ₹50,000.' },
              ]} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
