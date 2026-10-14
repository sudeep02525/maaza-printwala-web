'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import { Link } from '@/i18n/routing.js';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Filter, Search, X, SlidersHorizontal, ArrowUpDown, 
  Layers, LayoutGrid, List as ListIcon, Star, Eye, ShoppingCart,
  CheckCircle2, ShieldCheck, ChevronDown
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import Skeleton from '@/components/ui/Skeleton.jsx';
import CategoryNav from '@/components/ui/CategoryNav.jsx';

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
            
            <div className="mt-8 pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4 text-xs font-medium text-[var(--text-muted)]">
              <p>✔ Dispatch in 48 Hrs</p>
              <p>✔ GST Invoice Available</p>
              <p>✔ Secure Payments</p>
              <p>✔ 100% Quality Check</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// ---- REAL CATALOGUE FILTER GROUPS ----
const FILTER_GROUPS = [
  {
    id: 'availability',
    name: 'Availability',
    defaultOpen: true,
    options: [
      { id: 'in-stock', label: 'In Stock' },
      { id: 'featured', label: 'Best Sellers' },
    ],
  },
  {
    id: 'price',
    name: 'Price',
    defaultOpen: true,
    options: [
      { id: 'under-250', label: 'Under ₹250' },
      { id: '250-500', label: '₹250 - ₹500' },
      { id: '500-1000', label: '₹500 - ₹1,000' },
      { id: 'above-1000', label: 'Above ₹1,000' },
    ],
  },
  {
    id: 'finish',
    name: 'Finish & Lamination',
    defaultOpen: true,
    options: [
      { id: 'matte', label: 'Matte Finish' },
      { id: 'glossy', label: 'Glossy Finish' },
      { id: 'spot-uv', label: 'Spot UV Accent' },
      { id: 'foil', label: 'Foil / Metallic' },
      { id: 'velvet', label: 'Velvet Touch' },
    ],
  },
  {
    id: 'material',
    name: 'Material & Stock',
    defaultOpen: true,
    options: [
      { id: 'cardstock', label: 'Premium Cardstock' },
      { id: 'cotton', label: '100% Combed Cotton' },
      { id: 'flex', label: 'Heavy Duty Flex Vinyl' },
      { id: 'bond', label: 'Executive Bond Paper' },
      { id: 'kraft', label: 'Kraft & Corrugated' },
      { id: 'pvc', label: 'Rigid PVC / Translucent' },
      { id: 'ceramic', label: 'Grade-A Ceramic' },
    ],
  },
  {
    id: 'size',
    name: 'Size & Shape',
    defaultOpen: false,
    options: [
      { id: 'standard-card', label: 'Standard (89 × 51 mm)' },
      { id: 'classic-card', label: 'Classic (90 × 54 mm)' },
      { id: 'rounded', label: 'Rounded Corners' },
      { id: 'square', label: 'Square' },
      { id: 'a4-a5', label: 'A4 / A5 Standard' },
      { id: 'apparel-sizes', label: 'Apparel (S-XXL)' },
    ],
  },
];

