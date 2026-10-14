'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React, { useState, useEffect, Suspense, useMemo, use } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing.js';
import { useSearchParams, useParams, notFound } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Filter, Search, X, SlidersHorizontal, ArrowUpDown, 
  LayoutGrid, List as ListIcon, Star, Eye, ShoppingCart, ChevronDown, ChevronRight, CheckCircle2, ShieldCheck, Plus, Minus
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import DOMPurify from 'isomorphic-dompurify';
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import Skeleton from '@/components/ui/Skeleton.jsx';
import PageSkeleton from '@/components/ui/PageSkeleton.jsx';
import { FILTER_GROUPS, checkProductFilterMatch, getFilterLabel } from '@/utils/productFilters.js';
// removed categoryData import
import { useTranslations, useLocale } from 'next-intl';

// ---- QUICK VIEW MODAL COMPONENT ----
function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[var(--bg-card)] rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-[var(--bg-card)] backdrop-blur-md rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--hover)] transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-full md:w-1/2 bg-[var(--bg-subtle)] aspect-square md:aspect-auto">
            <img 
              src={getImageUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">In Stock</span>
              {product.featured && <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Best Seller</span>}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-main)] tracking-tight mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-[var(--text-main)]">4.9</span>
                <span className="text-xs text-[var(--text-muted)]">(128 Reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]" />
              <span className="text-sm font-bold text-[#0082CA]">From ₹{product.basePrice}</span>
            </div>

            <p className="text-sm text-[var(--text-muted)] mb-8 leading-relaxed">
              {product.description || 'Premium commercial printing product with customizable specs, fast turnaround, and vibrant CMYK output.'}
            </p>

            <div className="space-y-4">
              <Link href={`/products/${product._id}`} className="block w-full">
                <button className="w-full py-3.5 bg-[#0082CA] text-white font-bold rounded-lg hover:bg-[#0068A2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Customize & Buy <ArrowUpDown className="w-4 h-4 rotate-90" />
                </button>
              </Link>
              <button onClick={onClose} className="w-full py-3.5 bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] font-bold rounded-lg hover:bg-[var(--bg-subtle)] transition-colors">
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ---- FAQ ACCORDION COMPONENT ----
function FaqAccordion({ faqs = [] }) {
  const [activeFaq, setActiveFaq] = useState(null);
  
  if (faqs.length === 0) return null;

  const renderFaq = (faq, idx) => {
    const isActive = activeFaq === idx;
    
    return (
      <div key={idx} className={`bg-[var(--bg-card)] transition-all duration-500 ${isActive ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-10 relative' : ''}`}>
        <button 
          className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none transition-colors"
          onClick={() => setActiveFaq(isActive ? null : idx)}
        >
          <span className="font-bold text-[var(--text-main)] text-[15px] pr-4">{faq.question || faq.q}</span>
          {isActive ? (
            <Minus className="w-5 h-5 text-[var(--text-muted)] flex-shrink-0" />
          ) : (
            <Plus className="w-5 h-5 text-[var(--text-main)] flex-shrink-0" />
          )}
        </button>
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 text-[14px] text-[var(--text-muted)] leading-relaxed pr-8">
                {faq.answer || faq.a}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl mx-auto items-start">
      <div className="flex flex-col border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--bg-card)]">
        {faqs.filter((_, i) => i % 2 === 0).map((faq, i) => renderFaq(faq, i * 2))}
      </div>
      <div className="flex flex-col border border-[var(--border)] divide-y divide-[var(--border)] bg-[var(--bg-card)]">
        {faqs.filter((_, i) => i % 2 !== 0).map((faq, i) => renderFaq(faq, i * 2 + 1))}
      </div>
    </div>
  );
}

export function CategoryContent({ subSlug }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  
  const [isMounted, setIsMounted] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;
  const [sortBy, setSortBy] = useState('popular');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const t = useTranslations();
  const locale = useLocale();

  useEffect(() => { setIsMounted(true); }, []);

  const selectedCategorySlug = params?.slug || '';
  const activeSubcategory = searchParams.get('sub') || '';
  const searchTerm = searchParams.get('search') || '';

  const { data: activeCatObj, isLoading: catLoading } = useQuery({
    queryKey: ['category', selectedCategorySlug],
    queryFn: async () => {
      if (!selectedCategorySlug) return null;
      try {
        const res = await axiosInstance.get(`/categories/${selectedCategorySlug}`);
        return res.data?.category || null;
      } catch (e) {
        return null;
      }
    }
  });

  if (!catLoading && !activeCatObj) {
    notFound();
  }

  const activeCatSubs = activeCatObj?.subcategoryGroups?.flatMap(g => g.items) || [];
  // We still fetch products generically for now (DB might not match the new slugs perfectly yet, but this sets the foundation)
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products', selectedCategorySlug, activeSubcategory, searchTerm],
    queryFn: () => {
      const p = new URLSearchParams();
      // For now, if activeCatObj is null (legacy category), pass it. If not, don't break the backend if it doesn't exist, just fetch all and we'll show UI.
      // In a real scenario we'd pass category=activeCatObj.slug
      if (selectedCategorySlug) p.append('category', selectedCategorySlug);
      if (activeSubcategory) p.append('sub', activeSubcategory);
      if (searchTerm) p.append('search', searchTerm);
      return axiosInstance.get(p.toString() ? `/products?${p.toString()}` : "/products");
    },
    retry: false,
  });

  const rawProducts = prodData?.data?.products || [];

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Derive active filters directly from URL searchParams - Pure, stateless!
  const selectedFilters = useMemo(() => {
    const getArray = (key) => {
      const val = searchParams.get(key);
      return val ? val.split(',').filter(Boolean) : [];
    };
    return {
      availability: getArray('availability'),
      price: getArray('price'),
      finish: getArray('finish'),
      material: getArray('material'),
      size: getArray('size'),
    };
  }, [searchParams]);

  const toggleFilter = (group, optionId) => {
    const current = selectedFilters[group] || [];
    const updated = current.includes(optionId)
      ? current.filter((v) => v !== optionId)
      : [...current, optionId];

    const p = new URLSearchParams(searchParams.toString());
    if (updated.length > 0) {
      p.set(group, updated.join(','));
    } else {
      p.delete(group);
    }
    const q = p.toString();
    router.replace(q ? `?${q}` : window.location.pathname, { scroll: false });
  };

  const removeFilter = (group, optionId) => {
    toggleFilter(group, optionId);
  };

  const clearAllFilters = () => {
    const p = new URLSearchParams();
    if (activeSubcategory) p.set('sub', activeSubcategory);
    const q = p.toString();
    router.replace(q ? `?${q}` : window.location.pathname, { scroll: false });
  };

  const handleResetFilters = () => {
    const p = new URLSearchParams(searchParams.toString());
    FILTER_GROUPS.forEach((g) => p.delete(g.id));
    const q = p.toString();
    router.replace(q ? `?${q}` : window.location.pathname, { scroll: false });
  };

  const totalActiveFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0);
  }, [selectedFilters]);

  // Client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by every active filter group
    Object.entries(selectedFilters).forEach(([groupId, activeOptions]) => {
      if (!activeOptions || activeOptions.length === 0) return;
      list = list.filter((product) => {
        return activeOptions.some((optId) => checkProductFilterMatch(product, groupId, optId));
      });
    });

    if (sortBy === 'price_asc') return list.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === 'price_desc') return list.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
  }, [rawProducts, selectedFilters, sortBy]);

  // Compute option counts based on raw products
  const filterOptionCounts = useMemo(() => {
    const counts = {};
    for (const group of FILTER_GROUPS) {
      counts[group.id] = {};
      for (const opt of group.options) {
        counts[group.id][opt.id] = rawProducts.filter((p) => checkProductFilterMatch(p, group.id, opt.id)).length;
      }
    }
    return counts;
  }, [rawProducts]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedProducts]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const handleSubcategoryClick = (subSlug) => {
    router.push(`/${selectedCategorySlug}/${subSlug}`);
  };

  const breadcrumbItems = [
    ...(activeCatObj ? [{ label: t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name, href: `/${activeCatObj.slug}` }] : []),
    ...(activeSubcategory && activeCatObj ? [{ label: activeCatSubs.find(s => s.slug === activeSubcategory)?.name || activeSubcategory }] : []),
    ...(searchTerm ? [{ label: `${t('common.search')}: ${searchTerm}` }] : [])
  ];

  const hasAnyActiveFilter = Boolean(activeSubcategory || searchTerm || totalActiveFilterCount > 0);

  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />

        {/* 3. PRODUCT GRID SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            {/* Active Filters Pill Bar (Dynamic & Removable) */}
            {hasAnyActiveFilter ? (
              <div className="flex flex-wrap items-center gap-2 px-1">
                <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mr-1">Active Filters:</span>
                
                {activeSubcategory && (
                  <span className="bg-[#0082CA]/10 text-[#0082CA] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#0082CA]/20">
                    <span>Subcategory: {activeCatSubs.find(s => s.slug === activeSubcategory)?.name || activeSubcategory}</span>
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleSubcategoryClick('')} />
                  </span>
                )}

                {searchTerm && (
                  <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800">
                    <span>"{searchTerm}"</span>
                    <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => {
                      const p = new URLSearchParams(searchParams.toString());
                      p.delete('search');
                      const q = p.toString();
                      router.replace(q ? `?${q}` : window.location.pathname, { scroll: false });
                    }} />
                  </span>
                )}

                {Object.entries(selectedFilters).map(([groupId, optIds]) =>
                  (optIds || []).map((optId) => (
                    <span
                      key={`${groupId}-${optId}`}
                      className="bg-[var(--bg-card)] text-[var(--text-main)] px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border border-[var(--border)] shadow-xs"
                    >
                      <span>{getFilterLabel(groupId, optId)}</span>
                      <X className="w-3.5 h-3.5 cursor-pointer text-[var(--text-muted)] hover:text-red-500 transition-colors" onClick={() => removeFilter(groupId, optId)} />
                    </span>
                  ))
                )}

                <button 
                  onClick={clearAllFilters} 
                  className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-2 py-1 transition-colors ml-1"
                >
                  Clear All ({ (activeSubcategory ? 1 : 0) + (searchTerm ? 1 : 0) + totalActiveFilterCount })
                </button>
              </div>
            ) : <div />}

            {activeSubcategory && (
              <button onClick={() => handleSubcategoryClick(activeSubcategory)} className="text-sm font-bold text-[#0082CA] hover:underline flex items-center gap-1">
                {t('categoryPage.viewAll')} {activeCatObj?.name} <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT SIDEBAR: REAL ATTRIBUTE FILTERS */}
            <div className={`w-full lg:w-72 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-[var(--bg-card)] p-5 rounded-lg border border-[var(--border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[#0082CA]" />
                    <span className="text-sm font-extrabold text-[var(--text-main)]">Filter Products</span>
                  </div>
                  {totalActiveFilterCount > 0 && (
                    <button
                      onClick={handleResetFilters}
                      className="text-[11px] font-bold text-[#0082CA] hover:underline"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1">
                  {FILTER_GROUPS.map((group) => {
                    const activeInGroup = (selectedFilters[group.id] || []).length;
                    return (
                      <details key={group.id} className="border-t border-[var(--border)] pt-3 group/det" open={group.defaultOpen || activeInGroup > 0}>
                        <summary className="flex items-center justify-between cursor-pointer list-none py-1 outline-none [&::-webkit-details-marker]:hidden">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-[var(--text-main)] group-hover/det:text-[#0082CA] transition-colors">
                              {group.name}
                            </span>
                            {activeInGroup > 0 && (
                              <span className="bg-[#0082CA] text-white text-[10px] font-bold rounded-full px-1.5 py-0.2">
                                {activeInGroup}
                              </span>
                            )}
                          </div>
                          <ChevronDown className="w-3.5 h-3.5 text-[var(--text-faint)] group-hover/det:text-[#0082CA] group-open/det:rotate-180 transition-transform" />
                        </summary>
                        
                        <div className="flex flex-col gap-1.5 pt-2 pb-3 pl-0.5">
                          {group.options.map((opt) => {
                            const isChecked = (selectedFilters[group.id] || []).includes(opt.id);
                            const count = filterOptionCounts[group.id]?.[opt.id] ?? 0;
                            return (
                              <label
                                key={opt.id}
                                className={`flex items-center justify-between gap-2 py-1 px-1.5 rounded cursor-pointer transition-colors group/opt ${
                                  isChecked ? 'bg-[#0082CA]/5' : 'hover:bg-[var(--bg-subtle)]'
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <input
                                    type="checkbox"
                                    id={`cat-filter-${group.id}-${opt.id}`}
                                    checked={isChecked}
                                    onChange={() => toggleFilter(group.id, opt.id)}
                                    className="w-4 h-4 rounded border-[var(--border-strong)] text-[#0082CA] focus:ring-[#0082CA] cursor-pointer accent-[#0082CA]"
                                  />
                                  <span className={`text-xs truncate transition-colors ${isChecked ? 'font-bold text-[#0082CA]' : 'text-[var(--text-muted)] group-hover/opt:text-[var(--text-main)]'}`}>
                                    {opt.label}
                                  </span>
                                </div>
                                <span className="text-[10px] font-mono text-[var(--text-faint)] shrink-0">
                                  ({count})
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </details>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: PRODUCTS */}
            <div className="flex-1 min-w-0">
              {/* Products Toolbar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
                    {activeCatObj ? (t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name) : 'Products'}
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
                    Showing {filteredAndSortedProducts.length} items
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end flex-wrap">
                  {/* Mobile Filter Toggle */}
                  <button
                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                    className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] text-xs font-bold text-[var(--text-main)] hover:border-[#0082CA] transition-colors"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#0082CA]" />
                    <span>Filters</span>
                    {totalActiveFilterCount > 0 && (
                      <span className="bg-[#0082CA] text-white text-[10px] font-bold rounded-full px-1.5 py-0.2">
                        {totalActiveFilterCount}
                      </span>
                    )}
                  </button>

                  <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-muted)]">
                    <ArrowUpDown className="w-4 h-4 text-[var(--text-faint)]" />
                    <span>Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:border-[#0082CA]"
                    >
                      <option value="popular">Recommended</option>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="name_asc">Name: A to Z</option>
                    </select>
                  </div>

                  <div className="flex items-center border border-[var(--border)] rounded-lg overflow-hidden bg-[var(--bg-card)]">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 transition-colors ${viewMode === 'grid' ? 'bg-[#0082CA] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                      title="Grid view"
                    >
                      <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-1.5 transition-colors ${viewMode === 'list' ? 'bg-[#0082CA] text-white' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
                      title="List view"
                    >
                      <ListIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
              


              {/* Product Grid / List */}
              {!isMounted || prodLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-[380px] rounded-lg" />)}
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="bg-[var(--bg-card)] rounded-xl border border-[var(--border)] p-16 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-24 h-24 bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mb-6 text-[var(--text-faint)]">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[var(--text-main)] mb-3">{t('categoryPage.noProductsTitle')}</h3>
                  <p className="text-base text-[var(--text-muted)] max-w-md mx-auto mb-8 font-medium">
                    {t('categoryPage.noProductsDesc', { 
                      category: activeCatObj 
                        ? (t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name)
                        : (locale === 'hi' ? 'इस श्रेणी' : locale === 'mr' ? 'या श्रेणीत' : 'this category') 
                    })}
                  </p>
                  <Link href="/products" className="bg-[#0082CA] hover:bg-[#0068A2] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-[#0082CA]/20">
                    {t('categoryPage.exploreAll')}
                  </Link>
                </div>
              ) : (
                <motion.div 
                  layout
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
                  className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-4"}
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map((prod, index) => (
                      <motion.div
                        key={prod._id || prod.slug}
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, delay: index * 0.05 }}
                        layout className="h-full"
                      >
                        {viewMode === 'grid' ? (
                          <div className="relative group h-full">
                            <ProductCard product={prod} />
                          </div>
                        ) : (
                          <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group h-full">
                            <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0 relative">
                              <img src={getImageUrl(prod.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
                            </div>
                            <div className="flex-1 flex flex-col py-2">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-extrabold text-[var(--text-main)] group-hover:text-[#0082CA] transition-colors"><Link href={`/products/${prod._id}`}>{prod.name}</Link></h3>
                                  <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">{t('product.fastDispatch')}</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xl font-black text-[#0082CA]">₹{prod.basePrice}</span>
                                </div>
                              </div>
                              <p className="text-sm text-[var(--text-muted)] font-medium line-clamp-2 mb-6">{prod.description || 'Premium quality print material offering exceptional durability and professional finish.'}</p>
                              <div className="mt-auto flex items-center gap-3">
                                <Link href={`/products/${prod._id}`} className="flex-1">
                                  <button className="w-full bg-[#0082CA] hover:bg-[#0068A2] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                    <ShoppingCart className="w-4 h-4" /> {t('common.customize')}
                                  </button>
                                </Link>
                                
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}

            </div>
          </div>
        </div>

        {/* 4. INFORMATION / SEO SECTION */}
        {activeCatObj?.seoContent && (
          <div className="mb-12 bg-[var(--bg-card)] rounded-lg p-6 md:p-10 border border-[var(--border)] shadow-sm">
            <h1 className="text-3xl font-black text-[var(--text-main)] mb-4">{t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name}</h1>
            <p className="text-lg text-[var(--text-muted)] font-medium mb-6">
              {activeCatObj.description}
            </p>
            <div 
              className="prose prose-slate prose-lg max-w-5xl prose-h2:text-3xl prose-h2:font-extrabold prose-h2:text-[var(--text-main)] prose-h2:mb-6 prose-p:text-[var(--text-muted)] prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(activeCatObj.seoContent) }}
            />
          </div>
        )}

        {/* 5. FAQ SECTION */}
        {activeCatObj?.faqs && activeCatObj.faqs.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-[var(--text-main)] mb-4">{t('categoryPage.faqTitle')}</h2>
              <p className="text-[var(--text-muted)] font-medium">{t('categoryPage.faqDesc', { category: activeCatObj.name.toLowerCase() })}</p>
            </div>
            <FaqAccordion faqs={activeCatObj.faqs} />
          </div>
        )}

      </div>
      
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}


