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
  const { items, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
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
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Announcement Strip (Neutral & Professional) */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 text-center font-medium border-b border-slate-800">
        <span>Welcome to Maaza Printwala — India ki Apni Online Printing Press | Standard & Custom Commercial Print Solutions</span>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4 md:gap-8">
        {/* Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="md:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu className="w-6 h-6" />
          </button>

          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0A58CA] via-[#D63384] to-[#FFC107] flex items-center justify-center font-black text-white text-xl shadow-sm group-hover:shadow-md transition-shadow">
              M
            </div>
            <div className="flex flex-col">
              <span className="font-black text-slate-900 text-2xl tracking-tight leading-none group-hover:text-[#0A58CA] transition-colors">MAAZA</span>
              <span className="text-[10px] font-bold text-[#D63384] uppercase tracking-widest mt-0.5">Printwala</span>
            </div>
          </Link>
        </div>

        {/* Real API-Backed Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search custom business cards, flex banners, t-shirts..."
              className="w-full pl-10 pr-24 py-2.5 bg-slate-50 border border-slate-300 rounded-full text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0A58CA]/20 focus:border-[#0A58CA] transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-[#0A58CA] hover:bg-[#084298] text-white text-xs font-bold rounded-full transition-colors shadow-xs"
            >
              Search
            </button>
          </div>
        </form>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Support / Contact Note */}
          <div className="hidden lg:flex items-center gap-2.5 text-slate-700 text-xs pr-4 border-r border-slate-200">
            <div className="p-2 bg-blue-50 text-[#0A58CA] rounded-xl">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900">Customer Assistance</p>
              <p className="text-[11px] text-slate-500 font-medium">Standard Business Hours</p>
            </div>
          </div>

          {/* Account Dropdown / Login */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col items-end hidden sm:flex">
                <span className="text-xs font-bold text-slate-900">{user?.name}</span>
                <span className="text-[10px] text-slate-500 font-medium">{user?.email || 'Active Account'}</span>
              </div>
              <button
                onClick={logout}
                title="Sign out of account"
                className="p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/products"
              className="flex items-center gap-2 text-sm font-bold text-slate-700 hover:text-[#0A58CA] transition-colors px-3 py-2 rounded-xl hover:bg-slate-50"
            >
              <User className="w-5 h-5" />
              <span className="hidden sm:inline">Account</span>
            </Link>
          )}

          {/* Shopping Cart Button */}
          <Link
            href="/cart"
            className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-[#0A58CA] transition-all"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#D63384] text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-xs animate-fade-in">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Desktop Mega Menu Bar */}
      <div className="hidden md:block">
        <MegaMenu categories={categories} isLoading={catLoading} />
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
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Search Products</label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search printing items..."
                className="w-full pl-9 pr-20 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0A58CA]/20 focus:border-[#0A58CA]"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 bg-[#0A58CA] text-white text-xs font-bold rounded-lg"
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
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-[#0A58CA] text-slate-900 hover:text-white font-bold text-sm transition-all group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-[#D63384] group-hover:text-white" />
                  <span>All Products</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/products?category=${cat.slug || cat._id}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-sm transition-colors"
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
            <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-700 font-medium">
              Standard commercial printing assistance available during normal working hours.
            </div>
          </div>
        </div>
      </Drawer>
    </header>
  );
}
