'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Layers,
  Search,
  Package,
  ChevronRight,
  Printer,
  CheckCircle2,
  Award,
  FileText,
} from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import ProductCard from '../components/products/ProductCard.jsx';

// Official studio fallback imagery for commercial print categories
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

// High-quality commercial print fallback templates for rich marketplace presentation
const SAMPLE_TEMPLATES = [
  {
    _id: 'sample-tmpl-1',
    templateName: 'Corporate Executive Visiting Card',
    description: '300 GSM Matte card with customizable company logo, employee designation, and QR code field.',
    previewImage: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
    category: 'Business Cards',
  },
  {
    _id: 'sample-tmpl-2',
    templateName: 'Enterprise Letterhead & Stationery',
    description: '100 GSM Bond paper layout with header grid, GSTIN footer placeholder, and watermark support.',
    previewImage: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
    category: 'Corporate Stationery',
  },
  {
    _id: 'sample-tmpl-3',
    templateName: 'Commercial Roll-up Standee Banner',
    description: 'Star flex 330 GSM promotional layout with high-impact headline and exhibit call-to-action.',
    previewImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80',
    category: 'Marketing Signage',
  },
  {
    _id: 'sample-tmpl-4',
    templateName: 'Staff ID & Lanyard Badge Layout',
    description: 'PVC durable card layout with employee portrait box, barcode identifier, and blood group tag.',
    previewImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    category: 'PVC ID Cards',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaq, setActiveFaq] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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

  // 4. Fetch CMS Homepage Section Configuration (with modular fallback)
  const { data: cmsData } = useQuery({
    queryKey: ['cms-homepage-sections'],
    queryFn: () => axiosInstance.get('/cms/homepage'),
    retry: false,
  });

  const categories = catData?.data?.categories || [];
  const products = prodData?.data?.products || [];
  const fetchedTemplates = tmplData?.data?.templates || [];
  
  // Ensure we display rich template catalogue items even when API returns empty
  const templates = fetchedTemplates.length > 0 ? fetchedTemplates : SAMPLE_TEMPLATES;

  // Modular CMS Section Schema (Enforcing Admin visibility & order control)
  const defaultCmsSections = [
    { id: 'hero', enabled: true, order: 1, title: 'Hero Commercial Presentation' },
    { id: 'offer-strip', enabled: true, order: 2, title: 'Announcement Strip', subtitle: 'Corporate printing and bulk orders available nationwide' },
    { id: 'categories', enabled: true, order: 3, title: 'Popular Commercial Categories', subtitle: 'Explore high-density print solutions by industry sector' },
    { id: 'templates', enabled: true, order: 4, title: 'Featured Customizable Templates', subtitle: 'Select an editable layout and customize online in seconds' },
    { id: 'trending', enabled: true, order: 5, title: 'Trending Print Catalogue', subtitle: 'Server-authoritative volume rates for commercial accounts' },
    { id: 'business-solutions', enabled: true, order: 6, title: 'Enterprise Business Solutions', subtitle: 'Dedicated corporate support, API invoicing, and custom substrates' },
    { id: 'showcase', enabled: true, order: 7, title: 'Our Recent Print Projects', subtitle: 'Authentic customer print samples and commercial deliverables' },
    { id: 'quality-pillars', enabled: true, order: 8, title: 'Why Choose Maaza Printwala', subtitle: 'Manual staff pre-press checks and reliable courier logistics' },
    { id: 'faq', enabled: true, order: 9, title: 'Frequently Asked Questions', subtitle: 'Everything you need to know about corporate ordering and specifications' },
  ];

  const cmsSections = useMemo(() => {
    if (!isMounted) return defaultCmsSections;
    const fetched = cmsData?.data?.sections || defaultCmsSections;
    return [...fetched].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
  }, [isMounted, cmsData]);

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
      q: 'How does Maaza Printwala verify my print artwork safe zones?',
      a: 'Every custom design uploaded undergoes a manual pre-press boundary check by our print specialists. If your file requires margin adjustments or safe-zone alignment, our team notifies you before starting press run to ensure clean output.',
    },
    {
      q: 'What is the standard turnaround timeline for commercial print runs?',
      a: 'Standard print production is scheduled immediately following artwork verification. Dispatch via reliable nationwide courier partners typically takes 5-7 business days depending on delivery destination.',
    },
    {
      q: 'Can I get GST commercial invoices for corporate account orders?',
      a: 'Yes! Simply enter your 15-digit business GSTIN and corporate company name during checkout. You will receive a tax-compliant commercial invoice upon order registration for business accounting.',
    },
    {
      q: 'What if I do not have ready-made graphic artwork?',
      a: 'No worries! You can select from our curated Ready-Made Design Templates. Simply customize text fields and logo placeholders using our interactive online configurator.',
    },
  ];

  // Render Section Helper (Timeless, product-first commercial printing architecture)
  const renderSection = (sectionId) => {
    switch (sectionId) {
      case 'hero':
        return (
          <section key="hero" className="bg-white text-slate-900 border-b border-slate-200 py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left Column: Calm Enterprise Headline, Supporting Copy, Search & Actions */}
                <div className="lg:col-span-7 space-y-6 text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                    <span>Commercial B2B &amp; B2C Printing Press</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                    Custom Printing for Every Business & Brand
                  </h1>

                  <p className="text-sm sm:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
                    Direct manufacturer rates for high-density business cards, corporate stationery, promotional packaging, and custom apparel. Guaranteed specification accuracy and nationwide courier dispatch.
                  </p>

                  {/* Real Search Bar inside Hero */}
                  <form onSubmit={handleSearchSubmit} className="max-w-xl pt-1">
                    <div className="relative flex items-center bg-[#F7F8FA] border border-slate-300 rounded-lg p-1.5 focus-within:border-[#0082CA] focus-within:bg-white transition-colors">
                      <Search className="w-5 h-5 text-slate-400 ml-3 mr-2 shrink-0" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search business cards, brochures, promotional banners, packaging..."
                        className="w-full bg-transparent py-2.5 pr-4 text-sm text-slate-900 placeholder-slate-400 focus:outline-none font-medium"
                      />
                      <button
                        type="submit"
                        className="bg-[#0082CA] hover:bg-[#0068A2] text-white font-semibold rounded px-6 py-2.5 text-xs shrink-0 transition-colors"
                      >
                        Search
                      </button>
                    </div>
                  </form>

                  {/* Primary & Secondary CTAs */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <Link href="/products">
                      <span className="inline-flex items-center justify-center bg-[#0082CA] hover:bg-[#0068A2] text-white font-semibold rounded-md px-6 py-3 text-sm transition-colors">
                        Browse Print Catalogue
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </span>
                    </Link>
                    <Link href="/products">
                      <span className="inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-md px-6 py-3 text-sm transition-colors">
                        Upload Custom Artwork
                      </span>
                    </Link>
                  </div>

                  {/* Popular Categories Links */}
                  <div className="pt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider mr-1">Popular:</span>
                    {['Business Cards', 'Packaging', 'Corporate Stationery', 'Brochures', 'Promotional Kits'].map((term, i) => (
                      <Link
                        key={i}
                        href={`/products?search=${encodeURIComponent(term)}`}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-[#0082CA] text-slate-700 hover:text-white rounded font-medium transition-colors"
                      >
                        {term}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Right Column: One Large Premium Commercial Printing Lifestyle Image */}
                <div className="lg:col-span-5 flex items-center justify-center">
                  <div className="w-full aspect-4/3 rounded-lg border border-slate-200 overflow-hidden relative bg-slate-100 shadow-sm">
                    <img
                      src="https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=1200&q=80"
                      alt="Real Commercial Setup: Business Cards, Brochures, Packaging Boxes & Custom Mugs"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-5 text-left">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300 block">Real Commercial Setup</span>
                      <p className="text-sm font-bold text-white">Business Cards, Brochures, Packaging Boxes &amp; Mugs</p>
                      <p className="text-xs text-slate-300 mt-0.5">300 GSM Art Cards • Rigid Packaging • Custom Substrates</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'offer-strip':
        return (
          <div key="offer-strip" className="bg-slate-100 text-slate-800 text-xs py-2.5 px-4 border-b border-slate-200">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2 font-medium">
                <Printer className="w-4 h-4 text-[#0082CA] shrink-0" />
                <span>Commercial Bulk Orders: Tiered Volume Pricing &amp; GST Invoicing Supported Nationwide</span>
              </div>
              <Link href="/products" className="text-[#0082CA] hover:underline font-bold flex items-center gap-1 transition-colors">
                <span>View Complete Catalogue</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        );

      case 'categories':
        return (
          <section key="categories" className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                  Catalogue Directory
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Popular Print Categories</h2>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0082CA] hover:underline"
              >
                <span>Browse All Categories</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!isMounted || catLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-64 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.slice(0, 8).map((cat) => {
                  const slug = cat.slug || cat._id;
                  const bgImage = cat.image || CATEGORY_FALLBACK_IMAGES[slug] || CATEGORY_FALLBACK_IMAGES['business-cards'];
                  return (
                    <Link
                      key={cat._id}
                      href={`/products?category=${slug}`}
                      className="group bg-white rounded-lg border border-slate-200 hover:border-slate-400 overflow-hidden transition-colors flex flex-col justify-between"
                    >
                      <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                        <img
                          src={bgImage}
                          alt={cat.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                        />
                      </div>
                      <div className="p-4 flex items-center justify-between bg-white border-t border-slate-100">
                        <div>
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">Category</span>
                          <h3 className="font-bold text-slate-900 text-sm group-hover:text-[#0082CA] transition-colors">
                            {cat.name}
                          </h3>
                        </div>
                        <span className="text-slate-400 group-hover:text-[#0082CA] font-bold text-base transition-colors">
                          &rarr;
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>
        );

      case 'templates':
        return (
          <section key="templates" className="py-8 lg:py-10 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                    Online Configurator Ready
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Featured Customizable Templates</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Select a professionally designed layout and edit your company name, designation, and logo online.
                  </p>
                </div>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#0082CA] hover:underline"
                >
                  <span>View Template Library</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!isMounted || tmplLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {templates.slice(0, 4).map((tmpl) => (
                    <div
                      key={tmpl._id}
                      className="group bg-white rounded-lg border border-slate-200 hover:border-slate-400 transition-colors flex flex-col justify-between overflow-hidden"
                    >
                      <div className="aspect-16/10 bg-slate-100 relative overflow-hidden">
                        {tmpl.previewImage ? (
                          <img src={tmpl.previewImage} alt={tmpl.templateName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                            <Layers className="w-8 h-8 mb-1 stroke-1" />
                            <span className="text-xs font-medium">{tmpl.templateName}</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                          Editable Layout
                        </span>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0082CA] transition-colors truncate">
                            {tmpl.templateName}
                          </h4>
                          <p className="text-xs text-slate-600 line-clamp-2 mt-1 font-normal">
                            {tmpl.description || 'Configurable corporate presentation layout.'}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-500 uppercase">Custom Fields</span>
                          <Link href="/products">
                            <span className="text-xs font-semibold text-[#0082CA] hover:underline flex items-center gap-1">
                              Customize &rarr;
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'trending':
        return (
          <section key="trending" className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                  Server-Authoritative Pricing
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Trending Commercial Products</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">
                  High-density catalogue display with quantity breaks and instant online valuation.
                </p>
              </div>
              <Link
                href="/products"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#0082CA] hover:underline"
              >
                <span>View Complete Catalogue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {!isMounted || prodLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                  <Skeleton key={i} className="h-72 rounded-lg" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <Card className="p-8 text-center text-slate-500 text-xs">
                Catalogue items are currently being loaded. Please visit our products page to view all available printing categories.
              </Card>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                {products.slice(0, 10).map((prod) => (
                  <ProductCard key={prod._id} product={prod} />
                ))}
              </div>
            )}
          </section>
        );

      case 'business-solutions':
        return (
          <section key="business-solutions" className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white text-slate-900 rounded-2xl p-8 sm:p-12 border border-slate-200 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4 text-left">
                <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#0082CA] uppercase tracking-wider border border-blue-100">
                  Corporate Accounts &amp; Resellers
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
                  Enterprise Commercial Printing Solutions
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal max-w-2xl">
                  We support corporate onboarding kits, agency reseller tiers, and multi-branch distribution across India. Experience dedicated staff review and tax-compliant invoicing.
                </p>
                <div className="pt-1 flex flex-wrap gap-4 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0082CA]" />
                    <span>Tiered Volume Breaks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0082CA]" />
                    <span>Dedicated Staff QC</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#0082CA]" />
                    <span>15-Digit GSTIN ITC Support</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-end gap-3">
                <Link href="/products" className="w-full">
                  <span className="inline-flex items-center justify-center w-full bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold rounded-xl py-3.5 px-6 text-sm transition-colors shadow-xs">
                    Explore Corporate Catalogue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </Link>
                <Link href="/products" className="w-full">
                  <span className="inline-flex items-center justify-center w-full border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl py-3.5 px-6 text-sm transition-colors">
                    Request Volume Quotation
                  </span>
                </Link>
              </div>
            </div>
          </section>
        );

      case 'showcase':
        return (
          <section key="showcase" className="py-8 lg:py-10 bg-white border-y border-slate-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                    Commercial Output Gallery
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Our Recent Print Projects</h2>
                  <p className="text-xs text-slate-600 mt-0.5 font-normal">
                    Authentic commercial print samples manufactured across India. We deliver high-density color reproduction and careful packaging.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Corporate Conference Collateral',
                    tag: '300 GSM Art Card & Lanyards',
                    img: 'https://images.unsplash.com/photo-1542744094-3a3e2203538c?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Employee Onboarding Apparel',
                    tag: 'Combed Cotton & Screen Print',
                    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Executive Presentation Kits',
                    tag: 'Spot UV Visiting Cards',
                    img: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Custom Product Packaging Boxes',
                    tag: '350 GSM Matte Laminated Rigid Box',
                    img: 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Weatherproof Outdoor Signage',
                    tag: 'Polycarbonate Flex Vinyl Banner',
                    img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
                  },
                  {
                    title: 'Corporate Catalogues & Booklets',
                    tag: 'Multi-page Saddle Stitch Booklet',
                    img: 'https://images.unsplash.com/photo-1589330694653-ded6df03f754?auto=format&fit=crop&w=600&q=80',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="group bg-white rounded-lg border border-slate-200 hover:border-slate-400 overflow-hidden transition-colors flex flex-col justify-between">
                    <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-2.5 left-2.5 bg-slate-900 text-white text-[10px] font-semibold px-2 py-0.5 rounded">
                        {item.tag}
                      </div>
                    </div>
                    <div className="p-4 bg-white border-t border-slate-100">
                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#0082CA] transition-colors">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Commercial press run completed with standard quality assurance.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'quality-pillars':
        return (
          <section key="quality-pillars" className="py-8 lg:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                  Commercial Printing Standards
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Why Choose Maaza Printwala</h2>
                <p className="text-xs text-slate-600 mt-0.5 font-normal">
                  We engineer every customer interaction to help you discover, understand, customize, and purchase professional print products.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Manual Staff Review',
                  desc: 'Every custom design uploaded undergoes pre-press verification by our staff to check basic safe zones before press run.',
                },
                {
                  icon: Layers,
                  title: 'API-Driven Substrates',
                  desc: 'Dynamic specification selection for 300 GSM cards, weatherproof flex banners, and combed cotton apparel.',
                },
                {
                  icon: Truck,
                  title: 'Pan-India Dispatch',
                  desc: 'Careful packaging and logistics integration delivering across major commercial hubs and metros in India.',
                },
                {
                  icon: Award,
                  title: 'Server-Authoritative',
                  desc: '100% server-verified pricing rules and GST valuation ensuring commercial security and invoice compliance.',
                },
              ].map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div key={idx} className="bg-white p-4 sm:p-5 rounded-lg border border-slate-200 hover:border-slate-400 transition-colors space-y-3 flex flex-col justify-between">
                    <div>
                      <div className="w-9 h-9 rounded bg-slate-100 text-[#0F172A] flex items-center justify-center mb-3">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{pillar.title}</h3>
                      <p className="text-xs text-slate-600 font-normal leading-relaxed mt-1">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );

      case 'faq':
        return (
          <section key="faq" className="py-8 lg:py-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="text-left border-b border-slate-200 pb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#0082CA] block mb-1">
                Clear &amp; Transparent
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
              <p className="text-xs text-slate-600 mt-0.5 font-normal">
                Everything you need to know about commercial ordering, file preparation, and tax invoices.
              </p>
            </div>

            <div className="space-y-2.5">
              {faqs.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-lg border border-slate-200 overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-4 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors text-xs sm:text-sm"
                    >
                      <span>{faq.q}</span>
                      <div className="w-5 h-5 rounded bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                        <ChevronRight className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 pt-1 text-xs text-slate-600 font-normal leading-relaxed border-t border-slate-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 select-none pb-16 bg-[#F7F8FA]">
      {/* Dynamically render CMS modular sections sorted by authoritative order */}
      {cmsSections.map((section) => renderSection(section.id))}
    </div>
  );
}

