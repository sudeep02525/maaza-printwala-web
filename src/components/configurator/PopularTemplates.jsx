import React from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing.js';

export default function PopularTemplates({ slug }) {
  const router = useRouter();
  // Mock data for templates matching the screenshot
  const templates = [
    {
      id: 1,
      name: 'Minimalist',
      colors: ['#475569', '#3b82f6', '#10b981', '#ef4444'],
      renderPreview: () => (
        <div className="w-full h-full bg-white flex flex-col items-center justify-center border-[0.5px] border-slate-200 shadow-sm relative p-2">
          <div className="text-slate-800 text-[18px] font-bold tracking-wide">Company Name</div>
          <div className="text-slate-400 text-[8px] uppercase tracking-widest mt-1">Tagline or Message</div>
          <div className="absolute bottom-3 left-3 text-slate-500 text-[6px]">
            John Doe<br/>CEO & Founder
          </div>
          <div className="absolute bottom-3 right-3 text-slate-500 text-[6px] text-right">
            +1 234 567 890<br/>hello@company.com
          </div>
        </div>
      )
    },
    {
      id: 2,
      name: 'Elegant Maroon',
      colors: ['#451a2e', '#3b82f6', '#eab308', '#000000'],
      renderPreview: () => (
        <div className="w-full h-full bg-[#451a2e] flex flex-col items-center justify-center shadow-sm relative p-2 border-[0.5px] border-slate-200">
          <div className="text-[#eab308] text-[20px] font-serif italic mb-1">C & C</div>
          <div className="w-8 h-[1px] bg-[#eab308] mb-1 opacity-50"></div>
          <div className="text-white text-[9px] uppercase tracking-[0.2em] opacity-90">Boutique</div>
          <div className="absolute bottom-3 text-[#eab308] text-[6px] text-center opacity-80 w-full left-0">
            www.boutique.com
          </div>
        </div>
      )
    },
    {
      id: 3,
      name: 'Bold Red',
      colors: ['#dc2626', '#3b82f6', '#38bdf8', '#84cc16'],
      renderPreview: () => (
        <div className="w-full h-full bg-white flex flex-col justify-end shadow-sm relative border-[0.5px] border-slate-200">
          <div className="absolute top-0 left-0 w-full h-[40%] bg-red-600 rounded-b-3xl"></div>
          <div className="absolute top-3 left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm z-10 text-red-600 font-black text-xs">V</div>
          <div className="p-3 pb-2 z-10 bg-white pt-4">
            <div className="text-slate-900 text-[12px] font-black uppercase">Vanguard</div>
            <div className="text-red-600 text-[7px] font-bold mt-0.5">CREATIVE AGENCY</div>
            <div className="text-slate-500 text-[6px] mt-2 flex justify-between">
               <span>New York, NY</span>
               <span>vanguard.io</span>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 4,
      name: 'Photo Real Estate',
      colors: ['#3b82f6', '#000000', '#9ca3af', '#d4d4d8'],
      moreColors: '+1',
      renderPreview: () => (
        <div className="w-full h-full bg-slate-100 flex items-stretch shadow-sm relative border-[0.5px] border-slate-200 overflow-hidden">
          <div className="w-[35%] bg-slate-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/20 mix-blend-multiply"></div>
            <div className="w-full h-full flex items-center justify-center text-white opacity-60">
              <div className="w-6 h-6 rounded-full bg-white/30 flex items-center justify-center">
                 <div className="w-3 h-3 rounded-full bg-white/50"></div>
              </div>
            </div>
          </div>
          <div className="flex-1 p-3 flex flex-col justify-center">
            <div className="w-3 h-3 bg-blue-600 rounded-sm mb-1.5 flex items-center justify-center"><div className="w-1.5 h-1.5 bg-white rounded-full"></div></div>
            <div className="text-slate-900 text-[12px] font-black leading-tight">Sarah<br/>Jenkins</div>
            <div className="text-blue-600 text-[6px] font-bold uppercase mt-1">Real Estate Agent</div>
            <div className="text-slate-500 text-[5px] mt-2 space-y-0.5">
               <div>123 Luxury Ave</div>
               <div>sarah@realty.com</div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 5,
      name: 'Modern Dark',
      colors: ['#0f172a', '#ffffff', '#3b82f6', '#f43f5e'],
      renderPreview: () => (
        <div className="w-full h-full bg-[#0f172a] flex flex-col justify-between shadow-sm relative border-[0.5px] border-slate-700 p-3">
          <div className="flex justify-between items-start">
             <div className="text-white text-[14px] font-bold tracking-widest">NEXUS</div>
             <div className="w-4 h-4 bg-blue-500 rounded-sm transform rotate-45"></div>
          </div>
          <div className="text-right">
            <div className="text-white text-[9px] font-bold">ALEX CHEN</div>
            <div className="text-slate-400 text-[6px] mt-0.5">SOFTWARE ENGINEER</div>
            <div className="text-slate-500 text-[5px] mt-2">+1 555 0199 • alex@nexus.dev</div>
          </div>
        </div>
      )
    },
    {
      id: 6,
      name: 'Creative Studio',
      colors: ['#fdf4ff', '#c026d3', '#fbcfe8', '#000000'],
      renderPreview: () => (
        <div className="w-full h-full bg-fuchsia-50 flex items-center justify-center shadow-sm relative border-[0.5px] border-fuchsia-100 overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-24 h-24 bg-fuchsia-200 rounded-full mix-blend-multiply opacity-50 blur-lg"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-20 h-20 bg-pink-200 rounded-full mix-blend-multiply opacity-50 blur-lg"></div>
          <div className="text-center z-10">
            <div className="text-fuchsia-800 text-[16px] font-serif italic">Studio<span className="font-sans font-black text-slate-900">M</span></div>
            <div className="text-slate-600 text-[6px] tracking-widest uppercase mt-1">Design & Art</div>
          </div>
        </div>
      )
    }
  ];

  // Ref for scrolling
  const scrollRef = React.useRef(null);
  
  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mt-16 border-t border-slate-200 pt-12 w-full relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[22px] font-bold text-black">Explore most popular templates</h2>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 mr-4">
            <button onClick={() => scroll('left')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors">
              <ChevronRight className="w-4 h-4 rotate-180" />
            </button>
            <button onClick={() => scroll('right')} className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 text-slate-600 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button className="text-[14px] font-bold text-black flex items-center gap-0.5 hover:underline">
            Browse all <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x"
      >
        {templates.map((template) => (
          <div 
            key={template.id}
            onClick={() => router.push(`/products/${slug}/templates?templateId=${template.id}`)}
            className="group cursor-pointer rounded-lg border border-slate-300 bg-[#f4f4f4] overflow-hidden hover:border-slate-400 transition-colors flex flex-col h-[280px] min-w-[280px] sm:min-w-[300px] snap-start"
          >
            {/* Image Container */}
            <div className="flex-1 p-4 flex items-center justify-center">
               <div className="w-full bg-white shadow-sm border border-slate-200 aspect-[1.75/1] flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow">
                  {template.renderPreview()}
               </div>
            </div>

            {/* Colors Area */}
            <div className="p-4 pt-1 flex items-center gap-1.5">
              {template.colors.map((color, idx) => (
                <div 
                  key={idx} 
                  className={`w-[18px] h-[18px] rounded-full border border-slate-300 shadow-sm ${idx === 0 || idx === 1 ? 'ring-1 ring-blue-500 ring-offset-1' : ''}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              {template.moreColors && (
                <span className="text-[13px] font-medium text-slate-600 ml-0.5">{template.moreColors}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
