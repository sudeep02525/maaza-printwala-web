'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Filter, Search, X, SlidersHorizontal, ArrowUpDown, 
  Layers, LayoutGrid, List as ListIcon, Star, Eye, ShoppingCart 
} from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import ProductCard from '../../components/products/ProductCard.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';

// ---- QUICK VIEW MODAL COMPONENT ----
function QuickViewModal({ product, onClose }) {
  if (!product) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-full md:w-1/2 bg-slate-50 aspect-square md:aspect-auto">
            <img 
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">In Stock</span>
              {product.featured && <span className="bg-amber-50 text-amber-600 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">Best Seller</span>}
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-sm font-bold text-slate-900">4.9</span>
                <span className="text-xs text-slate-500">(128 Reviews)</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-slate-300" />
              <span className="text-sm font-bold text-[#0082CA]">From ₹{product.basePrice}</span>
            </div>

            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              {product.description || 'Premium commercial printing product with customizable specs, fast turnaround, and vibrant CMYK output.'}
            </p>

            <div className="space-y-4">
              <Link href={`/products/${product._id}`} className="block w-full">
                <button className="w-full py-3.5 bg-[#0082CA] text-white font-bold rounded-xl hover:bg-[#0068A2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Customize & Buy <ArrowUpDown className="w-4 h-4 rotate-90" />
                </button>
              </Link>
              <button onClick={onClose} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors">
                Continue Shopping
              </button>
            </div>
            
            <div className="mt-8 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4 text-xs font-medium text-slate-500">
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

// ---- MAIN PAGE COMPONENT ----
function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [isMounted, setIsMounted] = useState(false);
  
  // Filters State
  const [priceRange, setPriceRange] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setSelectedCategory(categoryParam), [categoryParam]);
  useEffect(() => setSearchTerm(searchParam), [searchParam]);

  // Fetching
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

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

  // Client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...rawProducts];
    
    // Apply Price Filter
    if (priceRange === 'under_500') list = list.filter(p => p.basePrice < 500);
    else if (priceRange === '500_1000') list = list.filter(p => p.basePrice >= 500 && p.basePrice <= 1000);
    else if (priceRange === 'over_1000') list = list.filter(p => p.basePrice > 1000);

    // Apply Sort
    if (sortBy === 'price_asc') return list.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === 'price_desc') return list.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    // Default 'popular' - push featured to top
    return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
  }, [rawProducts, sortBy, priceRange]);

  const handleCategoryChange = (slugOrId) => {
    setSelectedCategory(slugOrId);
    const params = new URLSearchParams(searchParams.toString());
    if (slugOrId) params.set('category', slugOrId);
    else params.delete('category');
    router.push(`/products?${params.toString()}`);
  };

  const clearAllFilters = () => {
    setPriceRange('all');
    handleCategoryChange('');
    if (searchTerm) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push(`/products?${params.toString()}`);
    }
  };

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    ...(activeCatObj ? [{ label: activeCatObj.name }] : searchTerm ? [{ label: `Search: ${searchTerm}` }] : [])
  ];

  return (
    <div className="bg-[#FAFCFF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />

        {/* Page Header */}
        <div className="mt-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              {activeCatObj ? activeCatObj.name : searchTerm ? `Results for "${searchTerm}"` : 'All Print Products'}
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              {activeCatObj?.description || 'Browse our premium catalogue of customizable commercial printing items.'}
            </p>
          </div>
          <div className="text-sm font-bold text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm shrink-0">
            Showing <span className="text-slate-900">{filteredAndSortedProducts.length}</span> Results
          </div>
        </div>

        {/* Active Filters Pill Bar */}
        {(selectedCategory || searchTerm || priceRange !== 'all') && (
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Active Filters:</span>
            {selectedCategory && (
              <span className="bg-[#0082CA]/10 text-[#0082CA] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                Category: {activeCatObj?.name || 'Loading'} <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => handleCategoryChange('')}/>
              </span>
            )}
            {searchTerm && (
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                Search: {searchTerm} <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => { const p = new URLSearchParams(searchParams); p.delete('search'); router.push(`/products?${p.toString()}`) }}/>
              </span>
            )}
            {priceRange !== 'all' && (
              <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                Price: {priceRange === 'under_500' ? '< ₹500' : priceRange === '500_1000' ? '₹500 - ₹1000' : '> ₹1000'} 
                <X className="w-3 h-3 cursor-pointer hover:scale-125 transition-transform" onClick={() => setPriceRange('all')}/>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-red-500 hover:underline ml-2 transition-colors">Clear All</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* LEFT SIDEBAR: FILTERS (Sticky) */}
          <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 space-y-6">
            
            {/* Category Filter */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-[#0082CA]"/> Categories</h3>
              {catLoading || !isMounted ? (
                <div className="space-y-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-6 w-full rounded" />)}</div>
              ) : (
                <div className="space-y-1">
                  <label className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className={`text-sm font-medium ${!selectedCategory ? 'text-[#0082CA] font-bold' : 'text-slate-600'}`}>All Products</span>
                    <input type="radio" name="category" checked={!selectedCategory} onChange={() => handleCategoryChange('')} className="hidden" />
                  </label>
                  {categories.map(cat => {
                    const isSelected = selectedCategory === (cat.slug || cat._id) || selectedCategory === cat._id;
                    return (
                      <label key={cat._id} className="flex items-center justify-between group cursor-pointer p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-[#0082CA] font-bold' : 'text-slate-600 group-hover:text-slate-900'}`}>{cat.name}</span>
                        <input type="radio" name="category" checked={isSelected} onChange={() => handleCategoryChange(cat.slug || cat._id)} className="hidden" />
                        {cat.productCount && <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-slate-200 transition-colors">{cat.productCount}</span>}
                      </label>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Price Filter */}
            <div className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Filter className="w-4 h-4 text-[#0082CA]"/> Price Range</h3>
              <div className="space-y-3">
                {[
                  { id: 'all', label: 'All Prices' },
                  { id: 'under_500', label: 'Under ₹500' },
                  { id: '500_1000', label: '₹500 - ₹1000' },
                  { id: 'over_1000', label: 'Over ₹1000' }
                ].map(pr => (
                  <label key={pr.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${priceRange === pr.id ? 'bg-[#0082CA] border-[#0082CA]' : 'border-slate-300 group-hover:border-[#0082CA]'}`}>
                      {priceRange === pr.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </div>
                    <span className={`text-sm font-medium ${priceRange === pr.id ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>{pr.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Premium Promise Banner */}
            <div className="hidden lg:block bg-gradient-to-br from-[#0082CA] to-blue-800 rounded-[20px] p-6 text-white shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <ShieldCheck className="w-8 h-8 text-white/80 mb-3" />
              <h4 className="font-bold mb-2">Maaza Promise</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium">100% Quality guarantee. We reprint for free if the quality doesn&apos;t meet standards.</p>
            </div>

          </div>

          {/* RIGHT SIDE: PRODUCTS & TOOLBAR */}
          <div className="flex-1 min-w-0">
            
            {/* Toolbar (Sort & View Mode) */}
            <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
              
              {/* View Toggle */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setViewMode('grid')} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#0082CA]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setViewMode('list')} 
                  className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#0082CA]' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <ListIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold rounded-xl focus:ring-[#0082CA] focus:border-[#0082CA] block w-full sm:w-auto p-2.5 cursor-pointer"
                >
                  <option value="popular">Most Popular</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Alphabetical (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Product Grid / List */}
            {!isMounted || prodLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-[380px] rounded-[24px]" />)}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-[24px] border border-slate-200 border-dashed p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">No exact matches found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Try adjusting your filters, removing search terms, or exploring our best sellers.</p>
                <button onClick={clearAllFilters} className="bg-[#0082CA] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0068A2] transition-colors">
                  Clear All Filters
                </button>
              </div>
            ) : (
              <motion.div 
                layout
                className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}
              >
                <AnimatePresence>
                  {filteredAndSortedProducts.map((prod) => (
                    viewMode === 'grid' ? (
                      <div key={prod._id} className="relative group">
                        <ProductCard product={prod} />
                        {/* Quick View Overlay Button */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(prod); }}
                            className="bg-white/90 backdrop-blur-md text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#0082CA] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0"
                          >
                            <Eye className="w-4 h-4" /> Quick View
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* LIST VIEW CARD */
                      <motion.div 
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={prod._id} 
                        className="bg-white p-4 rounded-[24px] border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group"
                      >
                        <div className="w-full sm:w-48 aspect-[4/3] rounded-xl overflow-hidden shrink-0 relative">
                          <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
                          {prod.featured && <div className="absolute top-2 left-2 bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Top Rated</div>}
                        </div>
                        <div className="flex-1 flex flex-col py-2">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h3 className="text-xl font-extrabold text-slate-900 group-hover:text-[#0082CA] transition-colors"><Link href={`/products/${prod._id}`}>{prod.name}</Link></h3>
                              <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">Fast Dispatch Available</p>
                            </div>
                            <div className="text-right">
                              <span className="text-xl font-black text-[#0082CA]">₹{prod.basePrice}</span>
                              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">Excl. GST</p>
                            </div>
                          </div>
                          <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{prod.description || 'Premium quality print material offering exceptional durability and professional finish.'}</p>
                          <div className="mt-auto flex items-center gap-3">
                            <Link href={`/products/${prod._id}`} className="flex-1">
                              <button className="w-full bg-[#0082CA] hover:bg-[#0068A2] text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                                <ShoppingCart className="w-4 h-4" /> Customize Now
                              </button>
                            </Link>
                            <button 
                              onClick={() => setQuickViewProduct(prod)}
                              className="bg-slate-100 text-slate-600 px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination Mock */}
            {!prodLoading && filteredAndSortedProducts.length > 0 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors">1</button>
                <button className="w-10 h-10 rounded-xl bg-[#0082CA] flex items-center justify-center text-white font-bold shadow-sm">2</button>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors">3</button>
                <span className="text-slate-400 font-bold mx-1">...</span>
                <button className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors">Next &rarr;</button>
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

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#0082CA]/20 border-t-[#0082CA] rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Preparing Enterprise Catalogue...</p>
        </div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
