"use client";

import React, { useState, useEffect } from "react";
import { Link, useRouter, usePathname } from '@/i18n/routing.js';
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import {
  ShoppingBag,
  User,
  Search,
  Menu,
  PhoneCall,
  Grid,
  LogOut,
  ChevronRight,
  Globe,
  ChevronDown,
  Tag,
  Package,
  Sparkles,
  Truck,
  TrendingUp,
} from "lucide-react";
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from '../ui/MegaMenu.jsx';
import Drawer from '../ui/Drawer.jsx';
import axiosInstance from '@/services/axiosInstance.js';
const ANNOUNCEMENTS = [
  <div key="1" className="flex items-center gap-1.5 justify-center">
    <Tag className="w-4 h-4 text-amber-400 shrink-0" />
    <span>Use code PRINT20 for 20% off on your first Corporate Order</span>
  </div>,
  <div key="2" className="flex items-center gap-1.5 justify-center">
    <Package className="w-4 h-4 text-amber-400 shrink-0" />
    <span>Free Shipping on all orders above ₹2000!</span>
  </div>,
  <div key="3" className="flex items-center gap-1.5 justify-center">
    <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
    <span>New: Premium Gold Foiled Business Cards now available</span>
  </div>,
];

const POPULAR_SEARCHES = [
  "Visiting Cards",
  "Flyers",
  "Custom T-Shirts",
  "Coffee Mugs",
  "Letterheads",
];

