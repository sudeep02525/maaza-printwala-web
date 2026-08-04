'use client';

import { useState } from 'react';
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
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });
  const [isZoomed, setIsZoomed] = useState(false);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Studio Preview Box */}
      <div 
        className="relative bg-slate-100 rounded-lg border border-slate-200 overflow-hidden aspect-square flex items-center justify-center shadow-sm cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {images.length > 0 ? (
          <img
            src={images[activeIdx]?.url || images[0]?.url}
            alt={images[activeIdx]?.alt || product.name}
            className={cn(
              "w-full h-full object-cover transition-transform duration-200",
              isZoomed ? "scale-[2.5]" : "scale-100"
            )}
            style={isZoomed ? {
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`
            } : {}}
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-8">
            <Package className="w-16 h-16 stroke-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Print Preview</span>
          </div>
        )}
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
