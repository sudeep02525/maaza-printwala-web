'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Truck, FileText, Headphones, CheckCircle2 } from 'lucide-react';
import { useLocale } from 'next-intl';

export default function TestimonialCarousel() {
  const locale = useLocale();

  const title = 
    locale === 'hi' ? 'व्यवसाय Maza Printwala पर भरोसा क्यों करते हैं' :
    locale === 'mr' ? 'व्यवसाय Maza Printwala वर का विश्वास ठेवतात' :
    'Why Businesses Trust Maza Printwala';

  const subtitle = 
    locale === 'hi' ? 'उच्च गुणवत्ता, विश्वसनीय डिलीवरी और पारदर्शी इनवॉइसिंग के साथ आपकी सभी कमर्शियल प्रिंटिंग आवश्यकताएँ।' :
    locale === 'mr' ? 'उच्च दर्जा, विश्वासार्ह डिलिव्हरी आणि पारदर्शक इनव्हॉइसिंगसह तुमच्या सर्व व्यावसायिक छपाईच्या गरजा.' :
    'Commercial print reliability, verified pre-flight checks, and nationwide dispatch built for growing enterprises.';

  const pillars = [
    {
      icon: ShieldCheck,
      badge: locale === 'hi' ? 'सटीक रंग' : locale === 'mr' ? 'अचूक रंग' : 'Precision Colors',
      title: locale === 'hi' ? 'सटीक CMYK प्रिंटिंग' : locale === 'mr' ? 'अचूक CMYK छपाई' : 'Calibrated CMYK Printing',
      desc: locale === 'hi' ? 'कैलिब्रेटेड डिजिटल और ऑफसेट तकनीक के साथ जीवंत रंग और प्रीमियम पेपर स्टॉक्स।' : locale === 'mr' ? 'कॅलिब्रेटेड डिजिटल आणि ऑफसेट तंत्रज्ञानासह चमकदार रंग आणि दर्जेदार कागद.' : 'Rigorous color accuracy, high-DPI resolution, and certified paper stocks for professional impressions.',
    },
    {
      icon: Truck,
      badge: locale === 'hi' ? 'सुरक्षित डिलीवरी' : locale === 'mr' ? 'सुरक्षित डिलिव्हरी' : 'Tracked Transit',
      title: locale === 'hi' ? 'अखिल भारतीय एक्सप्रेस डिलीवरी' : locale === 'mr' ? 'अखिल भारतीय एक्सप्रेस डिलिव्हरी' : 'Pan-India Express Dispatch',
      desc: locale === 'hi' ? 'सुरक्षित पैकेजिंग और लाइव ट्रैकिंग के साथ पूरे भारत में तेज़ डिलीवरी।' : locale === 'mr' ? 'सुरक्षित पॅकेजिंग आणि थेट ट्रॅकिंगसह संपूर्ण भारतात जलद डिलिव्हरी.' : 'Transit-safe packaging and reliable surface/air courier integration covering metro & regional zones.',
    },
    {
      icon: FileText,
      badge: locale === 'hi' ? '100% अनुपालक' : locale === 'mr' ? '100% अनुपालक' : '100% Compliant',
      title: locale === 'hi' ? 'त्वरित B2B GST इनवॉइस' : locale === 'mr' ? 'त्वरित B2B GST इनव्हॉइस' : 'Instant B2B GST Invoicing',
      desc: locale === 'hi' ? 'अपनी कंपनी के इनपुट टैक्स क्रेडिट (ITC) के लिए वैध GST इनवॉइस तुरंत प्राप्त करें।' : locale === 'mr' ? 'तुमच्या कंपनीच्या इनपुट टॅक्स क्रेडिटसाठी (ITC) वैध GST इनव्हॉइस लगेच मिळवा.' : 'Full tax compliance with automatic GSTIN capture for complete input tax credit on corporate spending.',
    },
    {
      icon: Headphones,
      badge: locale === 'hi' ? 'विशेषज्ञ सहायता' : locale === 'mr' ? 'तज्ज्ञ सहाय्य' : 'Expert Help',
      title: locale === 'hi' ? 'समर्पित प्री-प्रेस सहायता' : locale === 'mr' ? 'समर्पित प्री-प्रेस सहाय्य' : 'Expert Pre-Press Support',
      desc: locale === 'hi' ? 'ब्लीड, मार्जिन और रिज़ॉल्यूशन की अनुभवी तकनीशियनों द्वारा प्रिंट-पूर्व जांच।' : locale === 'mr' ? 'ब्लीड, मार्जिन आणि रिझोल्यूशनची छपाई-पूर्व तज्ज्ञांकडून पडताळणी.' : 'Direct telephone, email, and WhatsApp file assistance before any job heads to the printing plate.',
    },
  ];

  return (
    <section className="py-14 bg-[var(--bg-subtle)] relative overflow-hidden border-t border-[var(--border)]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[350px] h-[350px] bg-emerald-100/30 dark:bg-emerald-900/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0082CA]/10 text-[#0082CA] text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Commercial Print Standards</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[var(--text-main)] tracking-tight mb-3">
            {title}
          </h2>
          <p className="text-[var(--text-muted)] text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 4 Trust Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col hover:shadow-md hover:border-[#0082CA]/30 transition-all"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0082CA]/10 flex items-center justify-center text-[#0082CA] shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[11px] font-bold text-[#0082CA] bg-[#0082CA]/5 px-2.5 py-1 rounded-full">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-bold text-[var(--text-main)] text-base mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed">
                  {pillar.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
