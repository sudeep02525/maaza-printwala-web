'use client';

import React, { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing.js';
import { X, Sparkles, ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';

export default function OfferStrip() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data } = useQuery({
    queryKey: ['cms-offer-strip'],
    queryFn: async () => {
      const res = await axiosInstance.get('/cms/key/offer_strip');
      return res.data?.content || null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const strip = data?.content;
  const isCmsActive = data?.isActive !== false && strip?.isActive !== false;
  const text = strip?.text?.trim();

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && text) {
      const dismissed = sessionStorage.getItem(`mp_dismiss_offer_${encodeURIComponent(text)}`);
      if (dismissed === 'true') {
        setIsDismissed(true);
      }
    }
  }, [text]);

  if (!mounted || !strip || !isCmsActive || !text || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== 'undefined' && text) {
      sessionStorage.setItem(`mp_dismiss_offer_${encodeURIComponent(text)}`, 'true');
    }
  };

  const getThemeClass = (theme) => {
    switch (theme) {
      case 'dark':
        return 'bg-slate-900 text-white';
      case 'amber':
        return 'bg-amber-500 text-slate-950 font-medium';
      case 'emerald':
        return 'bg-emerald-600 text-white';
      case 'crimson':
      case 'rose':
        return 'bg-rose-600 text-white';
      case 'blue':
      case 'primary':
      default:
        return 'bg-[#0082CA] text-white';
    }
  };

  const themeClass = getThemeClass(strip.bgStyle || strip.theme);
  const linkText = strip.linkLabel || strip.linkText;
  const linkUrl = strip.linkTarget || strip.linkUrl;

  return (
    <div className={`relative z-40 px-4 py-2 text-xs sm:text-sm transition-colors shadow-2xs ${themeClass}`}>
      <div className="w-full max-w-[1550px] mx-auto flex items-center justify-center relative pr-7 sm:pr-8">
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug">
          {strip.badge && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-black/15 dark:bg-white/20">
              <Sparkles className="w-3 h-3" />
              {strip.badge}
            </span>
          )}
          <span className="font-semibold">{text}</span>
          {linkText && linkUrl && (
            <Link
              href={linkUrl}
              className="font-bold underline hover:no-underline inline-flex items-center gap-1 ml-1 cursor-pointer"
            >
              <span>{linkText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
        <button
          onClick={handleDismiss}
          type="button"
          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/20 transition-colors cursor-pointer"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
