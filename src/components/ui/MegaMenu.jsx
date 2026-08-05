'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing.js';
import { ArrowRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';
import { useTranslations, useLocale } from 'next-intl';

const demoFallbackProducts = {
  'rounded-corner-visiting-cards': 'premium-rounded-corners-visiting-card-8',
  'square-visiting-cards': 'premium-square-visiting-card-7',
  'leaf-visiting-cards': 'premium-die-cut-visiting-card-9',
  'oval-visiting-cards': 'premium-die-cut-visiting-card-9',
  'circle-visiting-cards': 'premium-die-cut-visiting-card-9',
  'custom-shape-visiting-cards': 'premium-die-cut-visiting-card-9',
  'spot-uv-visiting-cards': 'premium-spot-uv-visiting-card-2',
  'raised-foil-visiting-cards': 'premium-gold-foil-visiting-card-23',
  'glossy-visiting-cards': 'premium-glossy-visiting-card-11',
  'matte-visiting-cards': 'premium-matte-visiting-card-30',
  'transparent-visiting-cards': 'premium-transparent-visiting-card-6',
  'velvet-touch-visiting-cards': 'premium-velvet-touch-visiting-card-24',
  'pearl-visiting-cards': 'premium-glossy-visiting-card-11',
  'kraft-visiting-cards': 'premium-textured-visiting-card-5',
  'diamond-visiting-cards': 'premium-die-cut-visiting-card-9',
};

const getDirectLink = (catSlug, subSlug) => {
  return `/${catSlug}/${subSlug}`;
};

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState(null);
  const pathname = usePathname();
  const t = useTranslations();
  const locale = useLocale();

  React.useEffect(() => {
    setActiveCategory(null);
  }, [pathname]);

  const { data: categories = [], isError, error, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      console.log("MegaMenu API Response:", res);
      return res.data?.categories || res.categories || [];
    }
  });

  return (
    <nav className="bg-slate-50 text-slate-800 text-sm border-t border-b border-slate-200/50 relative select-none">
      <div className="max-w-[1550px] mx-auto w-full px-4 md:px-8">
        {/* DEBUG INFO */}
        {isError && <div className="p-2 bg-red-100 text-red-600 text-xs">Error: {error?.message}</div>}
        {isLoading && <div className="p-2 bg-blue-100 text-blue-600 text-xs">Loading categories...</div>}
        {categories.length === 0 && !isLoading && !isError && <div className="p-2 bg-yellow-100 text-yellow-600 text-xs">Categories array is empty!</div>}
        {/* Category Items */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar h-14 w-full">
          <Link
            href="/all"
            onClick={() => setActiveCategory(null)}
            className={`flex items-center h-full px-2 transition-colors shrink-0 ${
              activeCategory === 'view-all' || pathname === "/all"
                ? 'text-slate-900 border-b-[3px] border-slate-900 font-bold'
                : 'text-slate-700 hover:text-slate-900 border-b-[3px] border-transparent hover:border-slate-800'
            }`}
            onMouseEnter={() => setActiveCategory('view-all')}
            onMouseLeave={() => setActiveCategory(null)}
          >
            <span>{t('navigation.viewAll')}</span>
          </Link>

          {categories.map((cat) => {
            const isHovered = activeCategory === cat.slug;
            const isCurrentPage = pathname.startsWith(`/${cat.slug}`);
            const isActive = isHovered || isCurrentPage;
            return (
              <div
                key={cat.slug}
                className="h-full flex items-center shrink-0 group"
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/${cat.slug}`}
                  onClick={() => setActiveCategory(null)}
                  className={`flex items-center h-full px-2 transition-all ${
                    isActive
                      ? 'text-slate-900 border-b-[3px] border-slate-900 font-bold'
                      : 'text-slate-700 hover:text-slate-900 border-b-[3px] border-transparent'
                  }`}
                >
                  <span className="whitespace-nowrap">{t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name}</span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* FULL WIDTH MEGA MENU DROP-DOWN PANEL */}
      {activeCategory && (
        <div 
          className="absolute top-full left-0 w-full bg-white shadow-xl border-b border-slate-200 z-[9998] animate-fade-in"
          onMouseEnter={() => setActiveCategory(activeCategory)}
          onMouseLeave={() => setActiveCategory(null)}
        >
          {(() => {
            if (activeCategory === 'view-all') {
              return (
                <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6">
                    {categories.map(cat => {
                      const allSubs = cat.subcategoryGroups?.flatMap(g => g.items) || [];
                      return (
                        <div key={cat.slug} className="space-y-3">
                          <Link href={`/${cat.slug}`} className="text-sm font-bold text-slate-900 hover:text-[#0082CA] transition-colors inline-block mb-1">
                            {t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name}
                          </Link>
                          <ul className="space-y-2">
                            {allSubs.slice(0, 5).map(sub => (
                              <li key={sub.slug}>
                                <Link 
                                  href={getDirectLink(cat.slug, sub.slug)} 
                                  onClick={() => setActiveCategory(null)}
                                  className="text-slate-600 hover:text-[#0082CA] hover:underline text-[13px] transition-colors"
                                >
                                  {t.has(`categories.${sub.slug}`) ? t(`categories.${sub.slug}`) : sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const cat = categories.find(c => c.slug === activeCategory);
            if (!cat) return null;
            
            return (
              <div className="w-full animate-fade-in-up">
                {/* Main Content Area */}
                <div className="max-w-[1550px] mx-auto px-4 md:px-8 py-8 md:py-10">
                  <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-x-8 gap-y-10">
                    {cat.subcategoryGroups?.map(group => (
                      <div key={group._id || group.name} className="space-y-4">
                        <h4 className="font-bold text-slate-800 text-[15px]">
                          {t.has(`groups.${group.name.toLowerCase().replace(/\s+/g, '-')}`) ? t(`groups.${group.name.toLowerCase().replace(/\s+/g, '-')}`) : group.name}
                        </h4>
                        <ul className="space-y-3">
                          {group.items?.map(sub => (
                            <li key={sub.slug}>
                              <Link 
                                href={getDirectLink(cat.slug, sub.slug)} 
                                onClick={() => setActiveCategory(null)}
                                className="group/item flex items-center gap-2 text-[14px] text-slate-600 hover:text-slate-900 transition-colors"
                              >
                                <span>{t.has(`categories.${sub.slug}`) ? t(`categories.${sub.slug}`) : sub.name}</span>
                                {sub.isNew && (
                                  <span className="bg-sky-300 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">NEW</span>
                                )}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Full Width Bottom Bar */}
                <div className="w-full bg-[#f4f4f4] border-t border-slate-200">
                  <div className="max-w-[1550px] mx-auto px-4 md:px-8">
                    <Link 
                      href={`/${cat.slug}`} 
                      onClick={() => setActiveCategory(null)}
                      className="block w-full py-5 text-[15px] font-bold text-slate-900 hover:text-[#0082CA] transition-colors"
                    >
                      {locale === 'hi' ? 'सभी देखें ' : locale === 'mr' ? 'सर्व पहा ' : 'See All '}
                      {t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </nav>
  );
}
