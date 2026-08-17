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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-lg overflow-hidden w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row shadow-2xl relative"
        >
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-full md:w-1/2 bg-slate-50 aspect-square md:aspect-auto">
            <img 
              src={getImageUrl(product.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'} 
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
                <button className="w-full py-3.5 bg-[#0082CA] text-white font-bold rounded-lg hover:bg-[#0068A2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Customize & Buy <ArrowUpDown className="w-4 h-4 rotate-90" />
                </button>
              </Link>
              <button onClick={onClose} className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition-colors">
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
  const [currentPage, setCurrentPage] = useState(1);
  const PRODUCTS_PER_PAGE = 16;
  const [isMounted, setIsMounted] = useState(false);
  
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => setSelectedCategory(categoryParam), [categoryParam]);
  useEffect(() => setSearchTerm(searchParam), [searchParam]);

  // Fetching
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return Array.isArray(res) ? res : (res?.data || res?.categories || []);
    },
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
    
    // Apply Sort
    if (sortBy === 'price_asc') return list.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === 'price_desc') return list.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    // Default 'popular' - push featured to top
    return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
  }, [rawProducts, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedProducts]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const handleCategoryChange = (slugOrId) => {
    setSelectedCategory(slugOrId);
    const params = new URLSearchParams(searchParams.toString());
    if (slugOrId) params.set('category', slugOrId);
    else params.delete('category');
    router.push(`/all?${params.toString()}`);
  };

  const clearAllFilters = () => {
    handleCategoryChange('');
    if (searchTerm) {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('search');
      router.push(`/all?${params.toString()}`);
    }
  };

  const breadcrumbItems = [
    ...(activeCatObj ? [{ label: activeCatObj.name }] : searchTerm ? [{ label: `Search: ${searchTerm}` }] : [{ label: 'All' }])
  ];

  return (
    <div className="bg-[#FAFCFF] min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />


        {/* Active Filters Pill Bar */}
        {(selectedCategory || searchTerm) && (
          <div className="flex flex-wrap items-center gap-2 mb-6 px-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Active:</span>
            {searchTerm && (
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 border border-indigo-100">
                "{searchTerm}" <X className="w-3 h-3 cursor-pointer hover:text-red-500 transition-colors" onClick={() => { const p = new URLSearchParams(searchParams); p.delete('search'); router.push(`/all?${p.toString()}`) }}/>
              </span>
            )}
            <button onClick={clearAllFilters} className="text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">Clear All</button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8 items-start mt-4">
          
          {/* LEFT SIDEBAR: MINIMAL FILTERS */}
          <div className="w-full lg:w-64 shrink-0 space-y-6">
                        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">

              <div className="space-y-2">
                {[
                  { name: 'Availability', options: ['In Stock', 'Pre-order', 'Out of Stock'] },
                  { name: 'Price', options: ['Under ₹500', '₹500 - ₹1000', '₹1000 - ₹5000', 'Above ₹5000'] },
                  { name: 'Material', options: ['Standard Paper', 'Premium Cardstock', 'Matte Finish', 'Glossy'] },
                  { name: 'Printing', options: ['Single Sided', 'Double Sided', 'Full Color', 'Black & White'] },
                  { name: 'Finish', options: ['Gloss', 'Matte', 'Spot UV', 'Foil Stamping'] },
                  { name: 'Size', options: ['Standard', 'Large', 'Custom Size'] },
                  { name: 'Color', options: ['CMYK', 'Pantone', 'Grayscale'] },
                ].map((filter, idx) => (
                  <details key={idx} className="border-t border-slate-100 pt-4 group" open={idx < 2}>
                    <summary className="flex items-center justify-between cursor-pointer list-none mb-3 outline-none [&::-webkit-details-marker]:hidden">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-[#0082CA] transition-colors">{filter.name}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-[#0082CA] group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="flex flex-col gap-2 pl-1 pb-2">
                      {filter.options.map((opt, oIdx) => (
                        <label key={oIdx} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#0082CA] focus:ring-[#0082CA]" />
                          <span className="text-sm text-slate-600">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: PRODUCTS & TOOLBAR */}
          <div className="flex-1 min-w-0">
            

            


            {/* Product Grid / List */}
            {!isMounted || prodLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-[380px] rounded-lg" />)}
              </div>
            ) : filteredAndSortedProducts.length === 0 ? (
              <div className="bg-white rounded-lg border border-slate-200 border-dashed p-16 text-center shadow-sm">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 mb-2">No exact matches found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">Try adjusting your filters, removing search terms, or exploring our best sellers.</p>
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
                        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group h-full">
                          <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0 relative">
                            <img src={getImageUrl(prod.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
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
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >&larr;</button>
                
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                      setCurrentPage(i + 1);
                    }}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-colors ${currentPage === i + 1 ? 'bg-[#0082CA] text-white shadow-sm' : 'border border-slate-200 text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA]'}`}
                  >{i + 1}</button>
                ))}
                
                <button 
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setCurrentPage(prev => Math.min(prev + 1, totalPages));
                  }}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-[#0082CA] hover:text-[#0082CA] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
