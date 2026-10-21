'use client';

import { useState, useEffect, Suspense, use, useRef } from 'react';
import { Link } from '@/i18n/routing.js';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Home, ShieldCheck, Truck, HelpCircle, FileText, CheckCircle2, Package, MapPin, Star, AlertCircle, RotateCcw, ChevronDown, Image, CloudUpload, Zap, Palette, Layers, Sparkles, ArrowRight } from 'lucide-react';
import { useTranslations, useLocale } from 'next-intl';
import axiosInstance from '../../../../services/axiosInstance.js';
import { useConfiguratorStore } from '@/store/configuratorStore.js';
import ProductGallery from '@/components/configurator/ProductGallery.jsx';
import SchemaConfigurator from '@/components/configurator/SchemaConfigurator.jsx';

import DesignExperienceModal from '@/components/configurator/DesignExperienceModal.jsx';
import DesignReadySummary from '@/components/configurator/DesignReadySummary.jsx';
import PopularTemplates from '@/components/configurator/PopularTemplates.jsx';
import RecentlyViewedProducts from '@/components/products/RecentlyViewedProducts.jsx';
import ProductReviews from '@/components/products/ProductReviews.jsx';
import { safeJsonParse, pick } from '@/lib/devkit';

export function ProductDetailContent({ slug, fallbackCategorySlug, fallbackCategoryName }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { setProductContext, designReadyState, quantity, updateQuantity, priceResult, configuration, updateConfiguration, setServerPriceResult } = useConfiguratorStore();
  const [isCalculating, setIsCalculating] = useState(false);
  const tCategory = useTranslations('categories');
  const locale = useLocale();

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [deliverySpeed, setDeliverySpeed] = useState('standard');
  const [pincode, setPincode] = useState('110001');
  const [isEditingPincode, setIsEditingPincode] = useState(false);
  const [pincodeInput, setPincodeInput] = useState('110001');
  const [openSection, setOpenSection] = useState('specs');

  // Query Delivery Rules from API for the entered PIN code
  const { data: deliveryData, isLoading: deliveryLoading } = useQuery({
    queryKey: ['deliveryMethods', pincode],
    queryFn: async () => {
      if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) return [];
      try {
        const res = await axiosInstance.get(`/checkout/delivery-methods?pinCode=${pincode}`);
        return res?.data?.data?.deliveryMethods || [];
      } catch (err) {
        return [];
      }
    },
    enabled: !!pincode && pincode.length === 6,
    staleTime: 5 * 60 * 1000,
  });

  const deliveryMethods = deliveryData || [];
  const standardMethod = deliveryMethods.find(m => m.deliveryMethod === 'STANDARD');
  const expressMethod = deliveryMethods.find(m => m.deliveryMethod === 'EXPRESS');
  const sameDayMethod = deliveryMethods.find(m => m.deliveryMethod === 'SAME_DAY');
  const expeditedMethod = sameDayMethod || expressMethod;

  const activeDeliveryMethod = deliverySpeed === 'sameday' || deliverySpeed === 'express'
    ? (expeditedMethod || standardMethod)
    : standardMethod;

  const orderTotal = priceResult?.totalPrice || 0;
  const isFreeDelivery = activeDeliveryMethod
    ? (activeDeliveryMethod.charge === 0 || (activeDeliveryMethod.freeDeliveryThreshold && orderTotal >= activeDeliveryMethod.freeDeliveryThreshold))
    : false;

  const deliveryChargeText = isFreeDelivery
    ? 'FREE'
    : (activeDeliveryMethod ? `₹${activeDeliveryMethod.charge}` : 'FREE');

  const getEstimatedDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getDeliveryDateText = (method) => {
    if (!method) {
      return getEstimatedDate(deliverySpeed === 'sameday' ? 1 : 4);
    }
    if (method.deliveryMethod === 'SAME_DAY') {
      return 'Tomorrow';
    }
    const days = method.estimatedDaysMin || 3;
    return getEstimatedDate(days);
  };

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
    const matchingTier = priceResult?.tiers?.find(t => t.quantity === q);
    if (matchingTier?.unitPrice) return Number(matchingTier.unitPrice).toFixed(2);
    if (priceResult?.finalUnitPrice) return Number(priceResult.finalUnitPrice).toFixed(2);
    if (priceResult?.unitPrice) return Number(priceResult.unitPrice).toFixed(2);
    return "0.00";
  };

  const getDisplayQuantity = () => {
    return priceResult?.quantity || quantity;
  };

  // Demo fallback to fix missing category in DB
  const demoProductToCategory = {
    'premium-matte-visiting-card-30': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-standard-business-cards': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-glossy-visiting-card-11': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-spot-uv-visiting-card-2': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-gold-foil-visiting-card-23': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-textured-visiting-card-5': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-velvet-touch-visiting-card-24': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-transparent-visiting-card-6': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-square-visiting-card-7': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-rounded-corners-visiting-card-8': { slug: 'visiting-cards', name: 'Visiting Cards' },
    'premium-die-cut-visiting-card-9': { slug: 'visiting-cards', name: 'Visiting Cards' },
  };

  const productTranslations = {
    'Premium Matte Visiting Card 30': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 30', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 30' },
    'Premium Matte Visiting Card 10': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 10', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 10' },
    'Premium Textured Visiting Card 15': { hi: 'प्रीमियम टेक्सचर्ड विजिटिंग कार्ड 15', mr: 'प्रीमियम टेक्स्चर्ड व्हिजिटिंग कार्ड 15' },
    'Premium Matte Visiting Card 20': { hi: 'प्रीमियम मैट विजिटिंग कार्ड 20', mr: 'प्रीमियम मॅट व्हिजिटिंग कार्ड 20' },
    'Premium Die-Cut Visiting Card 29': { hi: 'प्रीमियम डाई-कट विजिटिंग कार्ड 29', mr: 'प्रीमियम डाय-कट व्हिजिटिंग कार्ड 29' },
    'Standard Visiting Cards': { hi: 'स्टैंडर्ड विजिटिंग कार्ड्स', mr: 'स्टँडर्ड व्हिजिटिंग कार्ड्स' },
    'Premium Standard Business Cards': { en: 'Standard Visiting Cards', hi: 'स्टैंडर्ड विजिटिंग कार्ड्स', mr: 'स्टँडर्ड व्हिजिटिंग कार्ड्स' }
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

  const actualCategory = product?.category || demoProductToCategory[slug];

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
    if (product) {
      const defaultQty = schema?.quantityTiers?.[0] || 100;
      const defaultConfig = {
        corners: 'square',
        deliverySpeed: 'standard',
      };
      if (schema?.attributes) {
        schema.attributes.forEach((attr) => {
          if (attr.options && attr.options.length > 0) {
            defaultConfig[attr.key] = attr.options[0].value;
          }
        });
      }
      setProductContext(product.slug || product._id, product._id, defaultQty, defaultConfig);
    }
  }, [product, schema, setProductContext]);

  // Fetch real price from server when config changes
  useEffect(() => {
    if (product?._id && configuration && Object.keys(configuration).length > 0) {
      setIsCalculating(true);
      axiosInstance.post(`/products/${product._id}/price`, {
        quantity: quantity,
        configuration: configuration
      })
      .then((res) => {
        if (res?.data) {
          setServerPriceResult(res.data, true);
        }
      })
      .catch((err) => {
        console.error('Failed to calculate price', err);
      })
      .finally(() => {
        setIsCalculating(false);
      });
    }
  }, [product?._id, quantity, configuration, setServerPriceResult]);

  // Save to recently viewed
  useEffect(() => {
    if (product) {
      try {
        const stored = localStorage.getItem('recentlyViewedProducts');
        const parseRes = safeJsonParse(stored);
        let viewed = parseRes.success && Array.isArray(parseRes.data) ? parseRes.data : [];
        
        // Remove if already exists
        viewed = viewed.filter(p => p._id !== product._id);
        
        // Create a lightweight version of the product to save storage space
        const lightProduct = {
          ...pick(product, ['_id', 'slug', 'name', 'category', 'basePrice']),
          images: product.images?.slice(0, 1) || []
        };
        
        // Add to front
        viewed.unshift(lightProduct);
        
        // Keep only top 8
        if (viewed.length > 8) viewed = viewed.slice(0, 8);
        
        localStorage.setItem('recentlyViewedProducts', JSON.stringify(viewed));
      } catch (e) {
        console.error("Error saving recently viewed", e);
      }
    }
  }, [product]);

  if (prodLoading) {
    return (
      <div className="bg-[var(--bg-subtle)] min-h-screen pb-24 lg:pb-12">
        <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 select-none font-sans">
          {/* Breadcrumb Skeleton */}
          <div className="h-4 bg-[var(--border)] rounded w-[250px] animate-pulse mb-4" />
          
          {/* Main Product Stage Skeleton */}
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start relative">
            
            {/* LEFT COL: Gallery Skeleton */}
            <div className="w-full lg:w-1/2 lg:sticky lg:top-24 self-start space-y-6 z-10">
              <div className="w-full aspect-square bg-[var(--border)] rounded-lg animate-pulse" />
              <div className="flex gap-4">
                <div className="w-24 h-24 bg-[var(--border)] rounded animate-pulse" />
                <div className="w-24 h-24 bg-[var(--border)] rounded animate-pulse" />
                <div className="w-24 h-24 bg-[var(--border)] rounded animate-pulse" />
              </div>
            </div>
            
            {/* RIGHT COL: Detailed Information Skeleton */}
            <div className="w-full lg:w-1/2 space-y-8 pb-10">
              <div className="space-y-4">
                <div className="h-10 bg-[var(--border)] rounded w-3/4 animate-pulse" />
                <div className="h-4 bg-[var(--border)] rounded w-1/4 animate-pulse" />
                <div className="h-4 bg-[var(--border)] rounded w-full animate-pulse mt-4" />
                <div className="h-4 bg-[var(--border)] rounded w-5/6 animate-pulse" />
                <div className="h-4 bg-[var(--border)] rounded w-4/6 animate-pulse" />
              </div>

              <div className="space-y-2">
                <div className="h-10 bg-[var(--border)] rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-[var(--border)] rounded w-1/4 animate-pulse" />
              </div>
              
              <div className="space-y-4">
                <div className="h-14 bg-[var(--border)] rounded w-full animate-pulse" />
                <div className="h-14 bg-[var(--border)] rounded w-full animate-pulse" />
                <div className="h-14 bg-[var(--border)] rounded w-full animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (prodError || !product) {
    return (
    <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[var(--text-main)]">Product Not Found</h1>
        <p className="text-sm text-[var(--text-muted)]">We couldn&apos;t locate the requested product in our catalogue.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 bg-[#0082CA] text-white font-bold text-xs rounded-lg shadow-xs hover:bg-[#0068A2]"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen pb-24 lg:pb-12">
      <div className="w-full max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6 select-none font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center text-sm font-normal text-[var(--text-muted)] space-x-2 overflow-x-auto py-1 mb-4">
        <Link href="/" className="hover:text-[var(--text-main)] flex items-center shrink-0 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-4 h-4 text-[var(--text-faint)] shrink-0" strokeWidth={2} />
        <Link href={`/${actualCategory?.slug || fallbackCategorySlug || 'all'}`} className="shrink-0 hover:text-[var(--text-main)] transition-colors">
          {(actualCategory?.slug || fallbackCategorySlug) ? tCategory(actualCategory?.slug || fallbackCategorySlug) : (actualCategory?.name || fallbackCategoryName || 'Print Item')}
        </Link>
        <ChevronRight className="w-4 h-4 text-[var(--text-faint)] shrink-0" strokeWidth={2} />
        <span className="text-[var(--text-main)] shrink-0">{getProductName(product.name)}</span>
      </nav>

      {/* 2. Design Ready Banner */}
      {designReadyState && (
        <div className="pt-2">
          <DesignReadySummary product={product} />
        </div>
      )}

      {/* 3. Main Product Stage */}
      <div className="flex flex-col md:flex-row gap-8 lg:gap-14 items-start relative">
        
        {/* LEFT COL: Gallery */}
        <div className="w-full md:w-1/2 md:sticky md:top-24 self-start space-y-6 z-10">
          {/* Gallery Component */}
          <div className="w-full">
            <ProductGallery product={product} />
          </div>
        </div>

        {/* RIGHT COL: Detailed Information & Configurator */}
        <div className="w-full md:w-1/2 space-y-8 pb-10">
          
          {/* Header Section */}
          <div>
            <h1 className="text-[28px] sm:text-3xl font-bold text-[var(--text-main)] mb-1">{getProductName(product.name)}</h1>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-main)] mb-4">
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
            
            <p className="text-[15px] font-bold text-[var(--text-main)] mb-4">Personalized cards with a professional look.</p>
            
            <ul className="list-disc pl-5 text-[15px] text-[var(--text-main)] space-y-1 mb-4">
              <li>4000+ design options available</li>
              <li>Standard glossy or matte paper included</li>
              <li>Need help in designing? You can avail our <span className="underline cursor-pointer">Design Services</span></li>
              <li>Same Day Delivery available on select pin codes in <span className="underline cursor-pointer">Mumbai</span>, <span className="underline cursor-pointer">Bengaluru</span> &amp; <span className="underline cursor-pointer">Kolkata</span>. Order before 12 noon for same day delivery. Orders placed after 12 noon will be delivered the next working day.</li>
              <li><span className="font-bold">Note: Do not upload designs containing signatures or content from Government entities, banks or financial institutions.</span></li>
              <li className="italic">Cash on Delivery available only for Standard delivery speed</li>
              <li>Price below is MRP (inclusive of all taxes)</li>
            </ul>
            
            <button 
              type="button"
              onClick={() => {
                setOpenSection('specs');
                document.getElementById('product-specs-accordion')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-[15px] underline text-[var(--text-main)] hover:text-[#0082CA] transition-colors cursor-pointer"
            >
              See Details
            </button>
          </div>

          {/* Pricing Section */}
          <div className="space-y-1">
            <div className="flex items-center text-[28px] font-bold text-[var(--text-main)]">
              {isCalculating ? (
                <span className="h-8 w-24 bg-[var(--border)] rounded animate-pulse block"></span>
              ) : (
                `₹${(priceResult?.totalPrice || product?.basePrice || 200).toFixed(2)}`
              )}
            </div>
            <div className="text-[15px] text-[var(--text-muted)] flex items-center h-5">
              {isCalculating ? (
                <span className="h-4 w-32 bg-[var(--border)] rounded animate-pulse block"></span>
              ) : (
                `₹${(priceResult?.finalUnitPrice || priceResult?.unitPrice || 2.0).toFixed(2)} each / ${quantity} units`
              )}
            </div>
          </div>

          {/* Delivery Info */}
          <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-[var(--text-main)]">
                <MapPin className="w-3.5 h-3.5 text-[#0082CA]" />
                <span>Delivery to <strong className="text-[var(--text-main)] font-bold">{pincode}</strong></span>
              </div>
              {isEditingPincode ? (
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    maxLength={6}
                    value={pincodeInput}
                    onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                    className="w-20 px-2 py-0.5 text-xs border border-[var(--border-strong)] rounded bg-[var(--bg-card)] font-mono focus:outline-hidden focus:border-[#0082CA]"
                    placeholder="PIN Code"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pincodeInput.length === 6) setPincode(pincodeInput);
                      setIsEditingPincode(false);
                    }}
                    className="text-xs font-bold text-[#0082CA] hover:underline"
                  >
                    Check
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingPincode(true)}
                  className="text-xs font-semibold text-[#0082CA] hover:underline cursor-pointer"
                >
                  Change PIN
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 font-bold text-[var(--text-main)] text-sm">
              <Truck className="w-4 h-4 text-[#0082CA]" />
              <span>
                Deliver by <strong className="text-[var(--text-main)]">{getDeliveryDateText(activeDeliveryMethod)}</strong>{' '}
                <span className={`text-[11px] ml-1 px-2 py-0.5 rounded-full font-bold ${isFreeDelivery ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300' : 'text-[var(--text-main)] bg-[var(--hover)]'}`}>
                  {deliveryChargeText}
                </span>
              </span>
            </div>
          </div>

          {/* Configurator Controls */}
          <div className="space-y-6">
            
            {/* Delivery Speed */}
            <div className="space-y-1">
              <label className="text-[15px] font-bold text-[var(--text-main)] block">Delivery Speed</label>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setDeliverySpeed('standard');
                    updateConfiguration('deliverySpeed', 'standard');
                  }}
                  className={`flex-1 py-3 px-4 border rounded-md text-[13px] font-bold transition-colors cursor-pointer text-left sm:text-center ${
                    deliverySpeed === 'standard' 
                      ? 'bg-[#0082CA]/15 border-[#0082CA] text-[var(--text-main)]' 
                      : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div>Standard {standardMethod ? `(${standardMethod.estimatedDaysMin}-${standardMethod.estimatedDaysMax} Days)` : '(3-5 Days)'}</div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">
                    {standardMethod ? (orderTotal >= (standardMethod.freeDeliveryThreshold || Infinity) ? 'FREE' : `₹${standardMethod.charge}`) : 'FREE'}
                  </div>
                </button>
                <button 
                  type="button"
                  disabled={!expeditedMethod}
                  onClick={() => {
                    const speedVal = sameDayMethod ? 'sameday' : 'express';
                    setDeliverySpeed(speedVal);
                    updateConfiguration('deliverySpeed', speedVal);
                  }}
                  className={`flex-1 py-3 px-4 border rounded-md text-[13px] font-bold transition-colors cursor-pointer text-left sm:text-center disabled:opacity-50 disabled:cursor-not-allowed ${
                    deliverySpeed === 'sameday' || deliverySpeed === 'express' 
                      ? 'bg-[#0082CA]/15 border-[#0082CA] text-[var(--text-main)]' 
                      : 'bg-[var(--bg-card)] border-[var(--border)] text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                  }`}
                >
                  <div>{sameDayMethod ? 'Same Day (1 Day)' : expressMethod ? 'Express (2-3 Days)' : 'Express / Same Day'}</div>
                  <div className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">
                    {expeditedMethod ? `₹${expeditedMethod.charge}` : 'Not available for this PIN'}
                  </div>
                </button>
              </div>
            </div>

            {/* Corners */}
            <div className="space-y-1">
              <label className="text-[15px] font-bold text-[var(--text-main)] block">Corners</label>
              <div className="relative">
                <select
                  value={configuration?.corners || 'square'}
                  onChange={(e) => updateConfiguration('corners', e.target.value)}
                  className="w-full appearance-none bg-[var(--bg-card)] border border-[var(--border)] rounded-md px-3 py-2.5 pr-10 text-[15px] font-bold text-[var(--text-main)] focus:outline-hidden focus:border-[#0082CA] cursor-pointer"
                >
                  <option value="square">Standard Square Corners</option>
                  <option value="rounded">Smooth Rounded Corners (6mm) (+₹0.50/ea)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <ChevronDown className="w-5 h-5 text-[var(--text-main)]" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[15px] font-bold text-[var(--text-main)] block">Quantity &amp; Volume Pricing</label>
                <span className="text-xs font-semibold text-[#0082CA]">Bulk discounts applied</span>
              </div>

              {/* Volume Discount Table */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
                {(priceResult?.tiers || [
                  { quantity: 100, unitPrice: (priceResult?.unitPrice || 2.0), discountPercent: 0 },
                  { quantity: 250, unitPrice: (priceResult?.unitPrice || 2.0) * 0.9, discountPercent: 10 },
                  { quantity: 500, unitPrice: (priceResult?.unitPrice || 2.0) * 0.8, discountPercent: 20, popular: true },
                  { quantity: 1000, unitPrice: (priceResult?.unitPrice || 2.0) * 0.65, discountPercent: 35, bestValue: true },
                  { quantity: 2500, unitPrice: (priceResult?.unitPrice || 2.0) * 0.52, discountPercent: 48 },
                ]).map((tier) => {
                  const isCurrent = quantity === tier.quantity;
                  const discountLabel = tier.discountPercent > 0 ? `Save ${tier.discountPercent}%` : 'Base';
                  return (
                    <button
                      key={tier.quantity}
                      type="button"
                      onClick={() => updateQuantity(tier.quantity)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#0082CA]/15 border-[#0082CA] shadow-xs ring-2 ring-[#0082CA]/20'
                          : 'bg-[var(--bg-card)] border-[var(--border)] hover:border-[var(--border-strong)] hover:bg-[var(--bg-subtle)]'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 bg-[#0082CA] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-xs">
                          Popular
                        </span>
                      )}
                      {tier.bestValue && (
                        <span className="absolute -top-2 bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-xs">
                          Best Value
                        </span>
                      )}
                      <span className="text-xs font-bold text-[var(--text-main)]">
                        {tier.quantity >= 1000 ? `${(tier.quantity / 1000).toLocaleString('en-IN')}k pcs` : `${tier.quantity} pcs`}
                      </span>
                      <span className="text-[11px] font-semibold text-[var(--text-muted)] mt-0.5">₹{Number(tier.unitPrice).toFixed(2)}/ea</span>
                      <span className={`text-[11px] font-bold mt-0.5 ${isCurrent ? 'text-[#0082CA]' : 'text-emerald-700'}`}>
                        {discountLabel}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Bulk B2B Notice */}
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0082CA]/10 border border-[#0082CA]/20 text-xs">
                <div className="text-[var(--text-main)]">
                  <span className="font-bold text-[var(--text-main)]">Need 5,000+ units?</span> Custom enterprise volume pricing available.
                </div>
                <Link
                  href="/bulk-enquiry"
                  className="text-[#0082CA] font-bold hover:underline inline-flex items-center gap-1 shrink-0 ml-2"
                >
                  Get a Quote &rarr;
                </Link>
              </div>

              {/* Quantity dropdown fallback */}
              <div className="relative pt-1" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsOpen(!isOpen)}
                  className="w-full bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-md px-3 py-2 flex items-center justify-between focus:outline-hidden focus:border-[#0082CA] cursor-pointer text-sm font-semibold text-[var(--text-main)]"
                >
                  <span>Selected Quantity: {quantity.toLocaleString('en-IN')} units (₹{(priceResult?.finalUnitPrice || priceResult?.unitPrice || 2.0).toFixed(2)} / unit)</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${isOpen ? 'rotate-180' : ''}`} strokeWidth={2} />
                </button>
                
                {isOpen && (
                  <div className="absolute z-10 w-full mt-1.5 bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-md shadow-lg max-h-[250px] overflow-y-auto py-1 custom-scrollbar">
                    {standardQuantities.map((q) => {
                      const isSelected = quantity === q;
                      return (
                        <div
                          key={q}
                          onClick={() => {
                            updateQuantity(q);
                            setIsOpen(false);
                          }}
                          className={`px-3 py-2 cursor-pointer flex items-center justify-between text-sm font-medium mx-1.5 my-0.5 rounded-md transition-colors ${
                            isSelected 
                              ? 'bg-[#0082CA]/15 text-[#0082CA] font-bold border border-[#0082CA]/30' 
                              : 'text-[var(--text-main)] hover:bg-[var(--hover)] border border-transparent'
                          }`}
                        >
                          <span>{q.toLocaleString('en-IN')} units</span>
                          <span className="text-xs text-[var(--text-muted)]">₹{getDisplayUnitPrice(q)} / unit</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Trust Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 px-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[11px] font-semibold text-[var(--text-main)]">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#0082CA] shrink-0" />
              <span>Free Design Help</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>100% QC Checked</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#0082CA] shrink-0" />
              <span>GST Tax Invoice</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Bulk Discounts</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-4 border-t border-[var(--border)]">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[#0082CA] hover:bg-[#0068A2] text-white font-bold text-[15px] py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
            >
              Browse Ready Templates <Image className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-[var(--bg-card)] hover:bg-[var(--bg-subtle)] border border-[var(--border-strong)] text-[var(--text-main)] font-bold text-[15px] py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              Upload Your Own Design <CloudUpload className="w-5 h-5 text-[#0082CA]" />
            </button>
          </div>

          {/* Print Accordions (Specs, Paper Guide, Artwork Guidelines, FAQ) */}
          <div id="product-specs-accordion" className="border border-[var(--border)] rounded-xl divide-y divide-[var(--border)] bg-[var(--bg-card)] overflow-hidden mt-6 scroll-mt-24">
            
            {/* 1. Specs Table Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'specs' ? null : 'specs')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Package className="w-4 h-4 text-[#0082CA]" />
                  <span>Technical Specifications &amp; Sizing</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openSection === 'specs' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'specs' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)]">
                  <table className="w-full text-left border-collapse">
                    <tbody>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-2 font-semibold text-[var(--text-main)] w-1/3">Standard Size</td>
                        <td className="py-2 text-[var(--text-muted)]">89 × 51 mm (3.5 × 2.0 inches)</td>
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-2 font-semibold text-[var(--text-main)]">Paper Stock</td>
                        <td className="py-2 text-[var(--text-muted)]">300 GSM / 350 GSM Premium Artboard</td>
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-2 font-semibold text-[var(--text-main)]">Print Quality</td>
                        <td className="py-2 text-[var(--text-muted)]">300+ DPI High Definition Offset / Digital</td>
                      </tr>
                      <tr className="border-b border-[var(--border)]">
                        <td className="py-2 font-semibold text-[var(--text-main)]">Bleed / Safe Margin</td>
                        <td className="py-2 text-[var(--text-muted)]">3 mm Bleed, 3 mm Safe Cutting Margin</td>
                      </tr>
                      <tr>
                        <td className="py-2 font-semibold text-[var(--text-main)]">Dispatch Turnaround</td>
                        <td className="py-2 text-[var(--text-muted)]">Standard 24-48 hrs, Same-Day available</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 2. Paper & Finish Guide Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'paper' ? null : 'paper')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Layers className="w-4 h-4 text-[#0082CA]" />
                  <span>Paper Quality &amp; Finish Guide</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openSection === 'paper' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'paper' && (
                <div className="px-4 pb-4 pt-1 space-y-2.5 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)]">
                  <div className="p-2.5 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <strong className="text-[var(--text-main)] font-bold block mb-0.5">350 GSM Matte Lamination</strong>
                    <span>Silky, glare-free finish that resists fingerprints and creates an understated, executive look.</span>
                  </div>
                  <div className="p-2.5 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <strong className="text-[var(--text-main)] font-bold block mb-0.5">350 GSM High-Gloss UV</strong>
                    <span>Ultra-shiny reflective coating that enhances contrast and makes bright brand colors pop vividly.</span>
                  </div>
                  <div className="p-2.5 bg-[var(--bg-card)] rounded-lg border border-[var(--border)]">
                    <strong className="text-[var(--text-main)] font-bold block mb-0.5">Spot UV Accent Coat</strong>
                    <span>Tactile raised gloss varnish placed precisely over logos and names against a smooth velvety base.</span>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Artwork Guidelines Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'artwork' ? null : 'artwork')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-[#0082CA]" />
                  <span>Artwork Guidelines &amp; Bleed Safe Zone</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openSection === 'artwork' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'artwork' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] space-y-2">
                  <p>Follow these print specifications to ensure flawless manufacturing:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li><strong>Resolution:</strong> Minimum 300 DPI for crisp vector logos and sharp typography.</li>
                    <li><strong>Color Mode:</strong> CMYK color space (RGB will be converted before press).</li>
                    <li><strong>Bleed Area:</strong> 3mm on all edges to prevent white edges during high-speed guillotine cutting.</li>
                    <li><strong>Safe Area:</strong> Keep all critical text, contact numbers, and QR codes at least 3mm away from the edge.</li>
                    <li><strong>Supported Formats:</strong> Print-ready PDF (preferred), AI, PSD, EPS, or high-res PNG.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* 4. FAQ Accordion */}
            <div>
              <button
                type="button"
                onClick={() => setOpenSection(openSection === 'faq' ? null : 'faq')}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left font-bold text-sm text-[var(--text-main)] hover:bg-[var(--bg-subtle)] transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#0082CA]" />
                  <span>Frequently Asked Questions</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${openSection === 'faq' ? 'rotate-180' : ''}`} />
              </button>
              {openSection === 'faq' && (
                <div className="px-4 pb-4 pt-1 text-xs text-[var(--text-muted)] bg-[var(--bg-subtle)] space-y-2.5">
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">Can I review a proof before printing?</strong>
                    <span>Yes! Our automated preflight tool validates your artwork resolution and safe zones immediately, and sends a digital proof for confirmation.</span>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">Do you provide GST tax invoices?</strong>
                    <span>Absolutely. Enter your company GSTIN during checkout to receive an automatic B2B tax invoice with input credit eligible.</span>
                  </div>
                  <div>
                    <strong className="text-[var(--text-main)] block mb-0.5">Can I reorder cards with updated details easily?</strong>
                    <span>Yes, your previous orders and design files are saved in your account dashboard for 1-click reordering at anytime.</span>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* JSON-LD Structured Data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'Product',
                name: product.name,
                description: product.description || product.shortDescription,
                image: (product.images || []).map((img) => (typeof img === 'string' ? img : img.url)),
                brand: {
                  '@type': 'Brand',
                  name: 'Maza Printwala',
                },
                offers: {
                  '@type': 'Offer',
                  priceCurrency: 'INR',
                  price: (priceResult?.totalPrice || product.basePrice || 200).toFixed(2),
                  availability: 'https://schema.org/InStock',
                  seller: {
                    '@type': 'Organization',
                    name: 'Maza Printwala',
                  },
                },
                aggregateRating: {
                  '@type': 'AggregateRating',
                  ratingValue: '4.8',
                  reviewCount: '1611',
                },
              }),
            }}
          />

        </div>
      </div>

      <PopularTemplates slug={slug} />
      
      <RecentlyViewedProducts />
      
      <ProductReviews productId={product?._id} productName={product?.name} />

    </div>

      {/* Mobile Sticky Buy Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[var(--bg-card)]/95 backdrop-blur-md border-t border-[var(--border)] px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.12)] flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] text-[var(--text-muted)] font-medium truncate">
            Total ({quantity.toLocaleString('en-IN')} units)
          </div>
          <div className="text-lg font-black text-[#0082CA] flex items-baseline gap-1">
            {isCalculating ? (
              <span className="h-5 w-16 bg-[var(--border)] rounded animate-pulse inline-block" />
            ) : (
              <>
                <span>₹{(priceResult?.totalPrice || product?.basePrice || 200).toFixed(2)}</span>
                <span className="text-[10px] text-[var(--text-faint)] font-normal">incl. GST</span>
              </>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="shrink-0 bg-[#0082CA] hover:bg-[#0068A2] active:scale-95 text-white font-bold text-sm py-2.5 px-5 rounded-lg flex items-center justify-center gap-1.5 shadow-md shadow-[#0082CA]/25 transition-all cursor-pointer"
        >
          <span>Select Design</span>
          <ArrowRight className="w-4 h-4" />
        </button>
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


