'use client';

import React from 'react';
import { Link } from '@/i18n/routing.js';
import { motion } from 'framer-motion';

import { useTranslations } from 'next-intl';

const SectionHeader = ({ title, linkText }) => (
  <div className="flex justify-between items-end mb-8">
    <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
    {linkText && <a href="#" className="text-sm font-semibold text-[#0082CA] hover:underline">{linkText}</a>}
  </div>
);

export default function VisualCategories() {
  const t = useTranslations();

  return (
    <section className="py-14 bg-[#fafafa]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 space-y-16">
        
        {/* Business Essentials Block */}
        <div>
          <SectionHeader title={t.has('categories.business-essentials') ? t('categories.business-essentials') : 'Business Essentials'} linkText="" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {[
              { name: t.has('categories.visiting-cards') ? t('categories.visiting-cards') : 'Visiting Cards', img: '/images/cat_visiting_cards_new_1785478123231.png' },
              { name: t.has('categories.notebooks') ? t('categories.notebooks') : 'Notebooks', img: '/images/cat_notebooks_new_1785478132458.png' },
              { name: t.has('categories.custom-mugs') ? t('categories.custom-mugs') : 'Custom Mugs', img: '/images/cat_mugs_new_1785478141544.png' },
              { name: t.has('categories.custom-clothing-bags-caps') ? t('categories.custom-clothing-bags-caps') : 'Custom Clothing, Bags & Caps', img: '/images/cat_clothing_new_1785478162007.png' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href="/category/all" className="group flex flex-col gap-3">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200 relative">
                    <img src={item.img} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Love your new look Block */}
        <div>
          <SectionHeader title={t.has('categories.custom-apparel') ? t('categories.custom-apparel') : 'Custom Apparel'} linkText="" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
            {[
              { name: t.has('categories.custom-polo-tshirts') ? t('categories.custom-polo-tshirts') : 'Custom Polo T-shirts', img: '/images/cat_polo_new_1785478171451.png' },
              { name: t.has('categories.custom-tshirts') ? t('categories.custom-tshirts') : 'Custom T-shirts', img: '/images/cat_tshirt_new_1785478181285.png' },
              { name: t.has('categories.custom-formal-shirts') ? t('categories.custom-formal-shirts') : 'Custom Formal Shirts', img: '/images/cat_formal_new_1785478190948.png' },
              { name: t.has('categories.caps') ? t('categories.caps') : 'Caps', img: '/images/cat_caps_new_1785478209032.png' }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Link href="/category/all" className="group flex flex-col gap-3">
                  <div className="aspect-square bg-slate-100 rounded-lg overflow-hidden shadow-sm border border-slate-200 relative">
                    <img src={item.img} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={item.name} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
