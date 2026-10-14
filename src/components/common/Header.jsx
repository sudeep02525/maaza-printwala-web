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
  Sun,
  Moon,
} from "lucide-react";
import { useCartStore } from '@/store/cartStore.js';
import { useAuthStore } from '@/store/authStore.js';
import { motion, AnimatePresence } from 'framer-motion';
import MegaMenu from '../ui/MegaMenu.jsx';
import Drawer from '../ui/Drawer.jsx';
import axiosInstance from '@/services/axiosInstance.js';
import { useRecentSearches } from '@/hooks/useRecentSearches.js';
import { Clock } from 'lucide-react';
import { track } from '@/lib/track.js';


export default function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.categories || []);
    }
  });

  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || categoriesData?.categories || []);

  const changeLanguage = (nextLocale) => {
    router.replace(pathname, { locale: nextLocale });
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [debounced, setDebounced] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(searchQuery.trim()), 250);
    return () => clearTimeout(id);
  }, [searchQuery]);

  const { data: searchData = {}, isFetching: isSearching } = useQuery({
    queryKey: ['suggestions', debounced],
    queryFn: async () => {
      const res = await axiosInstance.get(`/search/suggestions?q=${encodeURIComponent(debounced)}`);
      return res?.data || { products: [], categories: [], keywords: [], popular: [] };
    },
    enabled: debounced.length >= 2 || isSearchFocused,
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  });

  const products = searchData.products || [];
  const suggestionCategories = searchData.categories || [];
  const keywords = searchData.keywords || [];
  const popular = searchData.popular || [];

  const flatSuggestions = [
    ...products.map(p => ({ type: 'product', ...p })),
    ...suggestionCategories.map(c => ({ type: 'category', ...c })),
    ...keywords.map(k => ({ type: 'keyword', term: k }))
  ];

  const { recent, add: addRecent, clear: clearRecent, remove: removeRecent } = useRecentSearches();

  const commitSearch = (term) => {
    const t = (term || '').trim();
    if (!t) return;
    addRecent(t);
    axiosInstance.post('/search/log', { term: t }).catch(() => {});
    track('Search', { search_string: t });
    router.push(`/products?search=${encodeURIComponent(t)}`);
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const goTo = (item) => {
    if (item.type === 'product') {
      const t = item.name.trim();
      if (t) {
        addRecent(t);
        axiosInstance.post('/search/log', { term: t, originalTerm: t }).catch(() => {});
        track('Search', { search_string: t });
      }
      router.push(`/products/${item.slug || item._id}`);
    } else if (item.type === 'category') {
      commitSearch(item.term || item.name);
    } else {
      commitSearch(item.term);
    }
    setSearchQuery('');
    setIsSearchFocused(false);
  };

  const onSearchKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(i => Math.min(i + 1, flatSuggestions.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(i => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && flatSuggestions[activeIndex]) goTo(flatSuggestions[activeIndex]);
      else if (searchQuery.trim()) {
        router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
        setIsSearchFocused(false);
      }
    }
    else if (e.key === 'Escape') setIsSearchFocused(false);
  };
  const [isMounted, setIsMounted] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const { items, fetchCart } = useCartStore();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setIsDark(document.documentElement.classList.contains('dark'));
    fetchCart();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll(); // Initialize scroll state immediately
    window.addEventListener("scroll", handleScroll);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchCart]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try { localStorage.setItem('theme', 'dark'); } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try { localStorage.setItem('theme', 'light'); } catch (e) {}
    }
  };

  const cartCount = items?.length || 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setIsMobileMenuOpen(false);
  };

  if (!isMounted) return <div className="h-24 w-full bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 left-0 z-50"></div>; // Prevents hydration mismatch and flash

  return (
    <>
      <header 
        className={`w-full z-50 transition-all duration-300 ease-in-out border-b border-[var(--border)] ${
          scrolled 
            ? 'sticky top-0 left-0 bg-[var(--bg-card)]/90 backdrop-blur-xs shadow-xl animate-in slide-in-from-top-4' 
            : 'relative bg-[var(--bg-card)]'
        }`}
      >
        {/* Main Header Bar - Shopping First & Large Search */}
        <div className="max-w-[1550px] mx-auto w-full px-4 md:px-8 h-24 flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 -ml-2 text-[var(--text-main)] hover:text-[var(--text-main)] hover:bg-[var(--border)] rounded transition-colors"
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
                className="h-10 w-auto object-contain dark:hidden"
                style={{ width: 'auto', height: 'auto' }}
              />
              <Image
                src="/logo-maaza-dark.png"
                alt="Maza Printwala"
                width={150}
                height={40}
                priority
                className="h-10 w-auto object-contain hidden dark:block"
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
                className="h-6 w-auto object-contain dark:hidden"
                style={{ width: 'auto', height: 'auto' }}
              />
              <Image
                src="/logo-maaza-dark.png"
                alt="Maza Printwala"
                width={120}
                height={30}
                priority
                className="h-6 w-auto object-contain hidden dark:block"
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
          </div>

          {/* Real API-Backed Search Bar - Prominent & Wide */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchQuery.trim()) {
                commitSearch(searchQuery.trim());
              }
            }}
            className="hidden md:flex flex-1 max-w-3xl mx-6"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setActiveIndex(-1);
                }}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                onKeyDown={onSearchKeyDown}
                role="combobox"
                aria-expanded={isSearchFocused}
                aria-autocomplete="list"
                aria-controls="search-listbox"
                aria-activedescendant={activeIndex >= 0 ? `search-opt-${activeIndex}` : undefined}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-4 pr-12 py-3 bg-[var(--bg-card)] border border-[var(--border)] focus:border-[#0082CA] rounded-md text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] outline-none ring-0 focus:ring-1 focus:ring-[#0082CA] transition-all shadow-none"
              />
              <button
                type="submit"
                className="absolute right-2 w-10 h-10 flex items-center justify-center text-[var(--text-faint)] hover:text-[var(--text-main)] transition-colors bg-transparent"
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
                    onMouseDown={(e) => e.preventDefault()}
                    className="absolute top-full left-0 right-0 mt-1.5 bg-[var(--bg-card)] rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-[var(--border)] overflow-hidden z-[9999]"
                  >
                    {!searchQuery.trim() ? (
                      <div className="p-1.5">
                        {recent.length > 0 && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between px-2.5 pt-2 mb-1.5">
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                                <h4 className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Recent Searches</h4>
                              </div>
                              <button type="button" onClick={clearRecent} className="text-[11px] font-bold text-[#0082CA] hover:underline">Clear</button>
                            </div>
                            <ul role="listbox" className="space-y-0.5">
                              {recent.map((term, i) => (
                                <li key={`recent-${term}`} role="option" aria-selected={activeIndex === i}>
                                  <div className={`w-full flex items-center justify-between px-2.5 py-2 hover:bg-[var(--bg-subtle)] text-[var(--text-main)] transition-colors group rounded-lg ${activeIndex === i ? 'bg-[var(--bg-subtle)]' : ''}`}>
                                    <button type="button" onClick={() => commitSearch(term)} className="flex items-center gap-3 flex-1 text-left">
                                      <Clock className="w-4 h-4 text-[var(--text-faint)] shrink-0" />
                                      <span className="text-[13px] font-medium text-[var(--text-main)] group-hover:text-[#0082CA] truncate transition-colors">{term}</span>
                                    </button>
                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeRecent(term); }} className="text-[var(--text-faint)] hover:text-red-500 p-1 rounded-full hover:bg-red-500/10">
                                      <LogOut className="w-3 h-3" />
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {popular.length > 0 && (
                          <div>
                            <div className="flex items-center gap-1.5 mb-1.5 px-2.5 pt-2">
                              <TrendingUp className="w-3.5 h-3.5 text-[var(--text-faint)]" />
                              <h4 className="text-[11px] font-bold text-[var(--text-faint)] uppercase tracking-widest">Trending Searches</h4>
                            </div>
                            <ul id="search-listbox" role="listbox" className="space-y-0.5">
                              {popular.map((term, i) => {
                                const idx = recent.length + i;
                                return (
                                  <li key={`popular-${term.term}`} role="option" aria-selected={activeIndex === idx} id={`search-opt-${idx}`}>
                                    <button
                                      type="button"
                                      onClick={() => commitSearch(term.term)}
                                      className={`w-full text-left px-2.5 py-2 hover:bg-[var(--bg-subtle)] text-[var(--text-main)] flex items-center gap-3 transition-colors cursor-pointer group rounded-lg ${activeIndex === idx ? 'bg-[var(--bg-subtle)]' : ''}`}
                                    >
                                      <TrendingUp className="w-4 h-4 text-[var(--text-faint)] shrink-0" />
                                      <span className="text-[13px] font-medium text-[var(--text-main)] group-hover:text-[#0082CA] truncate transition-colors">{term.term}</span>
                                    </button>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-1.5">
                        {isSearching && flatSuggestions.length === 0 ? (
                           <div className="p-4 text-center text-[13px] font-medium text-[var(--text-faint)]">Searching...</div>
                        ) : flatSuggestions.length === 0 ? (
                           <div className="p-4 text-center text-[13px] font-medium text-[var(--text-faint)]">
                             No results found for "{searchQuery}"
                           </div>
                        ) : (
                           <div className="mb-1">
                             <ul id="search-listbox" role="listbox" className="space-y-0.5">
                               {flatSuggestions.map((item, i) => (
                                 <li key={`${item.type}-${item.term || item.slug}`} role="option" aria-selected={activeIndex === i} id={`search-opt-${i}`}>
                                   <button
                                     type="button"
                                     onClick={() => goTo(item)}
                                     className={`w-full text-left px-2.5 py-2 hover:bg-[var(--bg-subtle)] flex items-center gap-3 transition-colors cursor-pointer group rounded-lg ${activeIndex === i ? 'bg-[var(--bg-subtle)]' : ''}`}
                                   >
                                     <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[var(--hover)] shrink-0">
                                       {item.type === 'product' ? (
                                          <Package className="w-4 h-4 text-[var(--text-muted)]" />
                                       ) : item.type === 'category' ? (
                                          <Grid className="w-4 h-4 text-[var(--text-muted)]" />
                                       ) : (
                                          <Search className="w-4 h-4 text-[var(--text-muted)]" />
                                       )}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                       <div className="text-[13px] font-bold text-[var(--text-main)] group-hover:text-[#0082CA] truncate transition-colors">
                                         {item.name || item.term}
                                       </div>
                                       {item.type === 'product' && (
                                         <div className="text-[11px] text-[var(--text-muted)] font-medium">Starting from ₹{item.startingPrice}</div>
                                       )}
                                       {item.type === 'category' && (
                                         <div className="text-[11px] text-[var(--text-muted)] font-medium">Category</div>
                                       )}
                                     </div>
                                   </button>
                                 </li>
                               ))}
                             </ul>
                             
                             <button
                               type="button"
                               onClick={() => {
                                 router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
                                 setIsSearchFocused(false);
                               }}
                               className="w-full mt-2 text-center text-[12px] font-bold text-[#0082CA] hover:bg-[#0082CA]/5 py-2 rounded-lg transition-colors"
                             >
                               View all results for “{searchQuery}”
                             </button>
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
              <div className="flex items-center justify-between gap-1 text-[var(--text-main)] hover:text-[var(--text-main)] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-subtle)] font-bold text-sm">
                <Globe className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                <span className="text-center flex-1 w-[30px]">{locale.toUpperCase()}</span>
                <ChevronDown className="w-3 h-3 text-[var(--text-muted)] shrink-0" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full right-0 mt-1 w-32 bg-[var(--bg-card)] rounded-lg shadow-lg border border-[var(--border)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <button 
                    onClick={() => changeLanguage("en")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "en" ? "text-[#0082CA] bg-[var(--bg-subtle)]" : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[#0082CA]"}`}
                  >
                    English (EN)
                  </button>
                  <button 
                    onClick={() => changeLanguage("hi")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "hi" ? "text-[#0082CA] bg-[var(--bg-subtle)]" : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[#0082CA]"}`}
                  >
                    हिंदी (HI)
                  </button>
                  <button 
                    onClick={() => changeLanguage("mr")}
                    className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${locale === "mr" ? "text-[#0082CA] bg-[var(--bg-subtle)]" : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)] hover:text-[#0082CA]"}`}
                  >
                    मराठी (MR)
                  </button>
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[var(--text-main)] hover:text-[#0082CA] transition-colors cursor-pointer p-2 rounded-lg hover:bg-[var(--bg-subtle)]">
              <div className="w-9 h-9 shrink-0 rounded-full bg-[var(--hover)] flex items-center justify-center">
                <PhoneCall className="w-4 h-4 text-[var(--text-muted)]" />
              </div>
              <div className="w-[155px]">
                <p className="font-bold text-[var(--text-main)] truncate">{t.has('header.customerAssistance') ? t('header.customerAssistance') : 'Customer Assistance'}</p>
                <p className="text-[11px] text-[var(--text-muted)] font-medium truncate">
                  {t.has('header.standardBusinessHours') ? t('header.standardBusinessHours') : 'Mon-Sat 10am-7pm'}
                </p>
              </div>
            </div>

            {/* Auth / Account */}
            {!isMounted ? (
              <div className="w-20 h-9 rounded animate-pulse bg-[var(--hover)]" />
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/account"
                  className="flex flex-col items-end hidden sm:flex w-[110px] group text-right"
                  title="My Account & Addresses"
                >
                  <span className="text-xs font-bold text-[var(--text-main)] group-hover:text-[#0082CA] transition-colors truncate w-full text-right">
                    {user?.name}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-medium truncate w-full text-right">
                    {user?.email || "My Account"}
                  </span>
                </Link>
                <Link
                  href="/account"
                  className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full bg-[var(--hover)] text-[var(--text-main)] hover:text-[#0082CA] transition-colors"
                  aria-label="My Account"
                >
                  <User className="w-4 h-4" />
                </Link>
                <button
                  onClick={logout}
                  className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full hover:bg-[var(--border)] text-[var(--text-main)] hover:text-red-600 transition-colors cursor-pointer"
                  aria-label="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 text-[var(--text-main)] hover:text-[#0082CA] transition-colors font-bold text-sm w-[90px]"
              >
                <User className="w-5 h-5 shrink-0" />
                <span className="hidden sm:inline truncate">{t('header.account')}</span>
              </Link>
            )}

            {/* Theme Toggle Button (Light / Dark) */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-400 transition-transform rotate-0 scale-100" />
              ) : (
                <Moon className="w-5 h-5 text-[var(--text-main)] transition-transform rotate-0 scale-100" />
              )}
            </button>

            {/* Cart Icon with Live Count */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-[var(--hover)] text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 group-hover:text-[#0082CA]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-[var(--bg-card)]">
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
            <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('header.searchCatalogue')}
            </label>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[var(--text-faint)] absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('header.searchPlaceholder')}
                className="w-full pl-9 pr-16 py-2.5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded text-sm text-[var(--text-main)] focus:outline-none focus:border-[#0082CA]"
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
            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t('header.printCategories')}
            </span>
            <div className="space-y-1">
              <Link
                href="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between p-3 rounded bg-[var(--hover)] hover:bg-[#0082CA] text-[var(--text-main)] hover:text-white font-bold text-sm transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Grid className="w-4 h-4 text-[#0082CA] group-hover:text-white" />
                  <span>{t('header.allProducts')}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-[var(--text-faint)] group-hover:text-white" />
              </Link>
              
              <Link href="/track-order" className="flex items-center gap-2 p-3 text-[var(--text-main)] hover:bg-[var(--bg-subtle)] rounded font-semibold text-sm transition-colors group">
                <Truck className="w-4 h-4 text-amber-500" />
                <span>{t('header.trackOrder')}</span>
              </Link>

              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded hover:bg-[var(--bg-subtle)] text-[var(--text-main)] hover:text-[var(--text-main)] font-semibold text-sm transition-colors"
                >
                  <span>{cat.name}</span>
                  <ChevronRight className="w-4 h-4 text-[var(--text-faint)]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Mobile Support Note */}
          <div className="pt-4 border-t border-[var(--border)] space-y-2">
            <span className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {t.has('header.customerSupport') ? t('header.customerSupport') : 'Customer Support'}
            </span>
            <div className="p-3 bg-[var(--bg-subtle)] rounded text-xs text-[var(--text-main)] font-medium">
              {t.has('header.supportNote') ? t('header.supportNote') : 'Standard commercial printing assistance available during normal working hours.'}
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
}
