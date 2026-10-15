'use client';
import { getImageUrl } from '@/utils/getImageUrl.js';

import React from 'react';
import { Link } from '@/i18n/routing.js';
import { ChevronLeft, ChevronRight, Star, ArrowRight, Heart } from 'lucide-react';
import ProductCard from '../products/ProductCard.jsx';
import HorizontalSlider from '../common/HorizontalSlider.jsx';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';

const SectionHeader = ({ title, subtitle, linkText }) => {
  const tButtons = useTranslations('buttons');
  const text = linkText || tButtons('viewAll');
  return (
    <div className="flex justify-between items-end mb-5 sm:mb-8">
      <div>
        <h2 className="text-xl sm:text-[28px] font-extrabold text-[var(--text-main)] tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">{subtitle}</p>}
      </div>
      {text && (
        <Link href="/products" className="inline-flex items-center gap-1 text-xs sm:text-sm font-semibold text-[#0082CA] hover:underline shrink-0">
          {text} <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </Link>
      )}
    </div>
  );
};

// 1. FEATURED PRODUCTS (Horizontal Scroll)
export const FeaturedSlider = ({ products = [] }) => {
  const tHome = useTranslations('homeSections');
  const locale = useLocale();
  const sub = locale === 'hi' ? 'आपके लिए चुने गए प्रीमियम प्रिंट्स' : locale === 'mr' ? 'तुमच्यासाठी निवडलेले प्रीमियम प्रिंट्स' : 'Handpicked premium prints for you';

  if (!products?.length) return null;

  return (
    <section className="py-8 sm:py-14 bg-[var(--bg-card)] border-b border-[var(--border)] overflow-hidden">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title={tHome('featuredProducts')} subtitle={sub} />
        <HorizontalSlider cardWidthClass="w-[calc(50%-6px)] sm:w-[260px] lg:w-[calc(25%-18px)]">
          {products.map((p) => (
            <ProductCard key={p._id || p.slug} product={p} />
          ))}
        </HorizontalSlider>
      </div>
    </section>
  );
};

