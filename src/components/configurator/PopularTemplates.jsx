import React, { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import { useRouter } from '@/i18n/routing.js';
import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/services/axiosInstance.js';
import { getImageUrl } from '@/utils/getImageUrl.js';
import Skeleton from '@/components/ui/Skeleton.jsx';
import { Link } from '@/i18n/routing.js';

function TemplateCard({ template, slug, router }) {
  const [activeVariantIndex, setActiveVariantIndex] = React.useState(0);
  
  const variants = template.colorVariants?.length > 0 ? template.colorVariants : [{
    name: 'Default',
    colorCode: '#cccccc',
    previewFront: template.previewFront || template.thumbnail,
    previewBack: template.previewBack,
    _id: 'default'
  }];
  
  const activeVariant = variants[activeVariantIndex];
  const mainImage = getImageUrl(activeVariant.previewFront) || 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=300&q=80';
  const backImage = getImageUrl(activeVariant.previewBack);

  const handleClick = () => {
    let url = `/products/${slug}/design?templateId=${template._id}`;
    if (activeVariant._id !== 'default') {
      url += `&variantId=${activeVariant._id}`;
    }
    router.push(url);
  };

  return (
    <div className="group rounded-lg border border-slate-300 bg-[#f4f4f4] overflow-hidden hover:border-slate-400 transition-colors flex flex-col h-[300px] min-w-[280px] sm:min-w-[300px] shrink-0 snap-start transform-gpu">
      {/* Image Container */}
      <div 
        className="flex-1 p-4 pb-2 flex items-center justify-center cursor-pointer"
        onClick={handleClick}
      >
         <div className="w-full aspect-[1.75/1] bg-white shadow-sm border border-slate-200 flex items-center justify-center relative overflow-hidden group-hover:shadow-md transition-shadow transform-gpu rounded-md p-1 group/img">
           <img 
             src={mainImage} 
             alt={template.name}
             className={`w-full h-full object-contain rounded-sm transition-opacity duration-300 ${backImage ? 'group-hover/img:opacity-0' : ''}`}
           />
           {backImage && (
             <img 
               src={backImage} 
               alt={`${template.name} back`}
               className="absolute inset-1 w-[calc(100%-8px)] h-[calc(100%-8px)] object-contain rounded-sm opacity-0 group-hover/img:opacity-100 transition-opacity duration-300"
             />
           )}
         </div>
      </div>

      {/* Title Area and Swatches */}
      <div className="p-4 pt-1 flex flex-col">
        {variants.length > 1 && (
          <div className="flex items-center gap-1.5 mb-2">
            {variants.map((v, idx) => (
              <button
                key={v._id || idx}
                onClick={(e) => { e.stopPropagation(); setActiveVariantIndex(idx); }}
                className={`w-5 h-5 rounded-full border-2 transition-all ${activeVariantIndex === idx ? 'border-blue-600 scale-110 shadow-sm' : 'border-slate-300 hover:scale-110'}`}
                style={{ backgroundColor: v.colorCode || '#ccc' }}
                title={v.name}
              />
            ))}
          </div>
        )}
        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 cursor-pointer" onClick={handleClick}>{template.name}</h3>
        <p className="text-xs text-slate-500 mt-0.5 truncate">
          {template.editableFields?.length || 0} editable fields
        </p>
      </div>
    </div>
  );
}

export default function PopularTemplates({ slug }) {
  const router = useRouter();
  const scrollRef = useRef(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ['templates', slug],
    queryFn: async () => {
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
    return null;
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
          <TemplateCard key={template._id} template={template} slug={slug} router={router} />
        ))}
      </div>
    </div>
  );
}
