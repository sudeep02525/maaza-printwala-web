'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing.js';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const SectionHeader = ({ title }) => (
  <div className="flex justify-between items-end mb-8">
    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
  </div>
);

export default function ExploreCategories({ categories = [] }) {
  const [canScrollExploreLeft, setCanScrollExploreLeft] = useState(false);
  const tHome = useTranslations('homeSections');
  const t = useTranslations();

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title={tHome('shopByCategory')} />
        <div className="relative group/slider mt-10">
          {canScrollExploreLeft && (
            <button 
              onClick={() => document.getElementById('explore-categories-scroll')?.scrollBy({ left: -300, behavior: 'smooth' })} 
              className="absolute -left-4 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50"
            >
              <ChevronLeft className="w-6 h-6 text-slate-800" />
            </button>
          )}

          <div 
            id="explore-categories-scroll" 
            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4" 
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            onScroll={(e) => setCanScrollExploreLeft(e.currentTarget.scrollLeft > 0)}
          >
            {categories.length === 0 ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="snap-start shrink-0 flex flex-col items-center gap-4 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(20%-1.2rem)] animate-pulse">
                  <div className="w-full aspect-square max-w-[280px] rounded-full bg-slate-200"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
              ))
            ) : (
              categories.slice(0, 10).map((cat, index) => {
                const exploreImages = [
                  '/images/explore_business_cards_1785478383406.png',
                  '/images/explore_tshirts_1785478392413.png',
                  '/images/cat_visiting_cards_new_1785478123231.png',
                  '/images/cat_notebooks_new_1785478132458.png',
                  '/images/cat_clothing_new_1785478162007.png',
                  '/images/cat_mugs_new_1785478141544.png'
                ];
                const displayImage = exploreImages[index % exploreImages.length];

                return (
                  <motion.div 
                    key={cat._id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="snap-start shrink-0 w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1rem)] md:w-[calc(20%-1.2rem)]"
                  >
                    <Link href={`/${cat.slug || cat._id}`} className="group flex flex-col items-center gap-4 w-full">
                      <div className="w-full aspect-square max-w-[280px] rounded-full border border-slate-200 overflow-hidden shadow-sm transition-colors bg-[#f1f1f1] flex items-center justify-center relative">
                        <img src={displayImage} alt={cat.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <span className="text-sm sm:text-base font-bold text-slate-700 text-center leading-tight group-hover:text-[#0082CA]">{t(`categories.${cat.slug}`) || cat.name}</span>
                    </Link>
                  </motion.div>
                );
              })
            )}
          </div>

          <button 
            onClick={() => document.getElementById('explore-categories-scroll')?.scrollBy({ left: 300, behavior: 'smooth' })} 
            className="absolute -right-4 top-[40%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-lg border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50"
          >
            <ChevronRight className="w-6 h-6 text-slate-800" />
          </button>
        </div>
      </div>
    </section>
  );
}
