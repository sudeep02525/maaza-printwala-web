import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing.js';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';
import Skeleton from '@/components/ui/Skeleton.jsx';
import { Link } from '@/i18n/routing.js';

export default function PopularTemplates({ slug }) {
  const router = useRouter();
  const scrollRef = useRef(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['templates', slug],
    queryFn: async () => {
      // API supports fetching by either slug or Object ID
      const res = await axiosInstance.get(`/templates/product/${slug}`);
      return res.data;
    },
    enabled: !!slug
  });

  const templates = response?.data?.templates || response?.templates || [];

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16 border-t border-slate-200 pt-12 w-full relative">
        <h2 className="text-[22px] font-bold text-black mb-6">Explore most popular templates</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
          {[1, 2, 3, 4].map(i => (
            <Skeleton key={i} className="h-[280px] min-w-[280px] sm:min-w-[300px] shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return null; // Don't show the section if no templates exist for this product
  }

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
          <Link href="/products" className="text-[14px] font-bold text-black flex items-center gap-0.5 hover:underline">
            Browse all <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex overflow-x-auto gap-4 pb-4 no-scrollbar snap-x"
      >
        {templates.map((template) => (
          <div 
            key={template._id}
            onClick={() => router.push(`/products/${slug}/design?templateId=${template._id}`)}
            className="group cursor-pointer rounded-lg border border-slate-300 bg-[#f4f4f4] overflow-hidden hover:border-slate-400 transition-colors flex flex-col h-[280px] min-w-[280px] sm:min-w-[300px] shrink-0 snap-start transform-gpu"
          >
            {/* Image Container */}
            <div className="flex-1 p-4 flex items-center justify-center">
               <div className="w-full h-full bg-white shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow transform-gpu rounded-md p-1">
                 <img 
                   src={getImageUrl(template.thumbnail || template.previewFront) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80'} 
                   alt={template.name}
                   className="w-full h-full object-cover rounded-sm"
                 />
               </div>
            </div>

            {/* Title Area (Replaced Swatches) */}
            <div className="p-4 pt-1 flex flex-col">
              <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{template.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5 truncate">
                {template.editableFields?.length || 0} editable fields
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
