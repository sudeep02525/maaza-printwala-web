'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalSlider({ children, cardWidthClass = "w-[280px] sm:w-[300px]" }) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    
    setCanScrollLeft(slider.scrollLeft > 0);
    // 5px tolerance for floating point rounding issues
    setCanScrollRight(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 5
    );
  };

  // Initial check when children render
  useEffect(() => {
    // Wait for images/content to load and render
    const timeoutId = setTimeout(handleScroll, 100);
    window.addEventListener('resize', handleScroll);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', handleScroll);
    };
  }, [children]);

  const scrollNext = () => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector(".slider-item");
    if (!card) return;
    sliderRef.current.scrollBy({
      left: card.offsetWidth + 24, // 24 is gap-6
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector(".slider-item");
    if (!card) return;
    sliderRef.current.scrollBy({
      left: -(card.offsetWidth + 24),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/slider w-full">
      <button 
        onClick={scrollPrev}
        disabled={!canScrollLeft}
        className={`absolute left-0 lg:-left-4 top-[55%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all duration-300 ${!canScrollLeft ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 text-slate-800" />
      </button>

      <button 
        onClick={scrollNext}
        disabled={!canScrollRight}
        className={`absolute right-0 lg:-right-4 top-[55%] -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-slate-100 rounded-full flex items-center justify-center hover:bg-slate-50 transition-all duration-300 ${!canScrollRight ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 text-slate-800" />
      </button>
      
      <div 
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar pb-4" 
      >
        {React.Children.map(children, (child, index) => (
          <div key={index} className={`slider-item ${cardWidthClass} shrink-0 snap-start`}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}
