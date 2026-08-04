'use client';

import React, { useState } from 'react';
import { Link, usePathname } from '@/i18n/routing.js';
import { ArrowRight } from 'lucide-react';
import { categoryData } from '@/config/categoryData.js';
import { useTranslations } from 'next-intl';

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] = useState(null);
  const pathname = usePathname();
  const t = useTranslations();

  const categories = Object.values(categoryData);

  return (
    <nav className="bg-slate-50 text-slate-800 text-sm border-t border-b border-slate-200/50 relative select-none">
      <div className="max-w-[1550px] mx-auto w-full px-4 md:px-8">
        {/* Category Items */}
        <div className="flex items-center justify-between overflow-x-auto no-scrollbar h-14 w-full">
          <Link
            href="/category/all"
            className={`flex items-center h-full px-2 transition-colors shrink-0 ${
              activeCategory === 'view-all' || pathname === "/category/all"
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
            const isCurrentPage = pathname.startsWith(`/category/${cat.slug}`);
            const isActive = isHovered || isCurrentPage;
            return (
              <div
                key={cat.slug}
                className="h-full flex items-center shrink-0 group"
                onMouseEnter={() => setActiveCategory(cat.slug)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={`/category/${cat.slug}`}
                  className={`flex items-center h-full px-2 transition-all ${
                    isActive
                      ? 'text-slate-900 border-b-[3px] border-slate-900 font-bold'
                      : 'text-slate-700 hover:text-slate-900 border-b-[3px] border-transparent'
                  }`}
                >
                  <span className="whitespace-nowrap">{t(`categories.${cat.slug}`) || cat.name}</span>
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
                    {categories.map(cat => (
                      <div key={cat.slug} className="space-y-3">
                        <Link href={`/category/${cat.slug}`} className="text-sm font-bold text-slate-900 hover:text-[#0082CA] transition-colors inline-block mb-1">
                          {t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name}
                        </Link>
                        <ul className="space-y-2">
                          {cat.subcategories.slice(0, 5).map(sub => (
                            <li key={sub.slug}>
                              <Link href={`/category/${cat.slug}/${sub.slug}`} className="text-slate-600 hover:text-[#0082CA] hover:underline text-[13px] transition-colors">
                                {t.has(`categories.${sub.slug}`) ? t(`categories.${sub.slug}`) : sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            const cat = categoryData[activeCategory];
            if (!cat) return null;

            // Group subcategories by their 'group' field
            const groupedSubs = cat.subcategories.reduce((acc, sub) => {
              if (!acc[sub.group]) acc[sub.group] = [];
              acc[sub.group].push(sub);
              return acc;
            }, {});

            const groupKeys = Object.keys(groupedSubs);
            
            const catName = t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name;

            return (
              <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-8">
                <div className="flex gap-12">
                  <div className="w-1/4 shrink-0">
                    <h4 className="text-xl font-bold text-slate-900 mb-3">{catName}</h4>
                    <p className="text-sm text-slate-500 mb-6 pr-4 leading-relaxed">
                      {t.has(`categories.desc-${cat.slug}`) ? t(`categories.desc-${cat.slug}`) : cat.description}
                    </p>
                    <Link href={`/category/${cat.slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0082CA] hover:underline">
                      {t.has('megaMenu.shopAll') ? t('megaMenu.shopAll', { category: catName }) : `Shop All ${catName}`} <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                  
                  <div className="flex-1 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {groupKeys.map(group => {
                      const groupSlug = group.toLowerCase().replace(/ /g, '-');
                      const groupName = t.has(`categories.${groupSlug}`) ? t(`categories.${groupSlug}`) : group;
                      return (
                        <div key={group} className="space-y-3">
                          <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">{groupName}</h4>
                          <ul className="space-y-2.5">
                            {groupedSubs[group].map(sub => (
                              <li key={sub.slug}>
                                <Link href={`/category/${cat.slug}/${sub.slug}`} className="text-slate-600 hover:text-[#0082CA] hover:underline text-[13px] transition-colors flex items-center justify-between group/link">
                                  <span>{t.has(`categories.${sub.slug}`) ? t(`categories.${sub.slug}`) : sub.name}</span>
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )
                    })}
                  </div>
                  
                  <div className="w-1/4 shrink-0 hidden lg:block">
                    <div className="w-full h-48 rounded-lg overflow-hidden relative group/img cursor-pointer">
                      <Link href={`/category/${cat.slug}`}>
                        <img src={cat.banner} alt={catName} className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-4">
                          <span className="text-white font-bold text-lg">
                            {t.has('megaMenu.explore') ? t('megaMenu.explore', { category: catName }) : `Explore ${catName}`}
                          </span>
                        </div>
                      </Link>
                    </div>
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
