'use client';

import { useState, useEffect, Suspense, use, useRef } from 'react';
import { Link } from '@/i18n/routing.js';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Home, ShieldCheck, Truck, HelpCircle, FileText, CheckCircle2, Package, MapPin, Star, AlertCircle, RotateCcw, ChevronDown, Image, CloudUpload, Zap, Palette, Layers, Sparkles } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import axiosInstance from '../../../../services/axiosInstance.js';
import { useConfiguratorStore } from '@/store/configuratorStore.js';
import ProductGallery from '@/components/configurator/ProductGallery.jsx';
import SchemaConfigurator from '@/components/configurator/SchemaConfigurator.jsx';

import DesignExperienceModal from '@/components/configurator/DesignExperienceModal.jsx';
import DesignReadySummary from '@/components/configurator/DesignReadySummary.jsx';
import PopularTemplates from '@/components/configurator/PopularTemplates.jsx';

function ProductDetailContent({ slug }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setProductContext, designReadyState, quantity, setQuantity, priceData, isCalculating } = useConfiguratorStore();
  const tCategory = useTranslations('categories');
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [deliverySpeed, setDeliverySpeed] = useState('standard');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const standardQuantities = [100, 200, 300, 400, 500, 1000, 1500, 2000, 3000, 5000];

  const getDisplayUnitPrice = (q) => {
    if (quantity === q && priceData?.unitPrice) return priceData.unitPrice.toFixed(2);
    if (!priceData?.unitPrice) return "2.00";
    const ratio = q / quantity;
    let mockUnit = priceData.unitPrice;
    if (q > quantity) {
        mockUnit = priceData.unitPrice * Math.pow(0.95, Math.log2(ratio));
    } else if (q < quantity) {
        mockUnit = priceData.unitPrice * Math.pow(1.05, Math.log2(1/ratio));
    }
    return mockUnit.toFixed(2);
  };
  const productTranslations = {
    'Premium Matte Visiting Card 30': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 30', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 30' },
    'Premium Matte Visiting Card 10': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 10', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 10' },
    'Premium Textured Visiting Card 15': { hi: 'प्रीमियम टेक्सचर्ड विजिटिंग कार्ड 15', mr: 'प्रीमियम टेक्स्चर्ड व्हिजिटिंग कार्ड 15' },
    'Premium Matte Visiting Card 20': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 20', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 20' },
    'Premium Die-Cut Visiting Card 29': { hi: 'प्रीमियम डाई-कट विजिटिंग कार्ड 29', mr: 'प्रीमियम डाय-कट व्हिजिटिंग कार्ड 29' },
    'Standard Visiting Cards': { hi: 'स्टैंडर्ड विजिटिंग कार्ड्स', mr: 'स्टँडर्ड व्हिजिटिंग कार्ड्स' }
  };
  const getProductName = (name) => {
    if (!name) return 'Premium Print Item';
    return productTranslations[name]?.[locale] || name;
  };

  // 1. Fetch Product
  const { data: prodData, isLoading: prodLoading, isError: prodError } = useQuery({
    queryKey: ['productDetail', slug],
    queryFn: () => axiosInstance.get(`/products/${slug}`),
    retry: false,
  });

  const product = prodData?.data?.product || null;

  // 2. Fetch Schema
  const { data: schemaData, isLoading: schemaLoading } = useQuery({
    queryKey: ['productSchema', product?._id],
    queryFn: () => axiosInstance.get(`/products/${product._id}/schema`),
    enabled: !!product?._id,
    retry: false,
  });

  const schema = schemaData?.data?.schema || null;

  // Sync store context on load
  useEffect(() => {
    if (product && schema) {
      const defaultQty = schema.quantityTiers?.[0] || 100;
      const defaultConfig = {};
      if (schema.attributes) {
        schema.attributes.forEach((attr) => {
          if (attr.options && attr.options.length > 0) {
            defaultConfig[attr.key] = attr.options[0].value;
          }
        });
      }
      setProductContext(product.slug || product._id, product._id, defaultQty, defaultConfig);
    }
  }, [product, schema, setProductContext]);

  if (prodLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#0082CA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-bold text-slate-500">Loading print specifications...</p>
      </div>
    );
  }

  if (prodError || !product) {
    return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <p className="text-sm text-slate-500">We couldn&apos;t locate the requested product in our catalogue.</p>
        <Link
          href="/category/all"
          className="inline-block px-6 py-2.5 bg-[#0082CA] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#0068A2]"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 lg:pb-12">
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 select-none font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center text-sm font-normal text-slate-500 space-x-2 overflow-x-auto py-1 mb-4">
        <Link href="/" className="hover:text-slate-700 flex items-center shrink-0 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
        <span className="shrink-0 cursor-pointer hover:text-slate-700 transition-colors">{product.category?.slug ? tCategory(product.category.slug) : (product.category?.name || 'Print Item')}</span>
        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" strokeWidth={2} />
        <span className="text-slate-900 shrink-0">{getProductName(product.name)}</span>
      </nav>

      {/* 2. Design Ready Banner */}
      {designReadyState && (
        <div className="pt-2">
          <DesignReadySummary product={product} />
        </div>
      )}

      {/* 3. Main Product Stage */}
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
        
        {/* LEFT COL: Gallery */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-24 self-start space-y-6 z-10">
          {/* Gallery Component */}
          <div className="w-full">
            <ProductGallery product={product} />
          </div>
        </div>

        {/* RIGHT COL: Detailed Information & Configurator */}
        <div className="w-full lg:w-1/2 space-y-8 pb-10">
          
          {/* Header Section */}
          <div>
            <h1 className="text-[28px] sm:text-3xl font-bold text-black mb-1">{getProductName(product.name)}</h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-800 mb-4">
              <div className="flex text-[#ff9900]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>
              <span className="font-bold">4.5</span>
              <span className="underline cursor-pointer">(1611)</span>
            </div>
            
            <p className="text-[15px] font-bold text-black mb-4">Personalized cards with a professional look.</p>
            
            <ul className="list-disc pl-5 text-[15px] text-black space-y-1 mb-4">
              <li>4000+ design options available</li>
              <li>Standard glossy or matte paper included</li>
              <li>Need help in designing? You can avail our <span className="underline cursor-pointer">Design Services</span></li>
              <li>Same Day Delivery available on select pin codes in <span className="underline cursor-pointer">Mumbai</span>, <span className="underline cursor-pointer">Bengaluru</span> &amp; <span className="underline cursor-pointer">Kolkata</span>. Order before 12 noon for same day delivery. Orders placed after 12 noon will be delivered the next working day.</li>
              <li><span className="font-bold">Note: Do not upload designs containing signatures or content from Government entities, banks or financial institutions.</span></li>
              <li className="italic">Cash on Delivery available only for Standard delivery speed</li>
              <li>Price below is MRP (inclusive of all taxes)</li>
            </ul>
            
            <button className="text-[15px] underline text-black hover:text-[#0082CA] transition-colors">See Details</button>
          </div>

          {/* Pricing Section */}
          <div className="space-y-1">
            <div className="flex items-center text-[28px] font-bold text-black">
              ₹{(priceData?.totalPrice || 200).toFixed(2)}
            </div>
            <div className="text-[15px] text-slate-500">
              ₹{priceData?.unitPrice?.toFixed(2) || '2.00'} each / {quantity} units
            </div>
          </div>

          {/* Delivery Info */}
          <div className="text-[15px]">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-black">Delivery to 110001</span>
              <button className="underline text-black">More information</button>
            </div>
            <div className="flex items-center gap-2 font-bold text-black">
              <Truck className="w-5 h-5" />
              <span>8 August <span className="text-emerald-500 font-normal">FREE</span></span>
            </div>
          </div>

          {/* Configurator Controls */}
          <div className="space-y-6">
            
            {/* Delivery Speed */}
            <div className="space-y-1">
              <label className="text-[15px] font-bold text-black block">Delivery Speed</label>
              <div className="flex gap-2">
                <button 
                  onClick={() => setDeliverySpeed('standard')}
                  className={`flex-1 py-3 px-4 border rounded-md text-[13px] font-bold transition-colors ${
                    deliverySpeed === 'standard' 
                      ? 'bg-[#e7f4fb] border-[#0082CA] text-black' 
                      : 'bg-white border-slate-300 text-black hover:bg-slate-50'
                  }`}
                >
                  Standard
                </button>
                <button 
                  onClick={() => setDeliverySpeed('sameday')}
                  className={`flex-1 py-3 px-4 border rounded-md text-[13px] font-bold transition-colors ${
                    deliverySpeed === 'sameday' 
                      ? 'bg-[#e7f4fb] border-[#0082CA] text-black' 
                      : 'bg-white border-slate-300 text-black hover:bg-slate-50'
                  }`}
                >
                  Same Day Delivery - Mumbai, Bengaluru &amp; Kolkata
                </button>
              </div>
            </div>

            {/* Corners */}
            <div className="space-y-1">
              <label className="text-[15px] font-bold text-black block">Corners</label>
              <div className="relative">
                <select className="w-full appearance-none bg-white border border-slate-400 rounded-md px-3 py-2.5 pr-10 text-[15px] font-bold text-black focus:outline-none focus:border-black cursor-pointer">
                  <option>Standard</option>
                  <option>Rounded</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-1">
              <label className="text-[15px] font-bold text-black block">Quantity</label>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-white border border-slate-400 rounded-md px-3 py-2.5 flex items-center justify-between focus:outline-none focus:border-black cursor-pointer text-[15px] font-bold text-black"
                >
                  <span>{quantity.toLocaleString('en-IN')} (₹{priceData?.unitPrice?.toFixed(2) || '2.00'} / unit)</span>
                  <ChevronDown className={`w-5 h-5 text-black transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2.5} />
                </button>
                
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1.5 bg-white border border-slate-300 rounded-md shadow-lg max-h-[300px] overflow-y-auto py-1 custom-scrollbar">
                    {standardQuantities.map((q) => {
                      const isSelected = quantity === q;
                      return (
                        <div
                          key={q}
                          onClick={() => {
                            setQuantity(q);
                            setIsOpen(false);
                          }}
                          className={`px-3 py-2.5 cursor-pointer flex items-center justify-between text-[15px] font-medium mx-1.5 my-1 rounded-md transition-colors ${
                            isSelected 
                              ? 'bg-[#f0f7ff] text-black border border-[#0082CA]' 
                              : 'text-black hover:bg-slate-100 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{q.toLocaleString('en-IN')} (₹{getDisplayUnitPrice(q)} / unit)</span>
                            {q === 200 && (
                              <span className="bg-sky-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-sky-200 ml-1 leading-none">
                                Recommended
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-6 border-t border-slate-200">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#71cbf4] hover:bg-[#5dbfec] text-black font-bold text-[15px] py-3.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              Browse designs <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-white hover:bg-slate-50 border border-slate-300 text-black font-bold text-[15px] py-3.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
            >
              Upload design <CloudUpload className="w-5 h-5" />
            </button>
            
            <div className="pt-2">
              <button className="text-[15px] font-bold text-black flex items-center justify-between w-full hover:text-[#0082CA] transition-colors py-3 border-b border-slate-200">
                Specs &amp; Templates <ChevronRight className="w-5 h-5" />
              </button>
              <button className="text-[15px] font-bold text-black flex items-center justify-between w-full hover:text-[#0082CA] transition-colors py-3 border-b border-slate-200">
                Product Options <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      <PopularTemplates slug={slug} />

    </div>

      {/* Modal Drawer */}
      {product && (
        <DesignExperienceModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={product}
        />
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }) {
  const unwrappedParams = use(params);
  return (
    <Suspense fallback={
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#0082CA] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Loading product specifications...</p>
      </div>
    }>
      <ProductDetailContent slug={unwrappedParams.slug} />
    </Suspense>
  );
}