// Helper: Check whether a product satisfies a single filter option
function checkProductFilterMatch(p, groupId, optionId) {
  if (groupId === 'availability') {
    if (optionId === 'in-stock') return p.status === 'ACTIVE' || p.isActive !== false;
    if (optionId === 'featured') return Boolean(p.isFeatured);
  }
  if (groupId === 'price') {
    const price = Number(p.basePrice) || 0;
    if (optionId === 'under-250') return price < 250;
    if (optionId === '250-500') return price >= 250 && price <= 500;
    if (optionId === '500-1000') return price >= 500 && price <= 1000;
    if (optionId === 'above-1000') return price > 1000;
  }
  if (groupId === 'finish') {
    const str = [
      ...(p.attributeMap?.finish || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();
    if (optionId === 'matte') return str.includes('matte');
    if (optionId === 'glossy') return str.includes('gloss') || str.includes('mirror');
    if (optionId === 'spot-uv') return str.includes('spot') || str.includes('uv');
    if (optionId === 'foil') return str.includes('foil') || str.includes('metallic') || str.includes('gold') || str.includes('pearl') || str.includes('shimmer') || str.includes('diamond');
    if (optionId === 'velvet') return str.includes('velvet') || str.includes('soft');
  }
  if (groupId === 'material') {
    const str = [
      ...(p.attributeMap?.material || []),
      ...(p.attributeMap?.paper || []),
      ...(p.attributeMap?.paperType || []),
      ...(p.attributeMap?.filmType || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();
    if (optionId === 'cardstock') return str.includes('cardstock') || str.includes('card') || str.includes('gsm');
    if (optionId === 'cotton') return str.includes('cotton') || str.includes('shirt') || str.includes('polo');
    if (optionId === 'flex') return str.includes('flex') || str.includes('banner') || str.includes('standee');
    if (optionId === 'bond') return str.includes('bond') || str.includes('royal') || str.includes('letterhead');
    if (optionId === 'kraft') return str.includes('kraft') || str.includes('corrugated') || str.includes('box');
    if (optionId === 'pvc') return str.includes('pvc') || str.includes('transparent') || str.includes('non-tearable');
    if (optionId === 'ceramic') return str.includes('ceramic') || str.includes('mug') || str.includes('kit');
  }
  if (groupId === 'size') {
    const str = [
      ...(p.attributeMap?.size || []),
      p.name || '',
      p.shortDescription || '',
    ].join(' ').toLowerCase();
    if (optionId === 'standard-card') return str.includes('89') || str.includes('standard');
    if (optionId === 'classic-card') return str.includes('90') || str.includes('classic');
    if (optionId === 'rounded') return str.includes('rounded');
    if (optionId === 'square') return str.includes('square');
    if (optionId === 'a4-a5') return str.includes('a4') || str.includes('a5');
    if (optionId === 'apparel-sizes') return str.includes('small') || str.includes('medium') || str.includes('large');
  }
  return false;
}

// ---- MAIN PAGE COMPONENT ----
export function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const PRODUCTS_PER_PAGE = 16;
  const [isMounted, setIsMounted] = useState(false);
  
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Initialize filter state from URL parameters
  const initialFiltersFromUrl = useMemo(() => {
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

  const [selectedFilters, setSelectedFilters] = useState(initialFiltersFromUrl);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setSelectedCategory(categoryParam), [categoryParam]);
  useEffect(() => setSearchTerm(searchParam), [searchParam]);
  useEffect(() => setSelectedFilters(initialFiltersFromUrl), [initialFiltersFromUrl]);

  // Fetching categories
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return Array.isArray(res) ? res : (res?.data || res?.categories || []);
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // Fetching products with populated attribute schemas
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      return axiosInstance.get(params.toString() ? `/products?${params.toString()}` : '/products');
    },
    retry: false,
  });

  const categories = catData?.data?.categories || [];
  const rawProducts = prodData?.data?.products || [];

  const activeCatObj = useMemo(() => {
    if (!isMounted || !selectedCategory) return null;
    return categories.find((c) => (c.slug || c._id) === selectedCategory || c._id === selectedCategory);
  }, [isMounted, categories, selectedCategory]);

  // Push updated filter state to URL
  const pushFiltersToUrl = (newFilters, newCategory = selectedCategory, newSearch = searchTerm) => {
    const params = new URLSearchParams();
    if (newCategory) params.set('category', newCategory);
    if (newSearch) params.set('search', newSearch);

    Object.entries(newFilters).forEach(([groupKey, values]) => {
      if (values && values.length > 0) {
        params.set(groupKey, values.join(','));
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : '/products', { scroll: false });
  };

  // Toggle single filter checkbox
  const toggleFilter = (group, optionId) => {
    setSelectedFilters((prev) => {
      const current = prev[group] || [];
      const updated = current.includes(optionId)
        ? current.filter((v) => v !== optionId)
        : [...current, optionId];
      const nextState = { ...prev, [group]: updated };
      pushFiltersToUrl(nextState);
      return nextState;
    });
  };

  // Remove single active filter pill
  const removeFilter = (group, optionId) => {
    toggleFilter(group, optionId);
  };

  const handleCategoryChange = (slugOrId) => {
    setSelectedCategory(slugOrId);
    pushFiltersToUrl(selectedFilters, slugOrId, searchTerm);
  };

  const clearAllFilters = () => {
    const emptyFilters = {
      availability: [],
      price: [],
      finish: [],
      material: [],
      size: [],
    };
    setSelectedFilters(emptyFilters);
    setSelectedCategory('');
    setSearchTerm('');
    router.push('/products');
  };

  // Total active filter items count for badges
  const totalActiveFilterCount = useMemo(() => {
    return Object.values(selectedFilters).reduce((acc, curr) => acc + (curr ? curr.length : 0), 0);
  }, [selectedFilters]);

  // Real-time client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by every active filter group (AND across groups, OR within group)
    Object.entries(selectedFilters).forEach(([groupId, activeOptions]) => {
      if (!activeOptions || activeOptions.length === 0) return;
      list = list.filter((product) => {
        return activeOptions.some((optId) => checkProductFilterMatch(product, groupId, optId));
      });
    });

    // Apply Sort
    if (sortBy === 'price_asc') return list.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === 'price_desc') return list.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

    // Default 'popular' - preserves server-side category-interleaved balanced order
    return list;
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

  const breadcrumbItems = [
    ...(activeCatObj ? [{ label: activeCatObj.name }] : searchTerm ? [{ label: `Search: ${searchTerm}` }] : [{ label: 'All Products' }])
  ];

  // Helper to find human readable label for pill
  const getFilterLabel = (group, id) => {
    const g = FILTER_GROUPS.find((groupObj) => groupObj.id === group);
    if (!g) return id;
    const opt = g.options.find((o) => o.id === id);
    return opt ? opt.label : id;
  };

  const hasAnyActiveFilter = Boolean(selectedCategory || searchTerm || totalActiveFilterCount > 0);

  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />

        {/* Category Filter Pills */}
        <div className="my-6">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-2 px-1 w-full">
            <button
              onClick={() => handleCategoryChange('')}
              className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 text-xs sm:text-sm font-bold shrink-0 shadow-sm ${
                !selectedCategory
                  ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/20 scale-105'
                  : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] border border-[var(--border)]'
              }`}
            >
              <span>All Products</span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug || selectedCategory === cat._id;
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug || cat._id)}
                  className={`flex items-center px-4 py-2 rounded-full transition-all duration-200 text-xs sm:text-sm font-bold shrink-0 shadow-sm ${
                    isSelected
                      ? 'bg-[#0082CA] text-white shadow-md shadow-[#0082CA]/20 scale-105'
                      : 'bg-[var(--bg-card)] text-[var(--text-muted)] hover:bg-[var(--bg-subtle)] hover:text-[var(--text-main)] border border-[var(--border)]'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filters Pill Bar (Dynamic & Removable) */}
        {hasAnyActiveFilter && (
          <div className="flex flex-wrap items-center gap-2 mb-6 px-1">
            <span className="text-xs font-bold text-[var(--text-faint)] uppercase tracking-wider mr-1">Active Filters:</span>
            
            {/* Category Pill */}
            {activeCatObj && (
              <span className="bg-[#0082CA]/10 text-[#0082CA] px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-[#0082CA]/20">
                <span>Category: {activeCatObj.name}</span>
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => handleCategoryChange('')} />
              </span>
            )}

            {/* Search Term Pill */}
            {searchTerm && (
              <span className="bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800">
                <span>"{searchTerm}"</span>
                <X className="w-3.5 h-3.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => {
                  setSearchTerm('');
                  pushFiltersToUrl(selectedFilters, selectedCategory, '');
                }} />
              </span>
            )}

            {/* Individual Attribute Filter Pills */}
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
              Clear All ({ (activeCatObj ? 1 : 0) + (searchTerm ? 1 : 0) + totalActiveFilterCount })
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
          
          {/* LEFT SIDEBAR: FUNCTIONAL REAL ATTRIBUTE FILTERS */}
          <div className={`w-full lg:w-64 shrink-0 space-y-6 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-[var(--bg-card)] p-5 rounded-lg border border-[var(--border)] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--border)] mb-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#0082CA]" />
                  <span className="text-sm font-extrabold text-[var(--text-main)]">Filter Catalogue</span>
                </div>
                {totalActiveFilterCount > 0 && (
                  <button
                    onClick={() => {
                      const empty = { availability: [], price: [], finish: [], material: [], size: [] };
                      setSelectedFilters(empty);
                      pushFiltersToUrl(empty);
                    }}
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
                                  id={`filter-${group.id}-${opt.id}`}
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

          {/* RIGHT SIDE: PRODUCTS & TOOLBAR */}
          <div className="flex-1 min-w-0">
            {/* Products Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[var(--border)]">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
                  {activeCatObj ? activeCatObj.name : searchTerm ? `Search results for "${searchTerm}"` : 'All Products'}
                </h1>
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
              <div className="bg-[var(--bg-card)] rounded-lg border border-[var(--border)] border-dashed p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-[var(--bg-subtle)] rounded-full flex items-center justify-center mx-auto mb-4 text-[var(--text-faint)]">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-[var(--text-main)] mb-2">No exact matches found</h3>
                <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto mb-6">Try adjusting your filters, removing search terms, or exploring our best sellers.</p>
                <button onClick={clearAllFilters} className="bg-[#0082CA] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#0068A2] transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "flex flex-col gap-4"}
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map((prod, index) => (
                    <motion.div
                      key={prod._id || prod.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      layout
                      className="h-full"
                    >
                      {viewMode === 'grid' ? (
                        <div className="relative group h-full">
                          <ProductCard product={prod} />
                          
                        </div>
                      ) : (
                        /* LIST VIEW CARD */
                        <div className="bg-[var(--bg-card)] p-4 rounded-lg border border-[var(--border)] shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group h-full">
                          <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0 relative">
                            <img src={getImageUrl(prod.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
                            {prod.featured && <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Top Rated</div>}
                          </div>
                          <div className="flex-1 flex flex-col py-2">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-xl font-extrabold text-[var(--text-main)] group-hover:text-[#0082CA] transition-colors"><Link href={`/products/${prod._id}`}>{prod.name}</Link></h3>
                                <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">Fast Dispatch Available</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xl font-black text-[#0082CA]">₹{prod.basePrice}</span>
                                <p className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest font-bold mt-1">Excl. GST</p>
                              </div>
                            </div>
                            <p className="text-sm text-[var(--text-muted)] font-medium line-clamp-2 mb-6">{prod.description || 'Premium quality print material offering exceptional durability and professional finish.'}</p>
                            <div className="mt-auto flex items-center gap-3">
                              <Link href={`/products/${prod._id}`} className="flex-1">
                                <button className="w-full bg-[#0082CA] hover:bg-[#0068A2] text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                  <ShoppingCart className="w-4 h-4" /> Customize Now
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

            {/* Pagination */}
            {!prodLoading && totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button 
                  onClick={() => {
                    document.getElementById('explore-categories-scroll'); // just a dummy to ensure block works
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentPage(prev => Math.max(prev - 1, 1));
                  }}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >&larr;</button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setCurrentPage(i + 1);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#0082CA] text-white shadow-sm' : 'border border-[var(--border)] text-[var(--text-faint)] hover:border-[#0082CA] hover:text-[#0082CA]'}`}
                  >{i + 1}</button>
                ))}
                
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-faint)] hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >&rarr;</button>
              </div>
            )}

          </div>
        </div>
      </div>
      
      {/* Quick View Modal */}
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}


