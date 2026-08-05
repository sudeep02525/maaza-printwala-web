'use client';

import React from 'react';
import { Link } from '@/i18n/routing.js';
import Image from 'next/image';
import { ShieldCheck, Star, Zap, CreditCard } from 'lucide-react';
import heroBannerMain from '../../../public/images/hero_banner_main.png';
import corpGiftingBanner from '../../../public/images/corp_gifting_banner.png';
import visitingCardsBanner from '../../../public/images/visiting_cards_banner.png';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

export default function HeroBanner() {
  const tHero = useTranslations('hero');
  const tTrust = useTranslations('trustStrip');

  return (
    <>
      {/* Visual Banners Section */}
      <section className="bg-white pt-6 pb-8">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Large Banner (65%) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2 relative block rounded-lg overflow-hidden group aspect-[2/1] lg:aspect-auto h-[250px] sm:h-[350px] lg:h-[420px]"
            >
              <Link href="/all" className="relative w-full h-full block">
                <Image 
                  src={heroBannerMain} 
                  alt="Main Promotion" 
                  fill
                  priority
                  placeholder="blur"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/10 to-transparent p-6 sm:p-12 flex flex-col justify-center">
                  <h2 className="text-2xl sm:text-[34px] font-bold text-white leading-tight mb-2 max-w-md drop-shadow-md">
                    {tHero('heading1')}
                  </h2>
                  <p className="text-white text-sm font-medium mb-6 drop-shadow-sm">{tHero('subheading1')}</p>
                  <button className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-sm text-sm w-fit shadow-md hover:bg-slate-100 transition-colors">
                    {tHero('explore')}
                  </button>
                </div>
              </Link>
            </motion.div>

            {/* Right Stacked Banners (35%) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-[320px] sm:h-[350px] lg:h-[420px]">
              {/* Top Right Banner */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative flex-1 rounded-lg overflow-hidden group block"
              >
                <Link href="/corporate-gifts" className="relative w-full h-full block">
                  <Image 
                    src={corpGiftingBanner} 
                    alt="Corporate Gifting" 
                    fill
                    priority
                    placeholder="blur"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-6 flex flex-col justify-end items-center text-center">
                    <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">{tHero('corpGifting')}</h3>
                    <p className="text-slate-200 text-[13px] font-semibold drop-shadow-md mb-2">{tHero('corpDiscount')}</p>
                    <span className="text-white text-sm font-semibold flex items-center gap-1 drop-shadow-md">
                      {tHero('explore')} <span className="text-lg leading-none">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
              
              {/* Bottom Right Banner */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="relative flex-1 rounded-lg overflow-hidden group block"
              >
                <Link href="/business-cards" className="relative w-full h-full block">
                  <Image 
                    src={visitingCardsBanner} 
                    alt="Business Cards" 
                    fill
                    priority
                    placeholder="blur"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end items-center text-center">
                    <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">{tHero('visitingCards')}</h3>
                    <p className="text-slate-200 text-[13px] font-semibold drop-shadow-md mb-2">{tHero('cardsPrice')}</p>
                    <span className="text-white text-sm font-semibold flex items-center gap-1 drop-shadow-md">
                      {tHero('explore')} <span className="text-lg leading-none">&rarr;</span>
                    </span>
                  </div>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip (PrintVenue Style) */}
      <div className="bg-[#fafafa] border-y border-slate-200 py-8">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-x-0 md:divide-x md:divide-slate-200">
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }} className="flex flex-col items-center text-center px-4">
              <ShieldCheck className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{tTrust('qualityTitle')}</h4>
              <p className="text-xs text-slate-500 font-medium">{tTrust('qualityDesc')}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.2 }} className="flex flex-col items-center text-center px-4">
              <Zap className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{tTrust('fastTitle')}</h4>
              <p className="text-xs text-slate-500 font-medium">{tTrust('fastDesc')}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.3 }} className="flex flex-col items-center text-center px-4">
              <Star className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{tTrust('satisfactionTitle')}</h4>
              <p className="text-xs text-slate-500 font-medium">{tTrust('satisfactionDesc')}</p>
            </motion.div>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.4 }} className="flex flex-col items-center text-center px-4">
              <CreditCard className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">{tTrust('secureTitle')}</h4>
              <p className="text-xs text-slate-500 font-medium">{tTrust('secureDesc')}</p>
            </motion.div>

          </div>
        </div>
      </div>
    </>
  );
}
