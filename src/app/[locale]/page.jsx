import React from 'react';
import { Link } from '@/i18n/routing.js';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Heart, Search, ChevronRight } from 'lucide-react';

import { serverApi } from '@/lib/server-api.js';
import ExploreCategories from '@/components/home/ExploreCategories.jsx';
import VisualCategories from '@/components/home/VisualCategories.jsx';
import FaqAccordion from '@/components/home/FaqAccordion.jsx';
import ProductCard from '@/components/products/ProductCard.jsx';
import HeroBanner from '@/components/home/HeroBanner.jsx';
import TestimonialCarousel from '@/components/home/TestimonialCarousel.jsx';
import { 
  FeaturedSlider, 
  CorporateSection, 
  WeddingSection, 
  CustomMerchSection, 
  TopRatedSection 
} from '@/components/home/HomeSections.jsx';
import FadeIn from '@/components/ui/FadeIn.jsx';

// --- MOCK DATA ---
const SHOP_BY_PRODUCT = [
  { name: 'Visiting Cards', image: '/images/cat_flyers_brochures_1785433655247.png' },
  { name: 'Flyers', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Brochure', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Letterhead', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Envelope', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Sticker', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Labels', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Packaging Box', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Mug', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Bottle', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'T-Shirt', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Hoodie', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const INDUSTRIES = [
  { name: 'Restaurant', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'School', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Hospital', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Real Estate', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Manufacturing', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Startup', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const OCCASIONS = [
  { name: 'Wedding', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Festival', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Corporate Events', image: '/images/cat_visiting_cards_1785433645262.png' },
  { name: 'Exhibition', image: '/images/cat_visiting_cards_1785433645262.png' },
];

const BRANDS = ['HP', 'Dell', 'Puma', 'Adidas', 'Samsung', 'Boat', 'Reliance', 'Tata'];

const getPopularSearches = (locale) => {
  if (locale === 'hi') {
    return ['विजिटिंग कार्ड', 'कस्टम टी-शर्ट', 'स्टिकर प्रिंटिंग', 'पैकेजिंग', 'मग प्रिंटिंग', 'स्टैंडी', 'लेटरहेड', 'आईडी कार्ड', 'लैनयार्ड', 'फ्लायर्स', 'ब्रोशर डिज़ाइन', 'कॉर्पोरेट गिफ़्ट्स'];
  }
  if (locale === 'mr') {
    return ['व्हिजिटिंग कार्ड', 'कस्टम टी-शर्ट', 'स्टिकर प्रिंटिंग', 'पॅकेजिंग', 'मग प्रिंटिंग', 'स्टँडी', 'लेटरहेड', 'आयडी कार्ड', 'लॅनयार्ड', 'फ्लायर्स', 'ब्रोशर डिझाईन', 'कॉर्पोरेट गिफ्ट्स'];
  }
  return ['Business Cards', 'Custom Tshirt', 'Sticker Printing', 'Packaging', 'Mug Printing', 'Standee', 'Letterhead', 'ID Cards', 'Lanyards', 'Flyers', 'Brochure Design', 'Corporate Gifts'];
};

const INSTAGRAM_POSTS = [
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
  '/images/cat_visiting_cards_1785433645262.png',
];



// --- HELPER COMPONENT FOR SECTION TITLES ---
const SectionHeader = ({ title, linkText, subtitle, tButtons }) => {
  const text = linkText || (linkText !== null ? tButtons('viewAll') : null);
  
  return (
    <div className="flex justify-between items-end mb-8">
      <div>
        <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight">{title}</h2>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {text && (
        <Link href="/all" className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-[#0082CA] hover:underline">
          {text} <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
};

export default async function HomePage({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tHome = await getTranslations({ locale, namespace: 'homeSections' });
  const tButtons = await getTranslations({ locale, namespace: 'buttons' });

  const catData = await serverApi.getCategories().catch(() => ({ data: { categories: [] } }));
  const prodData = await serverApi.getFeaturedProducts().catch(() => ({ data: { products: [] } }));

  const categories = catData?.data?.categories || [];
  
  // Create mock arrays for the vast number of sections by slicing the main products array
  // If the array is too short, we'll repeat it for visual completeness.
  const baseProducts = prodData?.data?.products || [];
  const getSlice = (start, length = 6) => {
    if (baseProducts.length === 0) return [];
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(baseProducts[(start + i) % baseProducts.length]);
    }
    return result;
  };

  const bestSellers = getSlice(0, 6);
  const newArrivals = getSlice(6, 6);
  const businessEssentials = getSlice(12, 6);
  const customClothing = getSlice(18, 6);
  const packaging = getSlice(24, 6);
  const marketingMaterials = getSlice(30, 6);
  const corporateGifts = getSlice(36, 6);
  const trendingProducts = getSlice(42, 6);
  const recentlyViewed = getSlice(48, 6);

  return (
    <div className="bg-[#fafafa] min-h-screen font-sans overflow-x-hidden">
      
      {/* 3. HERO & TRUST STRIP */}
      <HeroBanner />

      {/* 4. EXPLORE ALL CATEGORIES (PrintVenue Circular Style) */}
      <ExploreCategories categories={categories} />

      {/* 5. VISUAL CATEGORY BLOCKS (VistaPrint Square Style) */}
      <VisualCategories />

      <FeaturedSlider products={bestSellers} />
      
      {/* BEST SELLING (Standard Grid) */}
      <section className="py-14 bg-[#fafafa]">
        <FadeIn className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title={tHome('bestSellers')} tButtons={tButtons} />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {newArrivals.map((p, i) => <FadeIn key={`bs-${p._id || 'x'}-${i}`} delay={i * 0.1}><ProductCard product={p} /></FadeIn>)}
          </div>
        </FadeIn>
      </section>

      <CorporateSection products={businessEssentials} />
      <WeddingSection />
      <CustomMerchSection />
      
      {/* RECENTLY ADDED (Standard Grid with 'New' implication) */}
      <section className="py-14 bg-[#fafafa]">
        <FadeIn className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title={tHome('newArrivals')} subtitle={locale === 'hi' ? 'नए टेम्प्लेट और उत्पाद' : locale === 'mr' ? 'नवीन टेम्पलेट्स आणि उत्पादने' : 'Fresh new templates and products'} tButtons={tButtons} />
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {recentlyViewed.map((p, i) => <FadeIn key={`new-${p._id || 'x'}-${i}`} delay={i * 0.1}><ProductCard product={p} /></FadeIn>)}
          </div>
        </FadeIn>
      </section>

      <TopRatedSection products={trendingProducts} />

      {/* 17. POPULAR SEARCHES (SEO) */}
      <section className="py-10 bg-[#f8fafc]">
        <FadeIn className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <SectionHeader title={tHome('popularSearches')} linkText={null} tButtons={tButtons} />
          <div className="flex flex-wrap gap-3">
            {getPopularSearches(locale).map((search, i) => (
              <FadeIn key={i} delay={i * 0.05} y={10}>
                <Link href={`/all?search=${encodeURIComponent(search)}`} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 font-semibold text-xs sm:text-sm rounded-full hover:border-[#0082CA] hover:text-[#0082CA] hover:shadow-sm transition-all block">
                  <Search className="w-3 h-3 inline-block mr-1.5 -mt-0.5" />
                  {search}
                </Link>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 18. CUSTOMER GALLERY */}
      <section className="py-10 bg-white border-y border-slate-100">
        <FadeIn className="w-full max-w-[1550px] mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl sm:text-[28px] font-extrabold text-slate-900 tracking-tight mb-2">{tHome('customerGallery')}</h2>
          <p className="text-sm text-slate-500 mb-8 font-medium">
            {locale === 'hi' ? 'फ़ीचर होने के लिए हमें Instagram ' : locale === 'mr' ? 'वैशिष्ट्यीकृत होण्यासाठी आम्हाला Instagram वर ' : 'Tag us on Instagram '}
            <span className="font-bold text-[#0082CA]">@MaazaPrintwala</span> 
            {locale === 'hi' ? ' पर टैग करें।' : locale === 'mr' ? ' टॅग करा.' : ' to get featured.'}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {INSTAGRAM_POSTS.map((img, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="relative aspect-square rounded-lg overflow-hidden group border border-slate-200">
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Gallery" />
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Heart className="w-8 h-8 text-white fill-white shadow-sm" />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* 19. WHY CHOOSE US & PROCESS (Testimonials) */}
      <TestimonialCarousel />

      {/* 20. FAQ */}
      <section className="py-10 bg-white">
        <FadeIn className="w-full max-w-6xl mx-auto px-4 md:px-8">
          <h2 className="text-[28px] font-bold text-slate-800 mb-6 text-left">{tHome('faq')} (FAQs)</h2>
          <FaqAccordion faqs={[
            { 
              q: locale === 'hi' ? 'Maza Printwala क्या सेवाएँ प्रदान करता है?' : locale === 'mr' ? 'Maza Printwala कोणत्या सेवा देते?' : 'What services does Maza Printwala offer?', 
              a: locale === 'hi' ? 'हम व्यवसाय मुद्रण, कस्टम परिधान, पैकेजिंग और बहुत कुछ प्रदान करते हैं।' : locale === 'mr' ? 'आम्ही व्यवसाय छपाई, सानुकूल पोशाख, पॅकेजिंग आणि बरेच काही प्रदान करतो.' : 'We offer a wide range of services including business printing, custom apparel, packaging, corporate gifts, and personalized items.' 
            },
            { 
              q: locale === 'hi' ? 'क्या मुझे ऑनलाइन कस्टम उत्पाद मिल सकते हैं?' : locale === 'mr' ? 'मी ऑनलाइन कस्टम उत्पादने ऑर्डर करू शकतो का?' : 'Can I order custom printed products online?', 
              a: locale === 'hi' ? 'हाँ, आप सीधे हमारी वेबसाइट से ऑर्डर कर सकते हैं।' : locale === 'mr' ? 'होय, तुम्ही आमच्या वेबसाइटवरून थेट ऑर्डर करू शकता.' : 'Yes, you can browse, customize, and order all our products directly through our website with easy online payment options.' 
            },
            { 
              q: locale === 'hi' ? 'क्या आप एक ही दिन में डिलीवरी प्रदान करते हैं?' : locale === 'mr' ? 'तुम्ही एकाच दिवशी डिलिव्हरी देता का?' : 'Does Maza Printwala provide same-day delivery?', 
              a: locale === 'hi' ? 'चुनिंदा पिन कोड्स के लिए सेम-डे डिलीवरी उपलब्ध है।' : locale === 'mr' ? 'निवडक पिन कोडसाठी त्याच दिवशी डिलिव्हरी उपलब्ध आहे.' : 'Same-day delivery is available for select products and pin codes. Standard delivery takes 3-4 working days.' 
            },
            { 
              q: locale === 'hi' ? 'सबसे लोकप्रिय उत्पाद कौन से हैं?' : locale === 'mr' ? 'सर्वाधिक लोकप्रिय उत्पादने कोणती आहेत?' : 'What are the most popular products on Maza Printwala?', 
              a: locale === 'hi' ? 'विजिटिंग कार्ड्स, कस्टम टी-शर्ट्स और पैकेजिंग बॉक्स।' : locale === 'mr' ? 'व्हिजिटिंग कार्ड्स, कस्टम टी-शर्ट्स आणि पॅकेजिंग बॉक्स.' : 'Our most popular products include Visiting Cards, Custom T-shirts, Corporate Gift Sets, and Custom Packaging.' 
            },
            { 
              q: locale === 'hi' ? 'क्या मैं कम मात्रा में ऑर्डर कर सकता हूँ?' : locale === 'mr' ? 'मी कमी प्रमाणात ऑर्डर करू शकतो का?' : 'Can I order small quantities or single-piece prints?', 
              a: locale === 'hi' ? 'हाँ, हम बिना किसी न्यूनतम ऑर्डर सीमा के सिंगल पीस प्रिंटिंग की सुविधा भी देते हैं।' : locale === 'mr' ? 'होय, आम्ही कोणत्याही किमान ऑर्डर मर्यादेशिवाय सिंगल पीस प्रिंटिंगची सुविधा देखील देतो.' : 'Yes, we cater to both bulk orders and single-piece custom printing without any strict minimum order quantities.' 
            },
            { 
              q: locale === 'hi' ? 'क्या आप व्यवसायों के लिए समाधान प्रदान करते हैं?' : locale === 'mr' ? 'तुम्ही व्यवसायांसाठी उपाय देता का?' : 'Does Maza Printwala offer printing solutions for businesses?', 
              a: locale === 'hi' ? 'बिल्कुल! हम B2B इनवॉइस के साथ पूर्ण कॉर्पोरेट प्रिंटिंग सेवाएँ प्रदान करते हैं।' : locale === 'mr' ? 'नक्कीच! आम्ही B2B इनव्हॉइससह संपूर्ण कॉर्पोरेट प्रिंटिंग सेवा प्रदान करतो.' : 'Absolutely! We offer dedicated B2B portal access, volume discounts, and GST invoicing for corporate clients.' 
            },
            { 
              q: locale === 'hi' ? 'मैं अपने उत्पाद का डिज़ाइन कैसे करूँ?' : locale === 'mr' ? 'मी माझ्या उत्पादनाची रचना कशी करू?' : 'How can I design my product on Maza Printwala?', 
              a: locale === 'hi' ? 'आप अपना डिज़ाइन अपलोड कर सकते हैं, हमारे टेम्प्लेट का उपयोग कर सकते हैं, या हमारे डिज़ाइनर्स की मदद ले सकते हैं।' : locale === 'mr' ? 'तुम्ही तुमचे डिझाइन अपलोड करू शकता, आमचे टेम्पलेट वापरू शकता किंवा आमच्या डिझायनर्सची मदत घेऊ शकता.' : 'You can upload your own artwork, customize ready-made templates, or hire one of our professional designers.' 
            },
            { 
              q: locale === 'hi' ? 'क्या आप पूरे भारत में डिलीवरी करते हैं?' : locale === 'mr' ? 'तुम्ही संपूर्ण भारतात डिलिव्हरी करता का?' : 'Does Maza Printwala deliver across India?', 
              a: locale === 'hi' ? 'हाँ, हम भारत में 25,000+ पिन कोड्स पर डिलीवर करते हैं।' : locale === 'mr' ? 'होय, आम्ही भारतात 25,000+ पिन कोडवर डिलिव्हरी करतो.' : 'Yes, we provide fast and secure pan-India shipping covering over 25,000+ pin codes.' 
            },
            { 
              q: locale === 'hi' ? 'किस प्रकार के दस्तावेज़ छपाई सेवाएँ उपलब्ध हैं?' : locale === 'mr' ? 'कोणत्या प्रकारच्या दस्तऐवज छपाई सेवा उपलब्ध आहेत?' : 'What types of document printing services are available?', 
              a: locale === 'hi' ? 'हम फ़्लायर्स, ब्रोशर, लेटरहेड और बहुत कुछ प्रिंट करते हैं।' : locale === 'mr' ? 'आम्ही फ्लायर्स, ब्रोशर, लेटरहेड आणि बरेच काही प्रिंट करतो.' : 'We provide high-quality printing for flyers, brochures, letterheads, certificates, and training manuals.' 
            },
            { 
              q: locale === 'hi' ? 'ऑनलाइन छपाई के लिए Maza Printwala को क्यों चुनें?' : locale === 'mr' ? 'ऑनलाइन छपाईसाठी Maza Printwala का निवडावे?' : 'Why should I choose Maza Printwala for online printing?', 
              a: locale === 'hi' ? 'हम सर्वोत्तम मूल्य पर प्रीमियम गुणवत्ता, तेज़ डिलीवरी और बेहतरीन ग्राहक सेवा सुनिश्चित करते हैं।' : locale === 'mr' ? 'आम्ही सर्वोत्तम किंमतीत प्रीमियम गुणवत्ता, वेगवान वितरण आणि उत्कृष्ट ग्राहक सेवा सुनिश्चित करतो.' : 'We guarantee premium print quality, affordable pricing, fast nationwide delivery, and a seamless ordering experience.' 
            },
          ]} />
        </FadeIn>
      </section>

    </div>
  );
}
