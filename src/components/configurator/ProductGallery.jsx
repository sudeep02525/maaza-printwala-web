'use client';

import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useSpring, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Sparkles, ZoomIn, ShieldCheck, Package, Layers } from 'lucide-react';
import { cn } from '@/lib/utils.js';

export default function ProductGallery({ product }) {
  const rawImages = product.images && product.images.length > 0 ? product.images : [];
  
  // Official Product Image Priority Order labels
  const priorityLabels = [
    '1. Hero Packshot',
    '2. Angle View',
    '3. Texture Close-up',
    '4. Lifestyle Usage',
    '5. Boxed Packaging',
    '6. Gallery Sample',
  ];

  const images = rawImages.map((img, idx) => {
    const url = typeof img === 'string' ? img : img.url;
    const alt = typeof img === 'string' ? product.name : img.alt || product.name;
    const label = priorityLabels[idx] || `Gallery View ${idx + 1}`;
    return { url, alt, label };
  });

  const [activeIdx, setActiveIdx] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const hoverTimerRef = useRef(null);

  // High performance Framer Motion values (no re-renders on mouse move)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const bgX = useMotionValue(50);
  const bgY = useMotionValue(50);

  // Spring physics for smooth lens follow
  const springConfig = { stiffness: 300, damping: 30, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  // Template for background position
  const bgPosition = useMotionTemplate`${bgX}% ${bgY}%`;

  const handleMouseEnter = () => {
    hoverTimerRef.current = setTimeout(() => {
      setIsZoomed(true);
    }, 100); // reduced delay for snappier premium feel
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    setIsZoomed(false);
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - left;
    const py = e.clientY - top;
    
    // Set absolute positions for the lens
    mouseX.set(px);
    mouseY.set(py);

    // Set percentage positions for the background zoom
    bgX.set((px / width) * 100);
    bgY.set((py / height) * 100);
  };

  return (
    <div className="space-y-4 select-none">
      <div className="relative">
        {/* Main Studio Preview Box */}
      <div 
        className={cn(
          "relative bg-slate-100 rounded-lg border border-slate-200 overflow-hidden aspect-square flex items-center justify-center shadow-sm",
          isZoomed ? "cursor-none" : "cursor-zoom-in"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
      >
        {images.length > 0 ? (
          <img
            src={images[activeIdx]?.url || images[0]?.url}
            alt={images[activeIdx]?.alt || product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-8">
            <Package className="w-16 h-16 stroke-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Print Preview</span>
          </div>
        )}
      </div>

        {/* Premium Inline Lens Magnifier */}
        <AnimatePresence>
          {isZoomed && images.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-[100] border-[2px] border-white/90 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5),inset_0_0_20px_rgba(255,255,255,0.8)] rounded-full overflow-hidden pointer-events-none"
              style={{
                width: '300px',
                height: '300px',
                left: springX,
                top: springY,
                x: '-50%',
                y: '-50%',
                backgroundImage: `url(${images[activeIdx]?.url || images[0]?.url})`,
                backgroundPosition: bgPosition,
                backgroundSize: '300%', // 3x zoom
                backgroundRepeat: 'no-repeat',
                imageRendering: 'high-quality'
              }}
            >
              {/* Glass Edge Fade Effect inside the lens */}
              <div 
                className="absolute inset-0 rounded-full" 
                style={{
                  background: 'radial-gradient(circle, transparent 65%, rgba(255,255,255,0.15) 85%, rgba(255,255,255,0.4) 100%)',
                  backdropFilter: 'blur(3px)',
                  WebkitBackdropFilter: 'blur(3px)',
                  maskImage: 'radial-gradient(circle, transparent 65%, black 100%)',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 65%, black 100%)'
                }} 
              />
              {/* Center Crosshair Dot for precision feel */}
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-black/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* Thumbnails Row with Priority Order Tooltips */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 bg-slate-50 group/thumb',
                activeIdx === idx
                  ? 'border-[#0082CA] ring-2 ring-[#0082CA]/20 scale-95 shadow-sm'
                  : 'border-slate-200 opacity-75 hover:opacity-100 hover:border-slate-300'
              )}
            >
              <img src={img.url} alt={img.alt || 'thumbnail'} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 text-white text-[8px] font-extrabold py-0.5 text-center tracking-tighter truncate px-0.5">
                {img.label.split(' ')[1] || `View ${idx + 1}`}
              </div>
            </button>
          ))}
        </div>
      )}


    </div>
  );
}
