'use client';

import { useState } from 'react';
import { Sparkles, ZoomIn, ShieldCheck, Package } from 'lucide-react';
import { cn } from '../../lib/utils.js';

export default function ProductGallery({ product }) {
  const rawImages = product.images && product.images.length > 0 ? product.images : [];
  const images = rawImages.map((img) => (typeof img === 'string' ? { url: img, alt: product.name } : img));

  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="space-y-4 select-none">
      {/* Main Preview Box */}
      <div className="relative bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden aspect-4/3 flex items-center justify-center group shadow-xs">
        {images.length > 0 ? (
          <img
            src={images[activeIdx]?.url || images[0]?.url}
            alt={images[activeIdx]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-8">
            <Package className="w-16 h-16 stroke-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Print Preview</span>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1.5 border border-slate-200">
          <Sparkles className="w-3.5 h-3.5 text-[#D63384]" />
          <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider">
            {product.category?.name || 'Commercial Press'}
          </span>
        </div>

        {images.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white text-[10px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs flex items-center gap-1 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3 h-3" /> Preview Item
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={cn(
                'relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-slate-50',
                activeIdx === idx
                  ? 'border-[#0A58CA] ring-2 ring-[#0A58CA]/20 scale-95 shadow-xs'
                  : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
              )}
            >
              <img src={img.url} alt={img.alt || 'thumbnail'} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Standard Quality Notice */}
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[#0A58CA] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed font-normal">
          <span className="font-bold text-slate-900">Commercial Print Standards:</span> Manufactured using standard digital and offset press reproduction with basic staff review of submitted artwork boundaries.
        </div>
      </div>
    </div>
  );
}