// 2. CORPORATE PRINTING (Asymmetrical Layout)
export const CorporateSection = ({ products = [] }) => {
  const tHome = useTranslations('homeSections');
  const locale = useLocale();
  const sub = locale === 'hi' ? 'प्रीमियम क्वालिटी के साथ अपने ब्रांड को बढ़ाएं' : locale === 'mr' ? 'प्रीमियम गुणवत्तेसह आपला ब्रँड वाढवा' : 'Elevate your brand with premium quality';
  const title = locale === 'hi' ? 'प्रीमियम कॉर्पोरेट वेलकम किट' : locale === 'mr' ? 'प्रीमियम कॉर्पोरेट वेलकम किट' : 'Premium Corporate Welcome Kits';
  const desc = locale === 'hi' ? 'नोटबुक, मेटैलिक पेन, और आईडी कार्ड आपके नए कर्मचारियों के लिए एकदम सही हैं।' : locale === 'mr' ? 'तुमच्या नवीन कर्मचाऱ्यांसाठी नोटबुक, मेटॅलिक पेन आणि आयडी कार्ड अगदी योग्य आहेत.' : 'Notebooks, metallic pens, and ID cards bundled perfectly for your new employees.';
  const btn = locale === 'hi' ? 'किट्स एक्सप्लोर करें' : locale === 'mr' ? 'किट्स एक्सप्लोर करा' : 'Explore Kits';

  return (
    <section className="py-16 bg-[var(--bg-subtle)]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title={tHome('corporateGifting')} subtitle={sub} />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Large Hero Banner */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 relative rounded-lg overflow-hidden group"
          >
            <img loading="lazy" src={getImageUrl('/images/cat_corporate_gifts_1785433724640.png')} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Corporate Gifting" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent p-8 flex flex-col justify-end">
              <h3 className="text-3xl font-extrabold text-white mb-3">{title}</h3>
              <p className="text-white/80 text-sm mb-6">{desc}</p>
              <Link href="/corporate-gifts" className="w-fit px-6 py-2.5 bg-[var(--bg-card)] text-[var(--text-main)] font-bold rounded-lg text-sm hover:bg-[#0082CA] hover:text-white transition-colors">
                {btn}
              </Link>
            </div>
          </motion.div>
          
          {/* 2x2 Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 gap-4 sm:gap-6">
            {products.slice(0,4).map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ProductCard product={p} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// 3. WEDDING PRINTING (Elegant Layout)
export const WeddingSection = () => {
  const tHome = useTranslations('homeSections');
  const locale = useLocale();
  const sub = locale === 'hi' ? 'सुंदर निमंत्रण, सेव-द-डेट्स, और व्यक्तिगत रिटर्न गिफ़्ट्स।' : locale === 'mr' ? 'सुंदर आमंत्रणे, सेव-द-डेट्स आणि वैयक्तिकृत रिटर्न गिफ्ट्स.' : 'Elegant invitations, save-the-dates, and personalized return gifts.';
  const cards = [
    { title: locale === 'hi' ? "प्रीमियम निमंत्रण" : locale === 'mr' ? "प्रीमियम आमंत्रणे" : "Premium Invitations", img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", link: "/visiting-cards/premium-cards" },
    { title: locale === 'hi' ? "वेलकम बोर्ड्स" : locale === 'mr' ? "वेलकम बोर्ड्स" : "Welcome Boards", img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", link: "/signage/foam-boards" },
    { title: locale === 'hi' ? "पर्सनलाइज्ड गिफ़्ट्स" : locale === 'mr' ? "पर्सनलाइज्ड गिफ्ट्स" : "Personalised Gifts", img: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=800&q=80", link: "/photo-gifts/personalized-gifts" }
  ];

  return (
    <section className="py-16 bg-rose-50/70 dark:bg-rose-950/20 border-y border-red-100 dark:border-rose-900/30">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8 text-center mb-10">
        <h2 className="text-3xl sm:text-4xl font-serif text-[var(--text-main)] italic tracking-wide mb-3">{tHome('weddingBoutique')}</h2>
        <p className="text-[var(--text-muted)] text-sm">{sub}</p>
      </div>
      
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {cards.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Link href={item.link} className="group block relative rounded-lg overflow-hidden aspect-[4/5] shadow-lg">
                <img loading="lazy" src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={item.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent flex items-end justify-center p-8">
                  <h3 className="text-white font-serif text-2xl tracking-wide">{item.title}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 4. CUSTOM MERCHANDISE (Masonry/Circular Layout)
export const CustomMerchSection = () => {
  const tHome = useTranslations('homeSections');
  const locale = useLocale();
  const sub = locale === 'hi' ? 'गर्व के साथ अपना ब्रांड पहनें' : locale === 'mr' ? 'अभिमानाने तुमचा ब्रँड परिधान करा' : 'Wear your brand with pride';
  const merch = [
    { name: locale === 'hi' ? "पोलो टी-शर्ट" : locale === 'mr' ? "पोलो टी-शर्ट" : "Polo T-Shirts", img: getImageUrl('/images/cat_polo_new_1785478171451.png'), link: "/custom-apparel/polo-t-shirts" },
    { name: locale === 'hi' ? "कॉटन टीज़" : locale === 'mr' ? "कॉटन टीज़" : "Cotton Tees", img: getImageUrl('/images/cat_tshirt_new_1785478181285.png'), link: "/custom-apparel/t-shirts" },
    { name: locale === 'hi' ? "कस्टम मग" : locale === 'mr' ? "कस्टम मग" : "Custom Mugs", img: getImageUrl('/images/cat_mugs_new_1785478141544.png'), link: "/drinkware/coffee-mugs" },
    { name: locale === 'hi' ? "इको पैकेजिंग" : locale === 'mr' ? "इको पॅकेजिंग" : "Eco Packaging", img: getImageUrl('/images/cat_packaging_1785433687115.png'), link: "/packaging" }
  ];

  return (
    <section className="py-16 bg-[var(--bg-card)] border-b border-[var(--border)]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title={tHome('customMerchandise')} subtitle={sub} />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {merch.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "0px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link href={item.link} className="group flex flex-col items-center gap-4 w-full">
                <div className="w-full aspect-square max-w-[280px] rounded-full border border-[var(--border)] overflow-hidden shadow-sm transition-colors bg-[var(--hover)] flex items-center justify-center relative">
                  <img src={item.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.name} />
                </div>
                <span className="text-sm sm:text-base font-bold text-[var(--text-main)] text-center leading-tight group-hover:text-[#0082CA]">{item.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// 5. TOP RATED PRODUCTS (Consistent standard ProductCard grid)
export const TopRatedSection = ({ products = [] }) => {
  const tHome = useTranslations('homeSections');
  const locale = useLocale();
  const sub = locale === 'hi' ? 'हज़ारों व्यवसायों द्वारा पसंद किया गया' : locale === 'mr' ? 'हजारो व्यवसायांना आवडलेले' : 'Loved by thousands of businesses';

  if (!products?.length) return null;

  return (
    <section className="py-14 bg-[var(--bg-subtle)] border-t border-[var(--border)]">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        <SectionHeader title={tHome('topRated')} subtitle={sub} />
        
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {products.slice(0, 8).map((p, i) => (
            <motion.div
              key={`tr-${p._id || 'x'}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
