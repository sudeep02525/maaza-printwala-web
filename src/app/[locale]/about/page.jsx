import React from 'react';
import { Award, Factory, Truck, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, Users, Clock, Mail, Phone } from 'lucide-react';
import { Link } from '@/i18n/routing.js';
import { serverApi } from '@/lib/server-api.js';
import Image from 'next/image';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const metaRes = await serverApi.get('/cms/key/page_meta', 60).catch(() => null);
  const metaData = metaRes?.data?.content?.content?.about || {};

  const titles = {
    en: metaData.title || 'About Us | Maza Printwala - Commercial & Custom Printing Hub',
    hi: metaData.title_hi || 'हमारे बारे में | Maza Printwala - वाणिज्यिक एवं कस्टम प्रिंटिंग हब',
    mr: metaData.title_mr || 'आमच्याबद्दल | Maza Printwala - व्यावसायिक व सानुकूल प्रिंटिंग हब',
  };

  const descriptions = {
    en: metaData.description || 'Learn about Maza Printwala - our state-of-the-art print factory, craft heritage, quality guarantee, and dedicated B2B enterprise printing services.',
    hi: metaData.description_hi || 'Maza Printwala के बारे में जानें - हमारी अत्याधुनिक प्रिंट फैक्ट्री, गुणवत्ता गारंटी और समर्पित B2B कॉर्पोरेट प्रिंटिंग सेवाएँ।',
    mr: metaData.description_mr || 'Maza Printwala बद्दल जाणून घ्या - आमची आधुनिक प्रिंट फॅक्टरी, गुणवत्ता हमी आणि समर्पित व्यावसायिक छपाई सेवा.',
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: metaData.ogImage ? [{ url: metaData.ogImage }] : [],
    },
  };
}

