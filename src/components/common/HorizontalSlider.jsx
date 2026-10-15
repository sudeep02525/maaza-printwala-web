'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HorizontalSlider({
  children,
  cardWidthClass = "w-[calc(50%-6px)] sm:w-[260px] lg:w-[calc(25%-18px)]",
}) {
  const sliderRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!sliderRef.current) return;
    const slider = sliderRef.current;
    
    setCanScrollLeft(slider.scrollLeft > 5);
    setCanScrollRight(
      slider.scrollLeft < slider.scrollWidth - slider.clientWidth - 10
    );
  };

  useEffect(() => {
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
    const gap = typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24;
    sliderRef.current.scrollBy({
      left: card.offsetWidth + gap,
      behavior: "smooth",
    });
  };

  const scrollPrev = () => {
    if (!sliderRef.current) return;
    const card = sliderRef.current.querySelector(".slider-item");
    if (!card) return;
    const gap = typeof window !== 'undefined' && window.innerWidth < 640 ? 12 : 24;
    sliderRef.current.scrollBy({
      left: -(card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/slider w-full">
      {/* Previous Slide Button */}
      <button 
        type="button"
        onClick={scrollPrev}
        disabled={!canScrollLeft}
        className={`absolute left-0 sm:-left-4 top-[38%] -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 bg-[var(--bg-card)]/95 shadow-md border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--bg-subtle)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
          !canScrollLeft ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        }`}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-main)]" />
      </button>

      {/* Next Slide Button */}
      <button 
        type="button"
        onClick={scrollNext}
        disabled={!canScrollRight}
        className={`absolute right-0 sm:-right-4 top-[38%] -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 bg-[var(--bg-card)]/95 shadow-md border border-[var(--border)] rounded-full flex items-center justify-center hover:bg-[var(--bg-subtle)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer ${
          !canScrollRight ? 'opacity-0 pointer-events-none scale-75' : 'opacity-100 scale-100'
        }`}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--text-main)]" />
      </button>
      
      {/* Scrollable Cards Track */}
      <div 
        ref={sliderRef}
        onScroll={handleScroll}
        className="flex gap-3 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3 sm:pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" 
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
