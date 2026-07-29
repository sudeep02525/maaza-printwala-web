'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, User, Search, Menu, PhoneCall, Grid, LogOut, ChevronRight } from 'lucide-react';
import { useCartStore } from '../../store/cartStore.js';
import { useAuthStore } from '../../store/authStore.js';
import axiosInstance from '../../services/axiosInstance.js';
import MegaMenu from '../ui/MegaMenu.jsx';
import Drawer from '../ui/Drawer.jsx';

export default function Header() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
  }, [fetchCart]);

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => axiosInstance.get('/categories'),
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  const categories = catData?.data?.categories || [];
  const cartCount = items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-header bg-white border-b border-slate-200">
      {/* Top Announcement Strip (Clean Enterprise Neutral) */}
      <div className="bg-[#F7F8FA] text-slate-700 text-xs py-1.5 px-4 text-center font-medium border-b border-slate-200 select-none">
        <span>Maaza Printwala — India ki Apni Online Printing Press | Commercial B2B &amp; Custom Print Solutions</span>
      </div>

      {/* Main Header Bar - Shopping First & Large Search */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/logo-maaza.png"
              alt="Maaza Printwala — Official Logo"
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Real API-Backed Search Bar - Prominent & Wide */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-3xl mx-6">
          <div className="relative w-full flex items-center shadow-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search business cards, banners, apparel, stationery, brochures..."
              className="w-full pl-10 pr-24 py-2.5 bg-[#F7F8FA] border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#0082CA] focus:ring-1 focus:ring-[#0082CA] transition-all font-medium"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-5 py-1.5 bg-[#0082CA] hover:bg-[#0068A2] text-white text-xs font-semibold rounded-md transition-colors"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Support / Contact Note */}
          <div className="hidden lg:flex items-center gap-2.5 text-slate-700 text-xs pr-4 border-r border-slate-200">
            <div className="p-2 bg-slate-100 text-[#0F172A] rounded">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Customer Assistance</p>
              <p className="text-[11px] text-slate-500 font-medium">Standard Business Hours</p>
            </div>
          </div>

          {/* Account Dropdown / Login */}
          {!isMounted ? (
            <div className="h-9 w-20 bg-slate-100 rounded animate-pulse" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user?.email || 'Active Account'}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out of account"
                className="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-[#0082CA] transition-colors px-3 py-2 rounded hover:bg-slate-50"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          )}

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#0082CA] transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {isMounted && cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-4 px-1 bg-[#0082CA] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop Mega Menu Bar */}
      <div className="hidden md:block">
        <MegaMenu categories={isMounted ? categories : []} isLoading={!isMounted || catLoading} />
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title="Maaza Printwala Navigation"
        side="left"
      >
        <div className="space-y-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Search Catalogue</label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search printing items..."
                className="w-full pl-9 pr-16 py-2.5 bg-[#F7F8FA] border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-[#0082CA]"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 bg-[#0082CA] text-white text-xs font-semibold rounded"
              >
                Go
              </button>
            </div>
          </form>

          {/* Mobile Categories List */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Print Categories</span>
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded bg-slate-100 hover:bg-[#0082CA] text-slate-900 hover:text-white font-bold text-sm transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-[#0082CA] group-hover:text-white" />
                  <span>All Products</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug || cat._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Support Note */}
          <div className="pt-4 border-t border-slate-200 space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">Customer Support</span>
            <div className="p-3 bg-slate-50 rounded text-xs text-slate-700 font-medium">
              Standard commercial printing assistance available during normal working hours.
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}

