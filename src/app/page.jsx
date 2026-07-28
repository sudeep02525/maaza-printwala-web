'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Clock,
  Palette,
  FileText,
  Layers,
  Award,
  HelpCircle,
  Star,
  PhoneCall,
  Search,
  Zap,
  Package,
  Gift,
  Briefcase,
  ChevronRight,
  Check,
  Percent,
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import ProductCard from '../components/products/ProductCard.jsx';

// Sample background imagery for full-bleed categories if not provided by backend
const CATEGORY_FALLBACK_IMAGES = {
  'business-cards': 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
  'standard-visiting-cards': 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
  'pvc-id-cards': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'marketing-signage': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
  'flex-banners': 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80',
  'roll-up-standees': 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
  'custom-apparel': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
  't-shirts': 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=600&q=80',
  'ceramic-mugs': 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
  'flyers-brochures': 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
};

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);

  // 1. Fetch Dynamic Categories from API
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Featured Products from API
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => axiosInstance.get('/products?featured=true'),
    retry: false,
  });

  // 3. Fetch Ready-Made Templates from API
  const { data: tmplData, isLoading: tmplLoading } = useQuery({
    queryKey: ['templates-featured'],
    queryFn: () => axiosInstance.get('/templates'),
    retry: false,
  });

  const categories = catData?.data?.categories || [];
  const products = prodData?.data?.products || [];
  const templates = tmplData?.data?.templates || [];

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How does Maaza Printwala verify my print artwork quality?',
      a: 'Every custom design uploaded undergoes a mandatory pre-press resolution and bleed check by our print specialists. If your file is below 300 DPI or missing critical CMYK safety margins, our team notifies you before starting press run to ensure razor-sharp output.',
    },
    {
      q: 'What is the estimated turnaround time for bulk commercial printing?',
      a: 'Standard print production takes 24 to 48 hours following artwork approval. Nationwide delivery via reliable courier partners takes 5-7 business days, while Express Metro shipping delivers in 2-3 business days.',
    },
    {
      q: 'Can I get GST invoices with input tax credit for corporate orders?',
      a: 'Yes! Simply enter your 15-digit business GSTIN and corporate company name during checkout. You will receive a tax-compliant commercial invoice instantly upon dispatch for seamless Input Tax Credit (ITC) claim.',
    },
    {
      q: 'What if I do not have ready-made print artwork?',
      a: 'No worries! You can select from our professionally curated Ready-Made Design Templates. Simply customize your company name, designation, and logo using our interactive online configurator.',
    },
  ];

  return (
    <div className="space-y-16 lg:space-y-24 select-none pb-20 bg-[#F8FAFC]">
      {/* 1. HERO SECTION: Left Copy + Search Bar + Right 3D Product Collage */}
      <section className="relative bg-gradient-to-br from-slate-900 via-[#0F172A] to-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800 shadow-2xl">
        {/* Subtle CMYK Accent Gradients */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: High-Impact Typography & Search */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>India ki Apni Online Printing Press</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white">
                Professional Print <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-amber-300">
                  Made Seamless.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal mx-auto lg:mx-0">
                Explore our commercial print catalog. Configure paper GSM, sizes, and finishes with live upfront volume pricing, then upload your print-ready artwork or customize professional templates.
              </p>

              {/* Interactive Search Bar */}
              <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto lg:mx-0 pt-2">
                <div className="relative flex items-center shadow-2xl rounded-xl overflow-hidden p-1.5 bg-white/10 backdrop-blur-md border border-white/20 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-400/30 transition-all">
                  <Search className="w-5 h-5 text-slate-400 ml-3.5 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search Visiting Cards, Flex Banners, T-Shirts, Letterheads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2.5 bg-transparent text-white placeholder-slate-400 text-sm focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm px-6 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <span>Search</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Quick Category Pills */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs font-semibold text-slate-300">
                <span className="text-slate-400 mr-1">Popular:</span>
                <Link href="/products?category=business-cards" className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors">
                  Visiting Cards
                </Link>
                <Link href="/products?category=flex-banners" className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors">
                  Flex Banners
                </Link>
                <Link href="/products?category=t-shirts" className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors">
                  Cotton T-Shirts
                </Link>
                <Link href="/products?category=pvc-id-cards" className="px-3 py-1 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 rounded-full transition-colors">
                  PVC ID Badges
                </Link>
              </div>

              {/* Pre-Press Assurances */}
              <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-semibold text-slate-400">
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Upfront Volume Discounts</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Staff Pre-Press Verification</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Pan-India Express Shipping</span>
              </div>
            </div>

            {/* Right Column: High-Density 3D Floating Product Collage */}
            <div className="lg:col-span-5 relative">
              <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center">
                {/* Background Glow */}
                <div className="absolute inset-4 bg-gradient-to-tr from-blue-600/30 to-amber-500/20 rounded-full blur-2xl animate-pulse"></div>

                {/* Grid Collage of Print Products */}
                <div className="relative z-10 grid grid-cols-2 gap-4 p-4 transform -rotate-2 hover:rotate-0 transition-transform duration-700">
                  
                  {/* Item 1: Business Cards */}
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 transform hover:-translate-y-1 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=400&q=80"
                      alt="Business Cards"
                      className="w-full h-32 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Visiting Cards</span>
                      <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">300 GSM</span>
                    </div>
                  </div>

                  {/* Item 2: Outdoor Banner */}
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 transform translate-y-6 hover:translate-y-4 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=400&q=80"
                      alt="Flex Banner"
                      className="w-full h-32 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Flex Banners</span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-1.5 py-0.5 rounded">Weatherproof</span>
                    </div>
                  </div>

                  {/* Item 3: Custom T-Shirt */}
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 transform -translate-y-2 hover:-translate-y-3 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"
                      alt="Cotton T-Shirts"
                      className="w-full h-32 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">Cotton T-Shirts</span>
                      <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">100% Combed</span>
                    </div>
                  </div>

                  {/* Item 4: PVC ID Badge */}
                  <div className="bg-white p-3 rounded-2xl shadow-2xl border border-white/20 transform translate-y-3 hover:translate-y-1 transition-all duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400&q=80"
                      alt="PVC ID Badges"
                      className="w-full h-32 object-cover rounded-xl mb-2"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">PVC ID Cards</span>
                      <span className="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded">Contactless</span>
                    </div>
                  </div>

                </div>

                {/* Floating Assurance Badge */}
                <div className="absolute -bottom-2 -left-4 bg-white text-slate-900 px-4 py-3 rounded-2xl shadow-2xl border border-slate-200 flex items-center gap-3 z-20 animate-bounce">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-black">100% Quality Checked</p>
                    <p className="text-[10px] text-slate-500 font-medium">Pre-Press DPI & Bleed Verified</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROMOTIONAL STRIP: Corporate Bulk & Trust Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-20">
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-6 shadow-xl text-white border border-blue-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-amber-400 shrink-0">
              <Gift className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-300 block">Enterprise Offer</span>
              <h3 className="text-lg sm:text-xl font-black">Corporate Bulk Printing: Get Flat 20% Off</h3>
              <p className="text-xs text-slate-300 mt-0.5">Automated tier breaks apply directly in your shopping cart for orders above ₹5,000.</p>
            </div>
          </div>
          <Link href="/products" className="w-full md:w-auto shrink-0">
            <Button variant="outline" size="md" className="w-full md:w-auto bg-white text-slate-900 hover:bg-slate-100 font-black border-none shadow-md px-6">
              <span>View Volume Discounts</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. POPULAR CATEGORIES GRID: Large Full-Bleed Image Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Catalogue Navigation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Explore Print Categories</h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a category to view specifications, paper materials, and volume price tiers.
            </p>
          </div>
          <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors shrink-0">
            <span>View Complete Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-72 rounded-2xl" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-base font-bold">No print categories found.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((cat) => {
              const catSlug = cat.slug || cat._id;
              const fallbackImg = CATEGORY_FALLBACK_IMAGES[catSlug] || 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80';

              return (
                <Link
                  key={cat._id}
                  href={`/products?category=${catSlug}`}
                  className="group relative h-72 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-200 block"
                >
                  <img
                    src={cat.image || fallbackImg}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 mb-1">Commercial Press</span>
                    <h3 className="text-xl font-black group-hover:text-blue-300 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-1.5 font-normal leading-relaxed opacity-90">
                      {cat.description || 'Professional commercial printing specifications.'}
                    </p>
                    <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-xs font-bold text-blue-300 group-hover:text-white transition-colors">
                      <span>Explore Specs</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. TRENDING PRINT CATALOGUE: 4-Column High-Density Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200/80 pb-5">
          <div>
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Instant Online Pricing</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Trending Commercial Products</h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a product to customize GSM paper stock, dimensions, and finishes with live automated volume discounts.
            </p>
          </div>
          <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors shrink-0">
            <span>View All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {prodLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-96 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-slate-400" />
            <p className="text-base font-bold">No featured products currently active.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {products.slice(0, 8).map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        )}
      </section>

      {/* 5. BUSINESS SOLUTIONS: Solid Colored Blocks for Corporate & B2B Orders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Enterprise Capabilities</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Tailored For Indian Businesses</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Whether you are a startup needing employee onboarding kits or an enterprise printing nationwide marketing collateral, we provide dedicated support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Block 1: Corporate Gifting */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between group hover:border-blue-500/40 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                <Briefcase className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-blue-400 transition-colors">
                Corporate Employee Kits
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                Curate custom onboarding kits including PVC ID badges, branded lanyards, letterheads, and photo mugs with employee name personalization.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-blue-400">
              <Link href="/products?category=business-cards">Explore Corporate Catalog →</Link>
            </div>
          </div>

          {/* Block 2: Agency Partner Program */}
          <div className="bg-gradient-to-br from-blue-900 to-indigo-950 text-white p-8 rounded-3xl shadow-xl border border-blue-800 flex flex-col justify-between group hover:border-blue-400/50 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 text-amber-300 flex items-center justify-center border border-white/20">
                <Percent className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-amber-300 transition-colors">
                Agency & Reseller Program
              </h3>
              <p className="text-xs text-blue-100 leading-relaxed font-normal">
                Are you an advertising agency or freelance designer? Get priority prepress checks, white-label packaging, and volume wholesale tiers.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-blue-800/80 flex items-center justify-between text-xs font-bold text-amber-300">
              <Link href="/products">View Volume Tiers →</Link>
            </div>
          </div>

          {/* Block 3: Nationwide Dispatch */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-8 rounded-3xl shadow-xl border border-slate-800 flex flex-col justify-between group hover:border-emerald-500/40 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">
                Pan-India Express Dispatch
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-normal">
                We deliver across 20,000+ PIN codes in India. Select Express Metro shipping during checkout for guaranteed 2-3 business day doorstep arrival.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-emerald-400">
              <Link href="/checkout">Check Shipping Rules →</Link>
            </div>
          </div>

        </div>
      </section>

      {/* 6. READY-MADE TEMPLATES: Interactive Visual Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-md space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">No Design? No Problem</span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Ready-Made Design Templates</h2>
              <p className="text-sm text-slate-600 mt-1">
                Select a professionally curated template and customize your company name, designation, and contact details instantly.
              </p>
            </div>
            <Link href="/products" className="text-sm font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 shrink-0">
              <span>View All Templates</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {tmplLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-2xl">
              <Palette className="w-10 h-10 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-semibold">Templates loading from product schemas...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {templates.slice(0, 3).map((tmpl) => (
                <div key={tmpl._id} className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 hover:shadow-lg transition-all flex flex-col justify-between group">
                  <div>
                    <div className="aspect-16/10 bg-white rounded-xl overflow-hidden mb-4 border border-slate-200 shadow-xs relative">
                      <img
                        src={tmpl.previewFront || tmpl.thumbnail || 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80'}
                        alt={tmpl.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-slate-900/90 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        Editable Template
                      </span>
                    </div>
                    <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tmpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Includes dynamic fields for {tmpl.editableFields?.length || 4} custom brand parameters.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Free to Customize</span>
                    <Link href={`/products`}>
                      <Button variant="outline" size="sm" className="text-xs border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                        Select Template →
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 7. WHY CHOOSE US: Pre-Press Quality Assurance Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">The Maaza Advantage</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Enterprise Quality Assurance</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every order printed at Maaza Printwala goes through rigorous multi-stage prepress and physical quality checks before dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center space-y-4 hover:shadow-xl transition-shadow bg-white border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 mx-auto flex items-center justify-center font-bold">
              <Zap className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">300 DPI Pre-Press Check</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Our print staff verify your uploaded artwork resolution and CMYK color profiles before plate making.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 hover:shadow-xl transition-shadow bg-white border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center font-bold">
              <Percent className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Automated Volume Breaks</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Our server-authoritative pricing engine applies up to 35% bulk discount automatically as your pack size increases.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 hover:shadow-xl transition-shadow bg-white border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 mx-auto flex items-center justify-center font-bold">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Premium GSM Stocks</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              We never use flimsy paper. From 300 GSM cardstock to 440 GSM star flex, we print on industry-standard substrates.
            </p>
          </Card>

          <Card className="p-6 text-center space-y-4 hover:shadow-xl transition-shadow bg-white border-slate-200/80">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center font-bold">
              <Truck className="w-7 h-7" />
            </div>
            <h3 className="text-base font-black text-slate-900">Pan-India Doorstep Delivery</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-normal">
              Integrated with top courier networks for secure, weatherproof boxed packaging and timely dispatch across India.
            </p>
          </Card>
        </div>
      </section>

      {/* 8. CUSTOMER REVIEWS & FAQ ACCORDION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-md space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">Common Questions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
            <p className="text-sm text-slate-600">Everything you need to know about artwork specs, GST invoices, and delivery.</p>
          </div>

          <div className="space-y-4 pt-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="border border-slate-200 rounded-2xl overflow-hidden transition-all bg-slate-50/50 hover:bg-slate-50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base">{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 shrink-0 transform transition-transform ${activeFaq === idx ? 'rotate-90 bg-blue-600 text-white border-blue-600' : ''}`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 bg-white">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