export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return res.data?.categories || [];
    }
  });

  const changeLanguage = (nextLocale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: searchResults = [], isFetching: isSearching } = useQuery({
    queryKey: ['searchResults', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch.trim()) return [];
      const res = await axiosInstance.get(`/products?search=${encodeURIComponent(debouncedSearch.trim())}`);
      return res.data?.products || [];
    },
    enabled: debouncedSearch.trim().length > 0
  });
  const [isMounted, setIsMounted] = useState(false);
  const { items, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchCart();
    const interval = setInterval(() => {
      setAnnouncementIdx((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll(); // Initialize scroll state immediately
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchCart]);

  const cartCount = items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/all?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsMobileMenuOpen(false);
  };

  if (!isMounted) return <div className="h-24 w-full bg-white border-b border-slate-100 sticky top-0 left-0 z-50"></div>; // Prevents hydration mismatch and flash

  return (
    <>
      <header 
        className={`w-full z-50 transition-all duration-300 ease-in-out border-b border-slate-200 ${
          scrolled 
            ? 'sticky top-0 left-0 bg-white/85 backdrop-blur-xs shadow-xl animate-in slide-in-from-top-4' 
            : 'relative bg-white'
        }`}
      >
        {/* Main Header Bar - Shopping First & Large Search */}
        <div className="max-w-[1550px] mx-auto w-full px-4 md:px-8 h-24 flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-slate-700 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Logo */}
            <Link href="/" className="hidden md:flex items-center shrink-0">
              <Image
                src="/logo-maaza.png"
                alt="Maza Printwala"
                width={150}
                height={40}
                priority
                className="h-10 w-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Mobile Logo (Centered) */}
          <div className="md:hidden absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo-maaza.png"
                alt="Maza Printwala"
                width={120}
                height={30}
                priority
                className="h-6 w-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Real API-Backed Search Bar - Prominent & Wide */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-3xl mx-6"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-300 focus:border-[#0082CA] rounded-md text-sm text-slate-900 outline-none ring-0 focus:ring-1 focus:ring-[#0082CA] transition-all shadow-none"
              />
              <button
                type="submit"
                className="absolute right-2 w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors bg-transparent"
                aria-label="Submit Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 overflow-hidden z-[9999]"
                  >
                    {!searchQuery.trim() ? (
                      <div className="p-1.5">
                        <div className="flex items-center gap-1.5 mb-1.5 px-2.5 pt-2">
                          <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                          <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Popular Searches</h4>
                        </div>
                        <ul className="space-y-0.5">
                          {POPULAR_SEARCHES.map(term => (
                            <li key={term}>
                              <button
                                type="button"
                                onClick={() => {
                                  setSearchQuery(term);
                                  router.push(`/all?search=${encodeURIComponent(term)}`);
                                  setIsSearchFocused(false);
                                }}
                                className="w-full text-left px-2.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-3 transition-colors cursor-pointer group rounded-lg"
                              >
                                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                <span className="text-[13px] font-medium text-slate-700 group-hover:text-[#0082CA] truncate transition-colors">{term}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-1.5">
                        {isSearching ? (
                          <div className="p-4 text-center text-[13px] font-medium text-slate-400">Searching...</div>
                        ) : searchResults.length > 0 ? (
                          <ul className="space-y-0.5">
                            {searchResults.slice(0, 5).map(product => (
                              <li key={product._id}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    router.push(`/${product.category?.slug || 'products'}/${product.slug}`);
                                    setIsSearchFocused(false);
                                    setSearchQuery("");
                                  }}
                                  className="w-full text-left px-2.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-3 transition-colors cursor-pointer group rounded-lg"
                                >
                                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                                  <div className="flex flex-col flex-1 overflow-hidden">
                                    <span className="text-[13px] font-semibold text-slate-700 group-hover:text-[#0082CA] truncate transition-colors">{product.name}</span>
                                    {product.category && <span className="text-[11px] text-slate-400 truncate">{product.category.name}</span>}
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="p-4 text-center text-[13px] font-medium text-slate-400">
                            No products found for "{searchQuery}"
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>

          {/* User Actions & Support */}
          <div className="flex items-center gap-5 sm:gap-8 shrink-0">
            {/* Language Selector */}
            <div className="relative hidden lg:block group w-[90px]">
              <div className="flex items-center justify-between gap-1 text-slate-700 hover:text-slate-900 transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-50 font-bold text-sm">
                <Globe className="w-4 h-4 text-slate-600 shrink-0" />
                <span className="text-center flex-1 w-[30px]">{locale.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-slate-500 shrink-0" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button 
                    onClick={() => changeLanguage("en")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "en" ? "text-[#0082CA] bg-slate-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#0082CA]"}`}
                  >
                    English (EN)
                  </button>
                  <button 
                    onClick={() => changeLanguage("hi")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "hi" ? "text-[#0082CA] bg-slate-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#0082CA]"}`}
                  >
                    हिंदी (HI)
                  </button>
                  <button 
                    onClick={() => changeLanguage("mr")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "mr" ? "text-[#0082CA] bg-slate-50" : "text-slate-700 hover:bg-slate-50 hover:text-[#0082CA]"}`}
                  >
                    मराठी (MR)
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-slate-700 hover:text-[#0082CA] transition-colors cursor-pointer p-2 rounded-lg hover:bg-slate-50">
              <div className="w-9 h-9 shrink-0 rounded-full bg-slate-100 flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-slate-600" />
              </div>
              <div className="w-[155px]">
                <p className="font-bold text-slate-900 truncate">{t.has('header.customerAssistance') ? t('header.customerAssistance') : 'Customer Assistance'}</p>
                <p className="text-[11px] text-slate-500 font-medium truncate">
                  {t.has('header.standardBusinessHours') ? t('header.standardBusinessHours') : 'Mon-Sat 10am-7pm'}
                </p>
              </div>
            </div>

            {/* Auth / Account */}
            {!isMounted ? (
              <div className="w-20 h-9 rounded animate-pulse bg-slate-100" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <div className="flex flex-col items-end hidden sm:flex w-[110px]">
                  <span className="text-xs font-bold text-slate-900 truncate w-full text-right">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate w-full text-right">
                    {user?.email || "Active Account"}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full hover:bg-slate-200 text-slate-700 hover:text-red-600 transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-slate-700 hover:text-[#0082CA] transition-colors font-bold text-sm w-[90px]"
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline truncate">{t('header.account')}</span>
              </Link>
            )}

            {/* Cart Icon with Live Count */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-50 text-slate-700 transition-colors group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-[#0082CA]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Desktop Mega Menu Bar */}
        <div className="hidden md:block">
          <MegaMenu />
        </div>
      </header>



      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        title={t('header.navigation')}
        side="left"
      >
        <div className="space-y-6">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('header.searchCatalogue')}
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-9 pr-16 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-900 focus:outline-none focus:border-[#0082CA]"
              />
              <button
                type="submit"
                className="absolute right-1 px-3 py-1.5 bg-[#0082CA] text-white text-xs font-semibold rounded"
              >
                {t('header.go')}
              </button>
            </div>
          </form>

          {/* Mobile Categories List */}
          <div className="space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t('header.printCategories')}
            </span>
            <div className="space-y-1">
              <Link
                href="/all"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded bg-slate-100 hover:bg-[#0082CA] text-slate-900 hover:text-white font-bold text-sm transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-[#0082CA] group-hover:text-white" />
                  <span>{t('header.allProducts')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
              </Link>
              
              <Link href="/track-order" className="flex items-center gap-2 p-3 text-slate-700 hover:bg-slate-50 rounded font-semibold text-sm transition-colors group">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>{t('header.trackOrder')}</span>
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
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
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              {t.has('header.customerSupport') ? t('header.customerSupport') : 'Customer Support'}
            </span>
            <div className="p-3 bg-slate-50 rounded text-xs text-slate-700 font-medium">
              {t.has('header.supportNote') ? t('header.supportNote') : 'Standard commercial printing assistance available during normal working hours.'}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
