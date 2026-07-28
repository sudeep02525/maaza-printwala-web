'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Package, ArrowRight, Filter, Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import Select from '../../components/ui/Select.jsx';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchTerm(searchParam);
  }, [searchParam]);

  // 1. Fetch Categories
  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  // 2. Fetch Products
  const { data: prodData, isLoading: prodLoading } = useQuery({
    queryKey: ['products', selectedCategory, searchTerm],
    queryFn: () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      const queryString = params.toString();
      return axiosInstance.get(queryString ? `/products?${queryString}` : '/products');
    },
    retry: false,
  });

  const categories = catData?.data?.categories || [];
  const rawProducts = prodData?.data?.products || [];

  // Active category object
  const activeCatObj = useMemo(() => {
    if (!selectedCategory) return null;
    return categories.find((c) => (c.slug || c._id) === selectedCategory || c._id === selectedCategory);
  }, [categories, selectedCategory]);

  // Client-side sorting on authoritative product data
  const sortedProducts = useMemo(() => {
    const list = [...rawProducts];
    if (sortBy === 'price_asc') {
      return list.sort((a, b) => (Number(a.basePrice) || 0) - (Number(b.basePrice) || 0));
    }
    if (sortBy === 'price_desc') {
      return list.sort((a, b) => (Number(b.basePrice) || 0) - (Number(a.basePrice) || 0));
    }
    if (sortBy === 'name_asc') {
      return list.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return list;
  }, [rawProducts, sortBy]);

  const handleCategoryChange = (slugOrId) => {
    setSelectedCategory(slugOrId);
    const params = new URLSearchParams(searchParams.toString());
    if (slugOrId) {
      params.set('category', slugOrId);
    } else {
      params.delete('category');
    }
    router.push(`/products?${params.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 select-none">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Print Catalogue', href: '/products' },
          ...(activeCatObj ? [{ label: activeCatObj.name }] : searchTerm ? [{ label: `Search: "${searchTerm}"` }] : [{ label: 'All Products' }]),
        ]}
      />

      {/* Header & Description Banner */}
      <Card className="p-6 sm:p-8 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">
              {activeCatObj ? 'Category Showcase' : searchTerm ? 'Search Results' : 'Commercial Print Library'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              {activeCatObj ? activeCatObj.name : searchTerm ? `Results for "${searchTerm}"` : 'Explore Custom Print Products'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {activeCatObj?.description ||
                'Select a product to customize specifications, view tiered volume savings, and submit your artwork or template.'}
            </p>
          </div>

          {/* Result Stats */}
          <div className="shrink-0 text-left md:text-right bg-slate-800/80 p-4 rounded-xl border border-slate-700/60">
            <span className="text-[11px] uppercase font-bold text-slate-400 block">Available Items</span>
            <span className="text-2xl font-black text-amber-400">{rawProducts.length}</span>
            <span className="text-xs text-slate-400 ml-1">products</span>
          </div>
        </div>
      </Card>

      {/* Active Search Notification */}
      {searchTerm && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-xs text-blue-900">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0A58CA]" />
            <span>Showing filtered results matching: <strong>&quot;{searchTerm}&quot;</strong></span>
          </div>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-1 font-bold text-[#0A58CA] hover:underline"
          >
            <X className="w-4 h-4" /> Clear Search
          </button>
        </div>
      )}

      {/* Filter & Sorting Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              !selectedCategory
                ? 'bg-[#0A58CA] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Products</span>
          </button>
          {categories.map((cat) => {
            const isSelected = selectedCategory === (cat.slug || cat._id) || selectedCategory === cat._id;
            return (
              <button
                key={cat._id}
                onClick={() => handleCategoryChange(cat.slug || cat._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#0A58CA] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Client-Side Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <ArrowUpDown className="w-4 h-4 text-slate-500 shrink-0 hidden sm:block" />
          <span className="text-xs font-bold text-slate-700 whitespace-nowrap hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0A58CA]/20 focus:border-[#0A58CA] cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {prodLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-80 rounded-2xl" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <Card className="p-16 text-center max-w-lg mx-auto space-y-4 border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-black text-slate-900">No Printing Products Found</h3>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            We couldn&apos;t find any commercial printing items matching your current category or search filters.
          </p>
          <div className="pt-2 flex items-center justify-center gap-3">
            {selectedCategory && (
              <Button variant="outline" size="sm" onClick={() => handleCategoryChange('')}>
                Show All Categories
              </Button>
            )}
            {searchTerm && (
              <Button variant="primary" size="sm" onClick={handleClearSearch}>
                Clear Search Query
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {sortedProducts.map((prod) => (
            <Card key={prod._id} hover className="flex flex-col overflow-hidden border-slate-200 group">
              <Link href={`/products/${prod.slug || prod._id}`} className="block aspect-16/10 bg-slate-100 relative overflow-hidden">
                {prod.images?.[0]?.url || prod.images?.[0] ? (
                  <img
                    src={prod.images?.[0]?.url || prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Package className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider text-slate-800 shadow-xs">
                  {prod.category?.name || 'Commercial Press'}
                </span>
                {prod.isFeatured && (
                  <span className="absolute top-3 right-3 bg-[#D63384] text-white px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider shadow-xs">
                    Featured
                  </span>
                )}
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link href={`/products/${prod.slug || prod._id}`}>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-[#0A58CA] transition-colors">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2 mt-2 font-normal leading-relaxed">
                    {prod.shortDescription}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Starting From</span>
                    <span className="text-xl font-black text-slate-900">₹{prod.basePrice}</span>
                    <span className="text-[10px] text-slate-500"> / pc</span>
                  </div>
                  <Link href={`/products/${prod.slug || prod._id}`}>
                    <Button variant="primary" size="sm" className="shadow-xs group-hover:bg-[#084298]">
                      <span>Configure & Price</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0A58CA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading commercial print catalogue...</p>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
