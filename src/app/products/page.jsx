'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Package, Filter, Search, X, SlidersHorizontal, ArrowUpDown, Layers } from 'lucide-react';
import axiosInstance from '../../services/axiosInstance.js';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import Breadcrumbs from '../../components/ui/Breadcrumbs.jsx';
import ProductCard from '../../components/products/ProductCard.jsx';

function CatalogueContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchTerm, setSearchTerm] = useState(searchParam);
  const [sortBy, setSortBy] = useState('default');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    if (!isMounted || !selectedCategory) return null;
    return categories.find((c) => (c.slug || c._id) === selectedCategory || c._id === selectedCategory);
  }, [isMounted, categories, selectedCategory]);

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

  // Build dynamic breadcrumb hierarchy supporting unlimited nesting
  const breadcrumbItems = useMemo(() => {
    const items = [{ label: 'Print Catalogue', href: '/products' }];
    if (!isMounted) {
      items.push({ label: 'All Products' });
      return items;
    }
    if (activeCatObj) {
      if (activeCatObj.parent && typeof activeCatObj.parent === 'object') {
        items.push({ label: activeCatObj.parent.name, href: `/products?category=${activeCatObj.parent.slug || activeCatObj.parent._id}` });
      } else if (activeCatObj.parentName) {
        items.push({ label: activeCatObj.parentName });
      }
      items.push({ label: activeCatObj.name });
    } else if (searchTerm) {
      items.push({ label: `Search: "${searchTerm}"` });
    } else {
      items.push({ label: 'All Products' });
    }
    return items;
  }, [activeCatObj, searchTerm, isMounted]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-section space-y-6 select-none font-sans">
      {/* Breadcrumbs */}
      <Breadcrumbs items={breadcrumbItems} />

      {/* Header & Description Banner (Bright Clean White Container) */}
      <Card className="p-6 sm:p-8 bg-white text-slate-900 border-slate-200 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold text-[#0082CA] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>{activeCatObj ? 'Category Showcase' : searchTerm ? 'Search Results' : 'Commercial Print Library'}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeCatObj ? activeCatObj.name : searchTerm ? `Results for "${searchTerm}"` : 'Explore Custom Print Products'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {activeCatObj?.description ||
                'Select a product to customize specifications, view tiered volume savings, and submit your artwork or template.'}
            </p>
          </div>

          {/* Result Stats */}
          <div className="shrink-0 text-left md:text-right bg-[#F7F8FA] p-4 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Available Items</span>
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-2xl font-black text-[#0082CA]">{rawProducts.length}</span>
              <span className="text-xs font-bold text-slate-600">products</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Search Notification */}
      {searchTerm && (
        <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-xl flex items-center justify-between text-xs text-blue-900 font-medium">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[#0082CA]" />
            <span>Showing filtered results matching: <strong className="font-bold">&quot;{searchTerm}&quot;</strong></span>
          </div>
          <button
            onClick={handleClearSearch}
            className="flex items-center gap-1 font-bold text-[#0082CA] hover:underline"
          >
            <X className="w-4 h-4" /> Clear Search
          </button>
        </div>
      )}

      {/* Filter & Sorting Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        {/* Category Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              !selectedCategory
                ? 'bg-[#0082CA] text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>All Products</span>
          </button>
          {!isMounted || catLoading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 w-24 bg-slate-100 animate-pulse rounded-lg shrink-0" />
            ))
          ) : (
            categories.map((cat) => {
              const isSelected = selectedCategory === (cat.slug || cat._id) || selectedCategory === cat._id;
              const countText = cat.productCount ? ` (${cat.productCount})` : '';
              return (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat.slug || cat._id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-[#0082CA] text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{cat.name}{countText}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Client-Side Sort Dropdown */}
        <div className="flex items-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          <span className="text-xs font-bold text-slate-600 whitespace-nowrap hidden sm:inline">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-[#F7F8FA] border border-slate-200 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#0082CA] focus:border-[#0082CA] cursor-pointer"
          >
            <option value="default">Default Order</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Product Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* High-Density Products Grid (6 Columns on Large Screens) */}
      {!isMounted || prodLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <Skeleton key={i} className="h-72 rounded-lg" />
          ))}
        </div>
      ) : sortedProducts.length === 0 ? (
        <Card className="p-16 text-center max-w-lg mx-auto space-y-4 border-slate-200">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No Printing Products Found</h3>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-5">
          {sortedProducts.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
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
        <div className="w-10 h-10 border-4 border-[#0082CA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading commercial print catalogue...</p>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  );
}
