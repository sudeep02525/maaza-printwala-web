'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Upload, LayoutTemplate, CheckCircle2, Package, ShieldCheck, Truck, RefreshCw, Award, HelpCircle, ChevronDown, Grid, Sparkles, Building2, Store, Gift, Calendar } from 'lucide-react';
import axiosInstance from '../services/axiosInstance.js';
import Button from '../components/ui/Button.jsx';
import Card from '../components/ui/Card.jsx';
import Badge from '../components/ui/Badge.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Homepage() {
  const [openFaq, setOpenFaq] = useState(null);

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: () => axiosInstance.get('/products?featured=true'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const categories = catData?.data?.categories || [];
  const products = prodData?.data?.products || [];

  const businessNeeds = [
    { title: 'Startup Essentials', desc: 'Business cards, corporate letterheads, and ID cards.', icon: <Building2 className="w-6 h-6 text-[#0A58CA]" />, href: '/products?category=business-cards' },
    { title: 'Retail & Shop Signage', desc: 'Durable vinyl banners, store displays, and posters.', icon: <Store className="w-6 h-6 text-[#D63384]" />, href: '/products?category=marketing-signage' },
    { title: 'Corporate Gifting', desc: 'Custom printed apparel, mugs, and branded merchandise.', icon: <Gift className="w-6 h-6 text-amber-600" />, href: '/products?category=custom-apparel' },
    { title: 'Events & Conferences', desc: 'Roll-up banners, brochures, and promotional flyers.', icon: <Calendar className="w-6 h-6 text-emerald-600" />, href: '/products' },
  ];

  const faqs = [
    {
      q: 'What artwork file formats are accepted?',
      a: 'We accept standard commercial print file formats including print-ready PDF, Adobe Illustrator (.ai), Adobe Photoshop (.psd), and high-resolution PNG or JPEG files. For best results, we recommend vector PDFs with fonts outlined.',
    },
    {
      q: 'How does the volume discount calculation work?',
      a: 'Our server-calculated pricing engine automatically applies tiered quantity breaks. As you increase the order quantity in the configurator, the per-unit price automatically decreases based on our authoritative business rules.',
    },
    {
      q: 'What happens after I upload my artwork and submit an order?',
      a: 'Every submitted artwork file undergoes a staff quality check. Our team reviews resolution, bleed boundaries, and safe zone alignment before releasing the job to commercial printing presses.',
    },
    {
      q: 'Can I customize a design if I do not have ready artwork?',
      a: 'Yes! You can choose our Ready-Made Templates experience. Simply select a layout and fill in standard fields like company name, logo, designation, and contact details directly in your browser.',
    },
  ];

  return (
    <div className="space-y-20 pb-24 select-none">
      {/* 1. Hero Banner Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden py-20 lg:py-28 border-b border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6 text-center md:text-left">
            <Badge variant="primary" size="lg" className="bg-blue-500/10 text-blue-300 border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              India ki Apni Online Printing Press
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              Professional Custom Printing <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-400 to-amber-300">Made Seamless</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-normal">
              Explore our structured commercial print catalogue. Select custom materials, sizes, and finishes with live volume pricing, then upload your print-ready artwork or customize ready-made templates.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link href="/products" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-lg hover:shadow-xl">
                  <span>Explore Print Catalogue</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/products?category=business-cards" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Business Cards
                </Button>
              </Link>
            </div>
            <div className="pt-6 flex flex-wrap items-center justify-center md:justify-start gap-6 text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Upfront Volume Pricing</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Standard Staff Artwork Review</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Custom Specifications</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Print Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-[#0A58CA] uppercase tracking-wider">Catalogue Navigation</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">Explore Print Categories</h2>
            <p className="text-sm text-slate-600 mt-1">
              Select a category to view specifications, paper materials, and volume price tiers.
            </p>
          </div>
          <Link href="/products" className="text-sm font-bold text-[#0A58CA] hover:text-[#084298] flex items-center gap-1.5 transition-colors shrink-0">
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {catLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link key={cat._id} href={`/products?category=${cat.slug || cat._id}`}>
                <Card hover className="p-6 h-full flex flex-col justify-between group border-slate-200">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-blue-50 group-hover:bg-[#0A58CA] text-[#0A58CA] group-hover:text-white transition-colors flex items-center justify-center mb-4 font-black text-lg">
                      {cat.name.charAt(0)}
                    </div>
                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#0A58CA] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 font-normal leading-relaxed">
                      {cat.description || 'Custom commercial printing solutions with configurable attributes and volume pricing.'}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-700 group-hover:text-[#0A58CA]">
                    <span>Browse Catalogue</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 3. Featured Catalogue Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <Badge variant="accent" size="md">Featured Products</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Popular Commercial Print Items</h2>
          <p className="text-sm text-slate-600">
            Standard printing items configured with authoritative volume discount tiers and custom specifications.
          </p>
        </div>

        {prodLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">Catalogue Updating</h3>
            <p className="text-xs text-slate-500">Please check back shortly or browse our categories directly.</p>
            <Link href="/products">
              <Button variant="primary" size="sm">Browse All Products</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {products.map((prod) => (
              <Card key={prod._id} hover className="flex flex-col overflow-hidden border-slate-200">
                <Link href={`/products/${prod.slug || prod._id}`} className="block h-48 bg-slate-100 relative overflow-hidden group">
                  {prod.images?.[0]?.url || prod.images?.[0] ? (
                    <img
                      src={prod.images?.[0]?.url || prod.images[0]}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-xs text-slate-900 text-[10px] font-black uppercase px-2.5 py-1 rounded-md shadow-xs">
                    {prod.category?.name || 'Commercial Press'}
                  </span>
                </Link>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <Link href={`/products/${prod.slug || prod._id}`}>
                      <h3 className="text-lg font-black text-slate-900 hover:text-[#0A58CA] transition-colors">{prod.name}</h3>
                    </Link>
                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-normal leading-relaxed">{prod.shortDescription}</p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting at</span>
                      <span className="text-lg font-black text-slate-900">₹{prod.basePrice}</span>
                      <span className="text-[10px] text-slate-500"> / pc</span>
                    </div>
                    <Link href={`/products/${prod.slug || prod._id}`}>
                      <Button variant="primary" size="sm">
                        <span>Configure</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* 4. Shop by Business Requirement */}
      <section className="bg-slate-900 text-white py-16 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Targeted Solutions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">Shop by Business Requirement</h2>
            <p className="text-sm text-slate-400 font-normal">
              Curated commercial print bundles designed to streamline procurement for organizations of every scale.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessNeeds.map((need, idx) => (
              <Link key={idx} href={need.href}>
                <div className="bg-slate-800/80 hover:bg-slate-800 p-6 rounded-2xl border border-slate-700/80 transition-all h-full flex flex-col justify-between group">
                  <div>
                    <div className="p-3 bg-slate-900 rounded-xl w-fit mb-4 border border-slate-700">
                      {need.icon}
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">{need.title}</h3>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed font-normal">{need.desc}</p>
                  </div>
                  <div className="mt-6 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs font-bold text-slate-300 group-hover:text-white">
                    <span>Explore Products</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Two Design Paths Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <Badge variant="primary" size="md">Design Experiences</Badge>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Choose Your Design Path</h2>
          <p className="text-sm text-slate-600 font-normal">
            We provide structured submission workflows whether you have existing graphic files or want to personalize ready-made layouts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Path A: Upload Your Own Artwork */}
          <Card className="p-8 relative overflow-hidden group border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-blue-50 text-[#0A58CA] flex items-center justify-center mb-6">
              <Upload className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#0A58CA] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Option 1: Custom Artwork
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-4 mb-2">Upload Your Own Design</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
              Already have print-ready artwork? Configure your product materials (paper weight, coating, banner dimensions), upload your accepted file formats, and our team will perform standard review before press.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 mb-8 font-medium">
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#0A58CA] shrink-0" /> Supports PDF, AI, PSD, and high-res PNG/JPEG</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#0A58CA] shrink-0" /> Staff review of bleed boundaries and safe zone</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#0A58CA] shrink-0" /> Real-time tiered volume pricing updates</li>
            </ul>
            <Link href="/products">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-[#0A58CA] border-blue-300 hover:bg-blue-50">
                <span>Browse & Upload Artwork</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>

          {/* Path B: Select & Customise Ready-Made Templates */}
          <Card className="p-8 relative overflow-hidden group border-slate-200">
            <div className="w-14 h-14 rounded-xl bg-pink-50 text-[#D63384] flex items-center justify-center mb-6">
              <LayoutTemplate className="w-7 h-7" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#D63384] bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
              Option 2: Predefined Layouts
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-4 mb-2">Customise Ready-Made Templates</h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-6 font-normal">
              Choose from our curated library of structured templates. Personalize fields like company name, logo, designation, and contact details directly in your browser without needing specialized graphic software.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-700 mb-8 font-medium">
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#D63384] shrink-0" /> Structured form-based text & logo insertion</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#D63384] shrink-0" /> Professional business card & banner layouts</li>
              <li className="flex items-center gap-2.5"><CheckCircle2 className="w-4 h-4 text-[#D63384] shrink-0" /> Instant visual previewing and authoring</li>
            </ul>
            <Link href="/products">
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-[#D63384] border-pink-300 hover:bg-pink-50">
                <span>Explore Template Library</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* 6. Why Choose Maaza Printwala (Trust Pillars) */}
      <section className="bg-slate-50 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service Assurance</span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Why Choose Maaza Printwala</h2>
            <p className="text-sm text-slate-600 font-normal">
              We combine robust digital catalogue specifications with attentive manual review to deliver dependable commercial print results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0A58CA] flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Commercial Quality</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Standard digital and offset color printing engineered for professional business cards, banners, and apparel.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-pink-50 text-[#D63384] flex items-center justify-center">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Staff Artwork Review</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Every submitted file is checked by our team for basic bleed and safe zone guidelines before going to press.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Transparent Volume Pricing</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Our server-side engine calculates tiered discounts upfront as you adjust quantities, with zero hidden charges.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Standard Logistics</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-normal">
                Careful packaging and dispatch coordination through established commercial courier networks across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. How It Works (4-Step Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-2 mb-12">
          <span className="text-xs font-bold text-[#0A58CA] uppercase tracking-wider">Simple Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">How It Works</h2>
          <p className="text-sm text-slate-600 font-normal">
            From online product configuration to doorstep dispatch, our order process is clear and systematic.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { step: '01', title: 'Select Specifications', desc: 'Choose your printing product and configure material, size, coating, and quantity.' },
            { step: '02', title: 'Submit Artwork / Template', desc: 'Upload your print-ready file or customize one of our structured ready-made templates.' },
            { step: '03', title: 'Staff Verification', desc: 'Our team reviews your submission for resolution and bleed boundaries.' },
            { step: '04', title: 'Production & Dispatch', desc: 'Your commercial print order is produced and securely packaged for delivery.' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 relative flex flex-col justify-between">
              <div className="text-3xl font-black text-slate-200 mb-4">{item.step}</div>
              <div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQ & Corporate Enquiry Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Frequently Asked Questions</h2>
          <p className="text-sm text-slate-600 font-normal">Everything you need to know about preparing and submitting your custom print order.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm sm:text-base">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180 text-[#0A58CA]' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50 font-normal animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Corporate Bulk Enquiry Box */}
        <div className="bg-gradient-to-r from-[#0A58CA] to-[#084298] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-md">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Corporate & Bulk Orders</span>
            <h3 className="text-2xl font-black text-white">Need Volume Printing Exceeding 5,000 Units?</h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl font-normal leading-relaxed">
              For large enterprise requirements, multi-location shipping, or custom paper specifications, contact our commercial support team for dedicated assistance.
            </p>
          </div>
          <Link href="/products" className="shrink-0">
            <Button variant="outline" size="lg" className="bg-white text-[#0A58CA] hover:bg-blue-50 border-white">
              Browse Catalogue
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
