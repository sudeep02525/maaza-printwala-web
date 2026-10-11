'use client';

import React, { useState, useMemo } from 'react';
import { Link } from '@/i18n/routing.js';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';
import { 
  Search, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Building2, 
  HelpCircle, 
  Tag, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function CategoriesView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState('all');

  const { data: categoriesData, isLoading } = useQuery({
    queryKey: ['all-categories-hub'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      const cats = res.data?.data?.categories || res.data?.categories || res.data || [];
      return Array.isArray(cats) ? cats : [];
    }
  });

  const categories = categoriesData || [];

  // Filtered categories based on search or category select
  const filteredCategories = useMemo(() => {
    let list = categories;
    if (selectedCategorySlug !== 'all') {
      list = list.filter(c => c.slug === selectedCategorySlug);
    }
    if (!searchTerm.trim()) return list;

    const query = searchTerm.toLowerCase();
    return list.filter(cat => {
      const matchesName = cat.name.toLowerCase().includes(query);
      const matchesDesc = cat.description?.toLowerCase().includes(query);
      const matchesSubgroup = cat.subcategoryGroups?.some(group =>
        group.name.toLowerCase().includes(query) ||
        group.items?.some(it => it.name.toLowerCase().includes(query))
      );
      return matchesName || matchesDesc || matchesSubgroup;
    });
  }, [categories, selectedCategorySlug, searchTerm]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-white to-[#F1F5F9] border-b border-slate-200/80 pt-10 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-sky-50 text-[#0082CA] border border-sky-200/60 mb-4">
              <Layers className="w-3.5 h-3.5" /> Complete Print Directory
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Explore All Categories & Finishes
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600">
              Browse our full catalog of commercial print, custom packaging, branded apparel, and corporate merchandise with industrial-grade precision.
            </p>

            {/* Search Filter */}
            <div className="w-full mt-8 relative max-w-xl">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search any product, paper finish, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-xl shadow-sm text-sm sm:text-base focus:ring-2 focus:ring-[#0082CA] focus:border-transparent outline-none transition"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick jump pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setSelectedCategorySlug('all')}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                  selectedCategorySlug === 'all'
                    ? 'bg-[#0082CA] text-white shadow-sm'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                All ({categories.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelectedCategorySlug(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                    selectedCategorySlug === cat.slug
                      ? 'bg-[#0082CA] text-white shadow-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map(idx => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="h-20 bg-slate-100 rounded-lg"></div>
                  <div className="h-20 bg-slate-100 rounded-lg"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8">
            <Layers className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No categories matching "{searchTerm}"</h3>
            <p className="text-sm text-slate-500 mt-1">Try another keyword or reset the category filter.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategorySlug('all'); }}
              className="mt-4 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-[#0082CA] transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {filteredCategories.map((cat) => (
              <div 
                key={cat.slug} 
                id={`cat-${cat.slug}`}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Category Header */}
                <div className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="max-w-2xl">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{cat.name}</h2>
                      {cat.isActive && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Active
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="mt-2 text-sm text-slate-300 leading-relaxed">
                        {cat.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/${cat.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0082CA] hover:bg-[#006ca8] text-white text-sm font-bold shadow-md transition"
                    >
                      Browse Category <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/products?category=${cat.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition"
                    >
                      All Products
                    </Link>
                  </div>
                </div>

                {/* Subcategories Breakdown */}
                {cat.subcategoryGroups && cat.subcategoryGroups.length > 0 ? (
                  <div className="p-6 sm:p-8 space-y-8 bg-slate-50/50">
                    {cat.subcategoryGroups.map((group) => (
                      <div key={group._id || group.name} className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-[#0082CA]" />
                          <h3 className="text-xs font-extrabold uppercase tracking-widest text-slate-500">
                            {group.name}
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {group.items?.map((item) => (
                            <Link
                              key={item._id || item.slug}
                              href={`/products?category=${cat.slug}&subcategory=${item.slug}`}
                              className="group relative flex flex-col justify-between p-3.5 rounded-xl bg-white border border-slate-200 hover:border-[#0082CA] hover:shadow-md transition-all text-left"
                            >
                              <div>
                                {item.image && (
                                  <div className="w-full aspect-[4/3] rounded-lg bg-slate-100 overflow-hidden mb-2.5">
                                    <img 
                                      src={getImageUrl(item.image)} 
                                      alt={item.name}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                    />
                                  </div>
                                )}
                                <p className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-[#0082CA] transition-colors line-clamp-2">
                                  {item.name}
                                </p>
                              </div>

                              <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-slate-400 group-hover:text-[#0082CA]">
                                <span>Explore</span>
                                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 bg-slate-50 text-center text-sm text-slate-500">
                    Direct products available in this category.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* B2B / Custom Quotes callout */}
        <div className="mt-16 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 text-white backdrop-blur-sm mb-4">
              <Building2 className="w-3.5 h-3.5" /> High Volume & Enterprise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
              Need custom specs, packaging dies, or bulk contract pricing?
            </h2>
            <p className="mt-3 text-blue-100 text-sm sm:text-base leading-relaxed">
              Connect directly with our production specialists for custom GSM selection, PANTONE matching, special foil embossing, and dedicated account support.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <Link
                href="/bulk-enquiry"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 font-extrabold text-sm hover:bg-slate-100 transition shadow-lg"
              >
                Request Enterprise Quote <ArrowRight className="w-4 h-4 text-[#0082CA]" />
              </Link>
              <Link
                href="/support"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm backdrop-blur-sm transition"
              >
                <HelpCircle className="w-4 h-4" /> Contact Support Team
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
