'use client';

import React, { useState, useEffect, Suspense, useMemo, use } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing.js';
import { useSearchParams, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Filter, Search, X, SlidersHorizontal, ArrowUpDown, 
  LayoutGrid, List as ListIcon, ShieldCheck, Eye, ShoppingCart, ChevronDown
} from 'lucide-react';
import axiosInstance from '../../../../../services/axiosInstance.js';
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import Skeleton from '@/components/ui/Skeleton.jsx';
import { categoryData } from '@/config/categoryData.js';
import { useTranslations } from 'next-intl';

// ---- QUICK VIEW MODAL COMPONENT (Duplicated for standalone subcategory page) ----
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
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=600&q=80'} 
              alt={product.name} 
              className="w-full h-full object-cover mix-blend-multiply"
            />
          </div>
          
          <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">{product.name}</h2>
            
            <div className="flex items-center gap-4 mb-6">
              <span className="text-lg font-bold text-[#0082CA]">₹{product.basePrice}</span>
            </div>

            <p className="text-sm text-slate-600 mb-8 leading-relaxed">
              {product.description || 'Premium commercial printing product with customizable specs, fast turnaround, and vibrant CMYK output.'}
            </p>

            <div className="space-y-4">
              <Link href={`/products/${product._id || product.slug}`} className="block w-full">
                <button className="w-full py-3.5 bg-[#0082CA] text-white font-bold rounded-lg hover:bg-[#0068A2] transition-colors flex items-center justify-center gap-2 shadow-sm">
                  Customize & Buy <ArrowUpDown className="w-4 h-4 rotate-90" />
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function SubcategoryContent() {
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

  useEffect(() => { setIsMounted(true); }, []);

  const selectedCategorySlug = params?.slug || '';
  const selectedSubSlug = params?.subSlug || '';
  const searchTerm = searchParams.get('search') || '';

  // Retrieve active category from static config
  const activeCatObj = categoryData[selectedCategorySlug] || null;
  const activeSubObj = activeCatObj?.subcategories?.find(s => s.slug === selectedSubSlug) || null;

  // We still fetch products generically for now
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products', selectedCategorySlug, selectedSubSlug, searchTerm],
    queryFn: () => {
      const p = new URLSearchParams();
      if (selectedCategorySlug) p.append('category', selectedCategorySlug);
      if (selectedSubSlug) p.append('sub', selectedSubSlug);
      if (searchTerm) p.append('search', searchTerm);
      return axiosInstance.get(p.toString() ? `/products?${p.toString()}` : "/products");
    },
    retry: false,
  });

  const rawProducts = prodData?.data?.products || [];

  // Client-side filtering & sorting
  const filteredAndSortedProducts = useMemo(() => {
    let list = [...rawProducts];
    
    if (sortBy === 'price_asc') return list.sort((a, b) => Number(a.basePrice) - Number(b.basePrice));
    if (sortBy === 'price_desc') return list.sort((a, b) => Number(b.basePrice) - Number(a.basePrice));
    if (sortBy === 'name_asc') return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    
    return list.sort((a, b) => (b.featured === a.featured ? 0 : b.featured ? 1 : -1));
  }, [rawProducts, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAndSortedProducts]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredAndSortedProducts.slice((currentPage - 1) * PRODUCTS_PER_PAGE, currentPage * PRODUCTS_PER_PAGE);

  const breadcrumbItems = [
    ...(activeCatObj ? [{ label: t(`categories.${activeCatObj.slug}`) || activeCatObj.name, href: `/category/${activeCatObj.slug}` }] : []),
    ...(activeSubObj ? [{ label: activeSubObj.name }] : [{ label: selectedSubSlug }]),
    ...(searchTerm ? [{ label: `${t('common.search')}: ${searchTerm}` }] : [])
  ];

  const pageTitle = activeSubObj?.name || 'Products';
  const pageImage = activeSubObj?.image || activeCatObj?.banner || '/images/outdoor_banner.png';

  return (
    <div className="bg-[#FAFCFF] min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />

        {/* 1. HERO SECTION */}
        <div className="mt-6 mb-12 w-full rounded-lg overflow-hidden relative shadow-sm">
          <img 
            src={pageImage} 
            alt={pageTitle} 
            className="w-full object-cover aspect-[21/5] max-h-[350px]"
          />
        </div>

        {/* 3. PRODUCT GRID SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900">
              {pageTitle}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="w-full lg:w-72 shrink-0 space-y-6">
                            <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex items-center gap-2 mb-6 text-[#0082CA]">
                  <SlidersHorizontal className="w-5 h-5" />
                  <h3 className="font-extrabold text-slate-900 text-lg">Filters</h3>
                </div>
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

            {/* RIGHT SIDE: PRODUCTS */}
            <div className="flex-1 min-w-0">
              
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 bg-white p-3 px-4 rounded-lg border border-slate-200 shadow-sm">
                 <p className="text-sm text-slate-600 font-bold">
                   {t('categoryPage.showing')} <span className="text-[#0082CA]">{filteredAndSortedProducts.length}</span> {t('categoryPage.products')}
                 </p>
                 
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2 cursor-pointer group relative bg-slate-50 px-3 py-1.5 rounded border border-slate-200">
                     <span className="text-xs font-bold text-slate-600">{t('filters.sort')}:</span>
                     <select 
                       value={sortBy} 
                       onChange={(e) => setSortBy(e.target.value)}
                       className="text-sm font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer outline-none"
                     >
                       <option value="popular">{t('filters.popularity')}</option>
                       <option value="price_asc">{t('filters.priceLowHigh')}</option>
                       <option value="price_desc">{t('filters.priceHighLow')}</option>
                       <option value="name_asc">{t('filters.alpha')}</option>
                     </select>
                   </div>
                   <div className="flex items-center bg-slate-100 rounded p-1 border border-slate-200">
                     <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-[#0082CA]' : 'text-slate-400 hover:text-slate-600'}`}>
                       <LayoutGrid className="w-4 h-4" />
                     </button>
                     <button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-[#0082CA]' : 'text-slate-400 hover:text-slate-600'}`}>
                       <ListIcon className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
              </div>

              {/* Product Grid / List */}
              {!isMounted || prodLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-[380px] rounded-lg" />)}
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-3">{t('categoryPage.noProductsTitle')}</h3>
                  <p className="text-base text-slate-500 max-w-md mx-auto mb-8 font-medium">
                    {t('categoryPage.noProductsDesc', { category: pageTitle })}
                  </p>
                  <Link href="/category/all" className="bg-[#0082CA] hover:bg-[#0068A2] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-[#0082CA]/20">
                    {t('categoryPage.exploreAll')}
                  </Link>
                </div>
              ) : (
                <motion.div 
                  layout
                  className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6" : "flex flex-col gap-4"}
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
                            {/* Quick View Button */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 pointer-events-none group-hover:pointer-events-auto">
                              <button 
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickViewProduct(prod); }}
                                className="bg-white/90 backdrop-blur-md text-slate-900 font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-2 hover:bg-[#0082CA] hover:text-white transition-colors transform translate-y-4 group-hover:translate-y-0 border border-slate-200 hover:border-[#0082CA]"
                              >
                                <Eye className="w-4 h-4" /> {t('common.quickView')}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group h-full">
                            <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0 relative">
                              <img src={prod.images?.[0] || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
                            </div>
                            <div className="flex-1 flex flex-col py-2">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0082CA] transition-colors"><Link href={`/products/${prod._id}`}>{prod.name}</Link></h3>
                                  <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">Fast Dispatch Available</p>
                                </div>
                                <div className="text-right">
                                  <span className="text-xl font-black text-[#0082CA]">₹{prod.basePrice}</span>
                                </div>
                              </div>
                              <p className="text-sm text-slate-500 font-medium line-clamp-2 mb-6">{prod.description || 'Premium quality print material offering exceptional durability and professional finish.'}</p>
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
      </div>
      
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}

export default function SubcategoryPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAFCFF] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#0082CA]/20 border-t-[#0082CA] rounded-full animate-spin"></div>
      </div>
    }>
      <SubcategoryContent key={unwrappedParams?.subSlug} />
    </Suspense>
  );
}