export default async function AboutPage({ params }) {
  const { locale } = await params;

  const cmsRes = await serverApi.get('/cms/key/about_page', 60).catch(() => null);
  const about = cmsRes?.data?.content?.content || {};

  // Localized or default strings
  const badge = about[`badge_${locale}`] || about.badge || (
    locale === 'hi' ? 'Maza Printwala के बारे में' : locale === 'mr' ? 'Maza Printwala बद्दल' : 'About Maza Printwala'
  );

  const title = about[`title_${locale}`] || about.title || (
    locale === 'hi'
      ? 'उद्योग-अग्रणी गुणवत्ता, आधुनिक व्यवसायों के लिए तैयार'
      : locale === 'mr'
      ? 'उद्योग-अग्रणी गुणवत्ता, आधुनिक व्यवसायांसाठी सज्ज'
      : 'Precision Industrial Printing For Growing Businesses'
  );

  const subtitle = about[`subtitle_${locale}`] || about.subtitle || (
    locale === 'hi'
      ? 'प्रीमियम विजिटिंग कार्ड्स से लेकर हाई-वॉल्यूम पैकेजिंग और कॉर्पोरेट परिधान तक, हम जर्मन प्रिंट तकनीक को डिजिटल सुविधा के साथ जोड़ते हैं।'
      : locale === 'mr'
      ? 'प्रीमियम व्हिजिटिंग कार्ड्सपासून ते मोठ्या प्रमाणातील पॅकेजिंग आणि कॉर्पोरेट कपड्यांपर्यंत, आम्ही जर्मन तंत्रज्ञानाला डिजिटल सुलभतेशी जोडतो.'
      : 'From bespoke visiting cards to high-volume commercial packaging and custom apparel, we combine industrial press technology with effortless digital ordering.'
  );

  const storyParagraphs = (
    about[`story_${locale}`] || about.story || (
      locale === 'hi'
        ? `Maza Printwala की शुरुआत एक स्पष्ट उद्देश्य के साथ हुई: भारत के हर छोटे-बड़े व्यवसाय, डिज़ाइन एजेंसी और उद्यम को बिना किसी रुकावट के अंतरराष्ट्रीय स्तर की मुद्रण सेवा उपलब्ध कराना।\n\nवर्षों में हमने आधुनिक 4-कलर और 6-कलर ऑफ़सेट मशीनों, डिजिटल फ़ॉइल और स्पॉट यूवी स्टेशनों और अत्याधुनिक डायरेक्ट-टू-गारमेंट सेटअप में निवेश किया है।\n\nआज चाहे आपको 100 विलासी बिजनेस कार्ड चाहिए हों या 50,000 कॉर्पोरेट पैकेजिंग बॉक्स, हमारी समर्पित टीम रंग सटीकता, समय पर डिलीवरी और पारदर्शी फैक्ट्री दरों की गारंटी देती है।`
        : locale === 'mr'
        ? `Maza Printwala ची स्थापना एका स्पष्ट उद्दिष्टाने झाली: भारतातील प्रत्येक व्यवसाय, डिझायनर आणि उद्योगाला आंतरराष्ट्रीय दर्जाची छपाई सेवा सहज उपलब्ध करून देणे.\n\nवर्षानुवर्षे आम्ही आधुनिक ऑफसेट मशिन्स, डिजिटल फॉइल आणि स्पॉट यूव्ही, तसेच अत्याधुनिक डायरेक्ट-टू-गारमेंट युनिट्समध्ये गुंतवणूक केली आहे.\n\nआज तुम्हाला 100 लक्झरी बिझनेस कार्ड्स हवे असोत किंवा 50,000 कॉर्पोरेट बॉक्स, आमची टीम रंग अचूकता आणि वेळेवर वितरणाची खात्री देते.`
        : `Founded with a mission to eliminate print complexity, Maza Printwala empowers brands, creative agencies, and growing startups across India with world-class printing solutions.\n\nOver the years, we have invested continuously in high-precision Heidelberg offset presses, digital foil and spot-UV finishing stations, and direct-to-garment apparel printing facilities.\n\nWhether you need 100 luxury tactile visiting cards or 50,000 corrugated packaging boxes delivered across multiple branch offices, our manual quality inspection and calibrated color management ensure complete satisfaction.`
    )
  ).split('\n\n').filter(Boolean);

  const storyImage = about.storyImage || 'https://res.cloudinary.com/kz2pddnr/image/upload/v1795262678/maaza-printwala/images/cat_visiting_cards_new_1785478123231.jpg';

  const stats = (Array.isArray(about.stats) && about.stats.length > 0) ? about.stats : [
    { value: '50,000+', label: locale === 'hi' ? 'संतुष्ट ग्राहक' : locale === 'mr' ? 'समाधानी ग्राहक' : 'Happy Clients' },
    { value: '1.2M+', label: locale === 'hi' ? 'ऑर्डर्स डिलीवर' : locale === 'mr' ? 'ऑर्डर्स पूर्ण' : 'Orders Shipped' },
    { value: '99.8%', label: locale === 'hi' ? 'गुणवत्ता दर' : locale === 'mr' ? 'गुणवत्ता हमी' : 'Quality SLA' },
    { value: '25,000+', label: locale === 'hi' ? 'पिन कोड्स कवर्ड' : locale === 'mr' ? 'पिन कोड्स कव्हर' : 'Pin Codes Covered' },
  ];

  const values = (Array.isArray(about.values) && about.values.length > 0) ? about.values : [
    {
      icon: Award,
      title: locale === 'hi' ? 'औद्योगिक परिशुद्धता' : locale === 'mr' ? 'औद्योगिक अचूकता' : 'Industrial Precision',
      desc: locale === 'hi'
        ? '400+ GSM आयातित पेपर, कैलिब्रेटेड CMYK प्रोफाइल और प्रीमियम लैमिनेशन तकनीक।'
        : locale === 'mr'
        ? '400+ GSM आयातित कागद, कॅलिब्रेटेड CMYK प्रोफाइल्स आणि प्रीमियम लॅमिनेशन.'
        : 'Imported 400+ GSM art cards, calibrated CMYK color curves, and automated die-cutting.',
    },
    {
      icon: Factory,
      title: locale === 'hi' ? 'डायरेक्ट फैक्ट्री दरें' : locale === 'mr' ? 'थेट फॅक्टरी दर' : 'Direct Factory Rates',
      desc: locale === 'hi'
        ? 'बिना किसी बिचौलिये के पारदर्शी थोक मूल्य और पूर्ण GST इनवॉइसिंग।'
        : locale === 'mr'
        ? 'मध्यस्थांशिवाय थेट घाऊक किंमत आणि पूर्ण GST इनव्हॉइसिंग.'
        : 'Transparent wholesale pricing with no middlemen markups and automated B2B GST invoicing.',
    },
    {
      icon: Truck,
      title: locale === 'hi' ? 'सुरक्षित अखिल भारतीय वितरण' : locale === 'mr' ? 'सुरक्षित भारतभर वितरण' : 'Fast Pan-India Logistics',
      desc: locale === 'hi'
        ? 'विश्वसनीय कूरियर भागीदारों द्वारा पूरे भारत में त्वरित और सुरक्षित ट्रैकेबल डिलीवरी।'
        : locale === 'mr'
        ? 'विश्वासू कुरिअर भागीदारांद्वारे संपूर्ण भारतात जलद आणि ट्रॅक करण्यायोग्य डिलिव्हरी.'
        : 'Insured, door-step delivery across 25,000+ pin codes with live GPS tracking updates.',
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/40 text-[#0082CA] dark:text-[#38BDF8] text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" /> {badge}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[var(--text-main)] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-xs text-center space-y-1 hover:border-[#0082CA] transition-colors"
            >
              <div className="text-2xl sm:text-3xl font-black text-[#0082CA] tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#0082CA] uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>{locale === 'hi' ? 'हमारी विरासत और दृष्टिकोण' : locale === 'mr' ? 'आमचा वारसा आणि धोरण' : 'Our Craft & Commitment'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-main)] tracking-tight">
              {locale === 'hi' ? 'विश्वसनीय मुद्रण, हर बार' : locale === 'mr' ? 'विश्वासार्ह छपाई, प्रत्येक वेळी' : 'Obsessive About Print Quality'}
            </h2>
            <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
              {storyParagraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="pt-2 flex flex-wrap gap-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>100% Quality Inspection</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>GST Tax Invoicing</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-main)]">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>Free Artwork Proofing</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-[var(--border)] shadow-md">
            <Image
              src={storyImage}
              alt="Maza Printwala Print Works"
              fill
              className="object-cover hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 450px"
            />
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tight">
              {locale === 'hi' ? 'हमारे मुख्य मूल्य' : locale === 'mr' ? 'आमची मुख्य मूल्ये' : 'Why Businesses Choose Us'}
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              {locale === 'hi' ? 'आधुनिक प्रिंटिंग के लिए तकनीक और विश्वसनीयता' : locale === 'mr' ? 'आधुनिक छपाईसाठी तंत्रज्ञान आणि विश्वास' : 'Enterprise reliability meets direct-to-consumer flexibility'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, idx) => {
              const IconComp = v.icon || Award;
              return (
                <div
                  key={idx}
                  className="bg-[var(--bg-card)] p-6 rounded-2xl border border-[var(--border)] shadow-xs space-y-3 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#0082CA] flex items-center justify-center">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-[var(--text-main)]">{v.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Bar */}
        <div className="bg-gradient-to-r from-[#003A70] to-[#0082CA] rounded-2xl p-8 sm:p-10 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {locale === 'hi' ? 'क्या आप अपने ब्रांड को नई पहचान देने के लिए तैयार हैं?' : locale === 'mr' ? 'तुमच्या ब्रँडला नवीन ओळख देण्यासाठी तयार आहात?' : 'Ready to Elevate Your Brand Printing?'}
            </h3>
            <p className="text-xs text-blue-100 max-w-xl">
              {locale === 'hi' ? 'हमारे व्यापक उत्पाद कैटलॉग को एक्सप्लोर करें या तुरंत बल्क कोटेशन के लिए संपर्क करें।' : locale === 'mr' ? 'आमचे विस्तृत उत्पादन कॅटलॉग एक्सप्लोर करा किंवा तात्काळ कोटेशनसाठी संपर्क साधा.' : 'Explore our print catalogue online or talk to our commercial production team for enterprise contracts.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              className="px-6 py-3 bg-white text-[#003A70] font-black text-xs rounded-xl shadow-md hover:bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <span>{locale === 'hi' ? 'कैटलॉग देखें' : locale === 'mr' ? 'कॅटलॉग पहा' : 'Explore Catalogue'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/bulk-enquiry"
              className="px-6 py-3 bg-blue-900/60 hover:bg-blue-900/80 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors"
            >
              <span>{locale === 'hi' ? 'बल्क इन्क्वायरी' : locale === 'mr' ? 'मोठी मागणी' : 'Request Bulk Quote'}</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
