'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, BadgeCheck } from 'lucide-react';
import { useLocale } from 'next-intl';

const TESTIMONIALS = [
  { 
    id: 1,
    name: 'Rajesh K.', 
    company: 'TechNova Solutions', 
    role: 'Operations Head',
    text: 'Maza Printwala delivered our corporate onboarding kits 2 days early. The premium boxes were flawless, and the GST invoicing was completely seamless.',
    avatar: 'https://i.pravatar.cc/150?img=11',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg'
  },
  { 
    id: 2,
    name: 'Sneha P.', 
    company: 'Creative Studio', 
    role: 'Art Director',
    text: 'The spot UV business cards are the best we have seen in India. The print accuracy and paper quality make us look incredibly professional.',
    avatar: 'https://i.pravatar.cc/150?img=9',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
  },
  { 
    id: 3,
    name: 'Amit M.', 
    company: 'Real Estate Builders', 
    role: 'Marketing Manager',
    text: 'Ordered 5,000 brochures for our new launch. Consistent colors, exact GSM as promised, and their pre-press team caught a bleed error before printing!',
    avatar: 'https://i.pravatar.cc/150?img=12',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
  }
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const locale = useLocale();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-10 bg-slate-50 relative overflow-hidden border-t border-slate-100">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-100/30 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-slate-900">
          {locale === 'hi' ? 'व्यवसायों द्वारा पसंद किया गया' : locale === 'mr' ? 'व्यवसायांची पसंती' : 'Loved by Businesses'}
        </h2>
        <p className="text-slate-500 mb-16 text-base font-medium">
          {locale === 'hi' ? '10,000+ कंपनियों से जुड़ें जो अपनी कमर्शियल प्रिंटिंग के लिए Maza Printwala पर भरोसा करती हैं।' : locale === 'mr' ? '10,000+ कंपन्यांमध्ये सामील व्हा ज्या त्यांच्या व्यावसायिक छपाईसाठी Maza Printwala वर विश्वास ठेवतात.' : 'Join 10,000+ companies that trust Maza Printwala for their commercial printing.'}
        </p>

        <div className="relative w-full max-w-3xl mx-auto min-h-[350px] sm:min-h-[280px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="w-full"
            >
              <div className="bg-white border border-slate-100 p-8 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 flex flex-col items-center text-center">
                
                {/* Rating & Verified */}
                <div className="flex items-center justify-between w-full mb-8">
                  <div className="flex gap-1 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400"/>)}
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
                    <BadgeCheck className="w-4 h-4" />
                    <span>Verified Buyer</span>
                  </div>
                </div>

                {/* Text */}
                <p className="text-lg sm:text-2xl text-slate-700 font-semibold leading-relaxed mb-10 italic flex-1">
                  &quot;{TESTIMONIALS[currentIndex].text}&quot;
                </p>

                {/* User Info & Logo */}
                <div className="flex items-center justify-between w-full border-t border-slate-100 pt-6">
                  <div className="flex items-center gap-4">
                    <img src={TESTIMONIALS[currentIndex].avatar} alt={TESTIMONIALS[currentIndex].name} className="w-12 h-12 rounded-full border-2 border-slate-100" />
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-base">{TESTIMONIALS[currentIndex].name}</p>
                      <p className="text-xs text-slate-500">{TESTIMONIALS[currentIndex].role}, <span className="text-slate-700 font-medium">{TESTIMONIALS[currentIndex].company}</span></p>
                    </div>
                  </div>
                  
                  {/* Company Logo */}
                  <div className="hidden sm:block">
                    <img src={TESTIMONIALS[currentIndex].logo} alt="Company Logo" className="h-6 opacity-40 grayscale" />
                  </div>
                </div>

              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                currentIndex === i ? 'bg-[#0082CA] w-8' : 'bg-slate-300 w-2.5 hover:bg-slate-400'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
