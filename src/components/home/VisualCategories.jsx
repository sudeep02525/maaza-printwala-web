'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React from 'react';
import { Link } from '@/i18n/routing.js';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

const SectionHeader = ({ title, linkText }) => (
  <div className="flex justify-between items-end mb-8">
    <h2 className="text-2xl sm:text-[28px] font-extrabold text-[var(--text-main)] tracking-tight">{title}</h2>
    {linkText && <a href="#" className="text-sm font-semibold text-[#0082CA] hover:underline">{linkText}</a>}
  </div>
);

export default function VisualCategories({ cmsCategoryTiles }) {
  const t = useTranslations();

  const blocks = (cmsCategoryTiles?.blocks && cmsCategoryTiles.blocks.length > 0)
    ? cmsCategoryTiles.blocks
    : [
        {
          title: t.has('categories.business-essentials') ? t('categories.business-essentials') : 'Business Essentials',
          tiles: [
            { name: t.has('categories.visiting-cards') ? t('categories.visiting-cards') : 'Visiting Cards', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262678/maaza-printwala/images/cat_visiting_cards_new_1785478123231.jpg', link: '/visiting-cards', isActive: true },
            { name: t.has('categories.notebooks') ? t('categories.notebooks') : 'Notebooks', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262673/maaza-printwala/images/cat_notebooks_new_1785478132458.jpg', link: '/stationery?sub=notebooks', isActive: true },
            { name: t.has('categories.custom-mugs') ? t('categories.custom-mugs') : 'Custom Mugs', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262674/maaza-printwala/images/cat_mugs_new_1785478141544.jpg', link: '/products?search=mug', isActive: true },
            { name: t.has('categories.custom-clothing-bags-caps') ? t('categories.custom-clothing-bags-caps') : 'Custom Clothing, Bags & Caps', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262671/maaza-printwala/images/cat_clothing_new_1785478162007.jpg', link: '/products?search=apparel', isActive: true },
          ],
        },
        {
          title: t.has('categories.custom-apparel') ? t('categories.custom-apparel') : 'Custom Apparel',
          tiles: [
            { name: t.has('categories.custom-polo-tshirts') ? t('categories.custom-polo-tshirts') : 'Custom Polo T-shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262676/maaza-printwala/images/cat_polo_new_1785478171451.jpg', link: '/products?search=polo', isActive: true },
            { name: t.has('categories.custom-tshirts') ? t('categories.custom-tshirts') : 'Custom T-shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262677/maaza-printwala/images/cat_tshirt_new_1785478181285.jpg', link: '/products?search=t-shirt', isActive: true },
            { name: t.has('categories.custom-formal-shirts') ? t('categories.custom-formal-shirts') : 'Custom Formal Shirts', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262668/maaza-printwala/images/cat_formal_new_1785478190948.jpg', link: '/products?search=apparel', isActive: true },
            { name: t.has('categories.caps') ? t('categories.caps') : 'Caps', img: 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262663/maaza-printwala/images/cat_caps_new_1785478209032.jpg', link: '/products?search=cap', isActive: true },
          ],
        },
      ];

  return (
    <section className="py-14 bg-[var(--bg-page)]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 space-y-16">
        {blocks.map((block, bi) => {
          const activeTiles = (block.tiles || []).filter((t) => t && t.isActive !== false);
          if (activeTiles.length === 0) return null;
          return (
            <div key={`block-${bi}`}>
              <SectionHeader title={block.title} linkText="" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mt-8">
                {activeTiles.map((item, i) => (
                  <motion.div 
                    key={`tile-${bi}-${i}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Link href={item.link || '/products'} className="group flex flex-col gap-3">
                      <div className="aspect-square bg-[var(--hover)] rounded-lg overflow-hidden shadow-sm border border-[var(--border)] relative">
                        <img
                          src={getImageUrl(item.img)}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          alt={item.name}
                        />
                      </div>
                      <h3 className="font-bold text-[var(--text-main)] text-sm">{item.name}</h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
