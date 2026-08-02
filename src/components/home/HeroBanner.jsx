'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Star, Zap, CreditCard } from 'lucide-react';
import heroBannerMain from '../../../public/images/hero_banner_main.png';
import corpGiftingBanner from '../../../public/images/corp_gifting_banner.png';
import visitingCardsBanner from '../../../public/images/visiting_cards_banner.png';

export default function HeroBanner() {

  return (
    <>
      {/* Visual Banners Section */}
      <section className="bg-white pt-6 pb-8">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            
            {/* Left Large Banner (65%) */}
            <Link href="/category/all" className="lg:col-span-2 relative block rounded-lg overflow-hidden group aspect-[2/1] lg:aspect-auto h-[250px] sm:h-[350px] lg:h-[420px]">
              <Image 
                src={heroBannerMain} 
                alt="Main Promotion" 
                fill
                priority
                placeholder="blur"
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/10 to-transparent p-8 sm:p-12 flex flex-col justify-center">
                <h2 className="text-3xl sm:text-[34px] font-extrabold text-white leading-tight tracking-tight mb-2 max-w-md drop-shadow-md">
                  Design the perfect piece with our custom-ized prints.
                </h2>
                <p className="text-white text-sm font-medium mb-6 drop-shadow-sm">Select style according to your choice</p>
                <button className="bg-white text-slate-900 font-bold px-6 py-2.5 rounded-sm text-sm w-fit shadow-md hover:bg-slate-100 transition-colors">
                  Explore
                </button>
              </div>
            </Link>

            {/* Right Stacked Banners (35%) */}
            <div className="lg:col-span-1 flex flex-col gap-4 h-[250px] sm:h-[350px] lg:h-[420px]">
              {/* Top Right Banner */}
              <Link href="/category/corporate-gifts" className="relative flex-1 rounded-lg overflow-hidden group block">
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
                  <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">Corporate Gifting</h3>
                  <p className="text-slate-200 text-[13px] font-semibold drop-shadow-md mb-2">Upto 40% Off on Bulk</p>
                  <span className="text-white text-sm font-semibold flex items-center gap-1 drop-shadow-md">
                    Explore <span className="text-lg leading-none">&rarr;</span>
                  </span>
                </div>
              </Link>
              
              {/* Bottom Right Banner */}
              <Link href="/category/business-cards" className="relative flex-1 rounded-lg overflow-hidden group block">
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
                  <h3 className="text-white font-bold text-xl mb-1 drop-shadow-md">Premium Visiting Cards</h3>
                  <p className="text-slate-200 text-[13px] font-semibold drop-shadow-md mb-2">Starting at ₹199</p>
                  <span className="text-white text-sm font-semibold flex items-center gap-1 drop-shadow-md">
                    Explore <span className="text-lg leading-none">&rarr;</span>
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Strip (PrintVenue Style) */}
      <div className="bg-[#fafafa] border-y border-slate-200 py-8">
        <div className="w-full max-w-[1550px] mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-4 divide-x-0 md:divide-x md:divide-slate-200">
            
            <div className="flex flex-col items-center text-center px-4">
              <ShieldCheck className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">Premium Quality</h4>
              <p className="text-xs text-slate-500 font-medium">Advanced printing technology for best colors and durability.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-4">
              <Zap className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">Fast Turnaround</h4>
              <p className="text-xs text-slate-500 font-medium">Pan-India express delivery directly to your doorstep.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-4">
              <Star className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">100% Satisfaction</h4>
              <p className="text-xs text-slate-500 font-medium">Over 5 Lakh+ happy customers trust our quality.</p>
            </div>
            
            <div className="flex flex-col items-center text-center px-4">
              <CreditCard className="w-8 h-8 text-slate-800 mb-3" />
              <h4 className="font-bold text-slate-900 text-sm mb-1">Secure Payments</h4>
              <p className="text-xs text-slate-500 font-medium">100% safe checkout with SSL encryption.</p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
