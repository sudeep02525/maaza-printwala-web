'use client';

import { useState } from 'react';
import { Sparkles, ZoomIn, ShieldCheck, Package, Layers } from 'lucide-react';
import { cn } from '../../lib/utils.js';

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

  return (
    <div className="space-y-4 select-none">
      {/* Main Studio Preview Box */}
      <div className="relative bg-slate-100 rounded-lg border border-slate-200 overflow-hidden aspect-4/3 flex items-center justify-center group shadow-sm">
        {images.length > 0 ? (
          <img
            src={images[activeIdx]?.url || images[0]?.url}
            alt={images[activeIdx]?.alt || product.name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-400 space-y-2 p-8">
            <Package className="w-16 h-16 stroke-1" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Standard Print Preview</span>
          </div>
        )}

        {/* Priority Order & Category Tag */}
        <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-[11px] font-black text-slate-900 uppercase tracking-wider">
              {product.category?.name || 'Commercial Press'}
            </span>
          </div>
          {images.length > 0 && (
            <div className="bg-slate-900/90 text-white px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              {images[activeIdx]?.label || 'Studio Shot'}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-slate-900/80 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg backdrop-blur-md flex items-center gap-1.5 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity">
            <ZoomIn className="w-3.5 h-3.5" /> High-Res Studio Macro Zoom
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

      {/* Commercial Pre-Press Quality Notice */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-[#0082CA] shrink-0 mt-0.5" />
        <div className="text-xs text-slate-700 leading-relaxed font-normal">
          <span className="font-bold text-slate-900">Commercial Print Standards:</span> Manufactured using high-density offset and digital press reproduction with manual staff verification of submitted artwork safe zones.
        </div>
      </div>
    </div>
  );
}
