'use client';

import React from 'react';
import { motion } from 'framer-motion';

const BRANDS = [
  "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Slack_Technologies_Logo.svg/1024px-Slack_Technologies_Logo.svg.png",
  "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/600px-Tesla_logo.png",
];

// Duplicate the array to create a seamless infinite loop
const MARQUEE_ITEMS = [...BRANDS, ...BRANDS, ...BRANDS];

export default function BrandMarquee() {
  return (
    <section className="py-12 bg-white border-b border-slate-100 overflow-hidden">
      <div className="max-w-[1480px] mx-auto px-4 text-center mb-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trusted by India&apos;s Leading Enterprises</p>
      </div>

      <div className="relative flex overflow-hidden w-full group">
        {/* Left and Right Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          className="flex flex-nowrap items-center gap-16 sm:gap-24 pl-8 sm:pl-12 w-max"
        >
          {MARQUEE_ITEMS.map((logo, i) => (
            <div key={i} className="flex-shrink-0">
              <img 
                src={logo} 
                alt="Brand Logo" 
                className="h-7 sm:h-9 object-contain opacity-40 grayscale transition-all duration-300 hover:grayscale-0 hover:opacity-100 cursor-pointer" 
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
