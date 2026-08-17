'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React, { useState, useEffect, Suspense, useMemo, use } from 'react';
import { Link, useRouter, usePathname } from '@/i18n/routing.js';
import { useSearchParams, useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, Filter, Search, X, SlidersHorizontal, ArrowUpDown, 
  LayoutGrid, List as ListIcon, Star, Eye, ShoppingCart, ChevronDown, ChevronRight, CheckCircle2, ShieldCheck, Plus, Minus
} from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import Breadcrumbs from '@/components/ui/Breadcrumbs.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import Skeleton from '@/components/ui/Skeleton.jsx';
import PageSkeleton from '@/components/ui/PageSkeleton.jsx';
// removed categoryData import
import { useTranslations, useLocale } from 'next-intl';

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
      <div key={idx} className={`bg-white transition-all duration-500 ${isActive ? 'shadow-[0_4px_20px_rgba(0,0,0,0.08)] z-10 relative' : ''}`}>
        <button 
          className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none transition-colors"
          onClick={() => setActiveFaq(isActive ? null : idx)}
        >
          <span className="font-bold text-slate-800 text-[15px] pr-4">{faq.question || faq.q}</span>
          {isActive ? (
            <Minus className="w-5 h-5 text-slate-600 flex-shrink-0" />
          ) : (
            <Plus className="w-5 h-5 text-slate-900 flex-shrink-0" />
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
              <div className="px-5 pb-5 text-[14px] text-slate-600 leading-relaxed pr-8">
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
      <div className="flex flex-col border border-slate-200 divide-y divide-slate-200 bg-white">
        {faqs.filter((_, i) => i % 2 === 0).map((faq, i) => renderFaq(faq, i * 2))}
      </div>
      <div className="flex flex-col border border-slate-200 divide-y divide-slate-200 bg-white">
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

  const handleSubcategoryClick = (subSlug) => {
    router.push(`/${selectedCategorySlug}/${subSlug}`);
  };

  const breadcrumbItems = [
    ...(activeCatObj ? [{ label: t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name, href: `/${activeCatObj.slug}` }] : []),
    ...(activeSubcategory && activeCatObj ? [{ label: activeCatSubs.find(s => s.slug === activeSubcategory)?.name || activeSubcategory }] : []),
    ...(searchTerm ? [{ label: `${t('common.search')}: ${searchTerm}` }] : [])
  ];

  return (
    <div className="bg-[#FAFCFF] min-h-screen">
      <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 select-none font-sans">
        
        <Breadcrumbs items={breadcrumbItems} />



        {/* 3. PRODUCT GRID SECTION */}
        <div className="mb-16">
          <div className="flex items-center justify-end mb-8">
            {activeSubcategory && (
              <button onClick={() => handleSubcategoryClick(activeSubcategory)} className="text-sm font-bold text-[#0082CA] hover:underline flex items-center gap-1">
                {t('categoryPage.viewAll')} {activeCatObj?.name} <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="w-full lg:w-72 shrink-0 space-y-6">
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

            {/* RIGHT SIDE: PRODUCTS */}
            <div className="flex-1 min-w-0">
              


              {/* Product Grid / List */}
              {!isMounted || prodLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => <Skeleton key={i} className="h-[380px] rounded-lg" />)}
                </div>
              ) : filteredAndSortedProducts.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 text-slate-300">
                    <Search className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-3">{t('categoryPage.noProductsTitle')}</h3>
                  <p className="text-base text-slate-500 max-w-md mx-auto mb-8 font-medium">
                    {t('categoryPage.noProductsDesc', { 
                      category: activeCatObj 
                        ? (t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name)
                        : (locale === 'hi' ? 'इस श्रेणी' : locale === 'mr' ? 'या श्रेणीत' : 'this category') 
                    })}
                  </p>
                  <Link href="/all" className="bg-[#0082CA] hover:bg-[#0068A2] text-white px-8 py-3 rounded-lg font-bold transition-all shadow-md shadow-[#0082CA]/20">
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
                          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row gap-6 group h-full">
                            <div className="w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0 relative">
                              <img src={getImageUrl(prod.images?.[0]) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={prod.name} />
                            </div>
                            <div className="flex-1 flex flex-col py-2">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#0082CA] transition-colors"><Link href={`/products/${prod._id}`}>{prod.name}</Link></h3>
                                  <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">{t('product.fastDispatch')}</p>
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

        {/* 4. INFORMATION / SEO SECTION */}
        {activeCatObj?.seoContent && (
          <div className="mb-12 bg-white rounded-lg p-6 md:p-10 border border-slate-200 shadow-sm">
            <h1 className="text-3xl font-black text-slate-900 mb-4">{t.has(`categories.${activeCatObj.slug}`) ? t(`categories.${activeCatObj.slug}`) : activeCatObj.name}</h1>
            <p className="text-lg text-slate-600 font-medium mb-6">
              {activeCatObj.description}
            </p>
            <div 
              className="prose prose-slate prose-lg max-w-5xl prose-h2:text-3xl prose-h2:font-extrabold prose-h2:text-slate-900 prose-h2:mb-6 prose-p:text-slate-600 prose-p:leading-relaxed"
              dangerouslySetInnerHTML={{ __html: activeCatObj.seoContent }}
            />
          </div>
        )}

        {/* 5. FAQ SECTION */}
        {activeCatObj?.faqs && activeCatObj.faqs.length > 0 && (
          <div className="mb-20">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">{t('categoryPage.faqTitle')}</h2>
              <p className="text-slate-500 font-medium">{t('categoryPage.faqDesc', { category: activeCatObj.name.toLowerCase() })}</p>
            </div>
            <FaqAccordion faqs={activeCatObj.faqs} />
          </div>
        )}

      </div>
      
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}

export default function CategoryPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CategoryContent key={unwrappedParams?.slug} />
    </Suspense>
  );
}
