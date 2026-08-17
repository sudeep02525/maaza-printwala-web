'use client';

import React, { useState } from 'react';
import { Link } from '@/i18n/routing.js';
import Image from 'next/image';
import { Mail, MapPin, Phone, Share2, Globe, MessageCircle, AtSign, CheckCircle2, CreditCard, ShieldCheck, Lock, ChevronDown, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';

export default function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await axiosInstance.get('/categories');
      return Array.isArray(res.data) ? res.data : (res.data?.data || res.data?.categories || []);
    }
  });
  const categories = Array.isArray(categoriesData) ? categoriesData : (categoriesData?.data || categoriesData?.categories || []);
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = (section) => {
    setOpenSection(prev => prev === section ? null : section);
  };

  const FooterAccordionItem = ({ title, id, children }) => {
    const isOpen = openSection === id;
    return (
      <div className="flex flex-col border-b border-slate-200 md:border-none py-4 md:py-0">
        <button 
          onClick={() => toggleSection(id)}
          className="flex items-center justify-between w-full md:cursor-default md:pointer-events-none group outline-none"
        >
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{title}</h4>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 md:hidden ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        <div className={`grid transition-all duration-300 ease-in-out md:!grid-rows-[1fr] md:!opacity-100 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
          <div className="overflow-hidden">
            <div className="pt-4 md:pt-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <footer className="bg-white text-slate-700 pt-12 pb-8 select-none font-sans mt-auto">
      <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
        
        {/* Pre-Footer Newsletter Section */}
        <div className="bg-white rounded-2xl p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="text-center md:text-left max-w-lg relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{t('footer.subscribeTitle')}</h3>
            <p className="text-sm text-slate-500 mt-2">{t('footer.subscribeDesc')}</p>
          </div>
          <form className="w-full md:w-auto flex-1 max-w-md flex items-center gap-2 relative z-10" onSubmit={(e) => e.preventDefault()}>
            <div className="relative flex-1">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                placeholder={t('footer.enterEmail')} 
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#0082CA] focus:ring-1 focus:ring-[#0082CA] transition-all"
                required
              />
            </div>
            <motion.button 
              whileTap={{ scale: 0.95 }}
              className="bg-[#0082CA] hover:bg-[#0068A2] text-white px-6 py-3 rounded-lg font-bold text-sm transition-colors whitespace-nowrap shadow-sm"
            >
              {t('footer.subscribeBtn')}
            </motion.button>
          </form>
        </div>



        {/* Main Footer Directory (Large 6-Column Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-0 md:gap-8 pb-12 border-b border-slate-200 text-left">
          
          {/* Column 1: About & Social (Takes up 2 cols on Large screens) */}
          <div className="md:col-span-2 space-y-6 lg:pr-8 flex flex-col items-start mb-8 md:mb-0">
            <div className="inline-block bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-100">
              <Image
                src="/logo-maaza.png"
                alt="Maza Printwala"
                width={150}
                height={40}
                className="h-10 w-auto object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              {t('footer.companyDesc')}
            </p>
            
            {/* Social Links */}
            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">{t('footer.connectWithUs')}</h5>
              <div className="flex items-center justify-start gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-[#0082CA] hover:border-[#0082CA] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <Share2 className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-[#E1306C] hover:border-[#E1306C] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <AtSign className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-[#1DA1F2] hover:border-[#1DA1F2] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <MessageCircle className="w-4 h-4" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white border border-slate-200 hover:bg-[#0A66C2] hover:border-[#0A66C2] text-slate-600 hover:text-white flex items-center justify-center transition-all shadow-sm">
                  <Globe className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Products */}
          <FooterAccordionItem title={t('footer.products')} id="products">
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              {categories.slice(0, 6).map(cat => (
                <li key={cat.slug}><Link href={`/${cat.slug}`} className="hover:text-[#0082CA] transition-colors">{t.has(`categories.${cat.slug}`) ? t(`categories.${cat.slug}`) : cat.name}</Link></li>
              ))}
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors text-[#0082CA] font-bold">{t('footer.viewAllProducts')} &rarr;</Link></li>
            </ul>
          </FooterAccordionItem>

          {/* Column 3: Resources */}
          <FooterAccordionItem title={t('footer.resources')} id="resources">
            <ul className="space-y-3 text-sm text-slate-500 font-medium">
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'डिज़ाइन टेम्प्लेट' : locale === 'mr' ? 'डिझाईन टेम्पलेट्स' : 'Design Templates'}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'आर्टवर्क गाइडलाइंस' : locale === 'mr' ? 'आर्टवर्क मार्गदर्शक तत्त्वे' : 'Artwork Guidelines'}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'पेपर क्वालिटी गाइड' : locale === 'mr' ? 'पेपर क्वालिटी मार्गदर्शक' : 'Paper Quality Guide'}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'प्रिंटिंग ब्लॉग' : locale === 'mr' ? 'प्रिंटिंग ब्लॉग' : 'Printing Blog'}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'डेवलपर API' : locale === 'mr' ? 'डेव्हलपर API' : 'Developer API'}</Link></li>
            </ul>
          </FooterAccordionItem>

          {/* Column 4: Support */}
          <FooterAccordionItem title={t('footer.support')} id="support">
            <ul className="space-y-3 text-sm text-slate-500 font-medium flex flex-col items-start">
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'सहायता केंद्र / अक्सर पूछे जाने वाले प्रश्न' : locale === 'mr' ? 'मदत केंद्र / वारंवार विचारले जाणारे प्रश्न' : 'Help Center / FAQs'}</Link></li>
              <li><Link href="/track-order" className="hover:text-[#0082CA] transition-colors">{t('header.trackOrder')}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{t('footer.returnPolicy')}</Link></li>
              <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'शिपिंग जानकारी' : locale === 'mr' ? 'शिपिंग माहिती' : 'Shipping Information'}</Link></li>
              <li>
                <div className="pt-2 flex items-start justify-start gap-2">
                  <Phone className="w-4 h-4 shrink-0 text-[#0082CA] mt-0.5" />
                  <span className="text-slate-700 font-bold">1800-PRINT-NOW</span>
                </div>
              </li>
              <li>
                <div className="flex items-start justify-start gap-2">
                  <Mail className="w-4 h-4 shrink-0 text-[#0082CA] mt-0.5" />
                  <span className="text-slate-700 font-bold break-all">support@maazaprintwala.in</span>
                </div>
              </li>
            </ul>
          </FooterAccordionItem>

          {/* Column 5: Company & Legal */}
          <div className="flex flex-col">
            <FooterAccordionItem title={t('footer.company')} id="company">
              <ul className="space-y-3 text-sm text-slate-500 font-medium flex flex-col items-start">
                <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{t('footer.about')}</Link></li>
                <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'करियर' : locale === 'mr' ? 'करिअर' : 'Careers'}</Link></li>
                <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'प्रेस और मीडिया' : locale === 'mr' ? 'प्रेस आणि मीडिया' : 'Press & Media'}</Link></li>
                <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{locale === 'hi' ? 'पार्टनर प्रोग्राम' : locale === 'mr' ? 'पार्टनर प्रोग्राम' : 'Partner Program'}</Link></li>
              </ul>
            </FooterAccordionItem>
            
            <div className="mt-0 md:mt-8">
              <FooterAccordionItem title={t('footer.legal')} id="legal">
                <ul className="space-y-3 text-sm text-slate-500 font-medium flex flex-col items-start">
                  <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{t('footer.privacy')}</Link></li>
                  <li><Link href="/products" className="hover:text-[#0082CA] transition-colors">{t('footer.terms')}</Link></li>
                </ul>
              </FooterAccordionItem>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          <div className="text-xs text-slate-500 font-medium text-center md:text-left">
            <p>© {new Date().getFullYear()} Maza Printwala. {locale === 'hi' ? 'सर्वाधिकार सुरक्षित।' : locale === 'mr' ? 'सर्व हक्क राखीव.' : 'All rights reserved.'}</p>
            <p className="mt-1 text-slate-400">Commercial Printing Hub, Mumbai, India 400001</p>
          </div>

          {/* Payment Icons */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 hover:scale-105 transition-transform">
              <CreditCard className="w-5 h-5 text-slate-700" />
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-[#003A70] tracking-tighter hover:scale-105 transition-transform text-xs">
              VISA
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-[#EB001B] tracking-tighter italic hover:scale-105 transition-transform text-xs">
              MC
            </div>
            <div className="flex items-center justify-center bg-white rounded px-2 shadow-sm h-8 w-12 border border-slate-200 font-bold text-slate-800 tracking-tighter hover:scale-105 transition-transform text-xs">
              UPI
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
}
