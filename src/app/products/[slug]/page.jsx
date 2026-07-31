'use client';

import { useState, useEffect, Suspense, use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Home, ShieldCheck, Truck, HelpCircle, FileText, CheckCircle2, Package, MapPin, Star, AlertCircle, RotateCcw } from 'lucide-react';
import axiosInstance from '../../../services/axiosInstance.js';
import { useConfiguratorStore } from '../../../store/configuratorStore.js';
import ProductGallery from '../../../components/configurator/ProductGallery.jsx';
import SchemaConfigurator from '../../../components/configurator/SchemaConfigurator.jsx';
import PriceSummaryBox from '../../../components/configurator/PriceSummaryBox.jsx';
import DesignExperienceModal from '../../../components/configurator/DesignExperienceModal.jsx';
import DesignReadySummary from '../../../components/configurator/DesignReadySummary.jsx';

function ProductDetailContent({ slug }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { setProductContext, designReadyState } = useConfiguratorStore();

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Product Not Found</h1>
        <p className="text-sm text-slate-500">We couldn&apos;t locate the requested product in our catalogue.</p>
        <Link
          href="/products"
          className="inline-block px-6 py-2.5 bg-[#0082CA] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#0068A2]"
        >
          Return to Catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAFCFF] min-h-screen pb-24 lg:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8 select-none font-sans">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center text-xs font-semibold text-slate-500 space-x-2 overflow-x-auto py-1">
        <Link href="/" className="hover:text-slate-900 flex items-center gap-1 shrink-0">
          <Home className="w-3.5 h-3.5" /> Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <Link href="/products" className="hover:text-slate-900 shrink-0">
          Catalogue
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-400 shrink-0">{product.category?.name || 'Print Item'}</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 font-extrabold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* 2. Design Ready Banner (If configuration & design journey completed) */}
      {designReadyState && (
        <div className="pt-2">
          <DesignReadySummary product={product} />
        </div>
      )}

      {/* 3. Main Product Stage: Gallery + Configurator */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start relative">
        
        {/* LEFT COL: Product Gallery & Highlights (Sticky) */}
        <div className="w-full lg:w-7/12 lg:sticky lg:top-24 space-y-8">
          
          {/* Header */}
          <div className="border-b border-slate-200 pb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-3 py-1 rounded-md text-[10px] font-black bg-blue-50 text-[#0082CA] uppercase tracking-wider border border-blue-200">
                {product.category?.name || 'Commercial Press'}
              </span>
              <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                <Star className="w-4 h-4 fill-amber-500" /> 4.9 <span className="text-slate-400 font-medium text-xs ml-1">(128 Reviews)</span>
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">{product.name}</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-medium">{product.description}</p>
          </div>

          {/* Gallery Component */}
          <div className="bg-white p-2 rounded-[24px] border border-slate-200 shadow-sm">
            <ProductGallery product={product} />
          </div>

          {/* Customer Reviews Summary (Mock) */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm hidden lg:block">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Customer Reviews</h3>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-4 mb-4">
              <div className="text-center">
                <span className="text-4xl font-black text-slate-900 block">4.9</span>
                <div className="flex text-amber-400 my-1 justify-center"><Star className="w-4 h-4 fill-amber-400"/><Star className="w-4 h-4 fill-amber-400"/><Star className="w-4 h-4 fill-amber-400"/><Star className="w-4 h-4 fill-amber-400"/><Star className="w-4 h-4 fill-amber-400"/></div>
                <span className="text-xs text-slate-500 font-bold">128 Ratings</span>
              </div>
              <div className="flex-1 space-y-1">
                {[5,4,3,2,1].map(star => (
                  <div key={star} className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <span>{star}</span><Star className="w-3 h-3 fill-slate-300"/>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-amber-400" style={{width: star===5?'85%':star===4?'10%':'0%'}}></div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">Rahul M.</span>
                  <span className="text-xs text-emerald-600 font-bold flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Verified</span>
                </div>
                <div className="flex text-amber-400"><Star className="w-3 h-3 fill-amber-400"/><Star className="w-3 h-3 fill-amber-400"/><Star className="w-3 h-3 fill-amber-400"/><Star className="w-3 h-3 fill-amber-400"/><Star className="w-3 h-3 fill-amber-400"/></div>
                <p className="text-sm text-slate-600 font-medium">Excellent quality print and very fast delivery. The paper GSM matches exactly what was promised.</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Schema Configurator, Delivery & Price Box */}
        <div className="w-full lg:w-5/12 space-y-6">
          
          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
              <RotateCcw className="w-5 h-5 text-slate-600"/>
              <span className="text-[10px] font-bold text-slate-700 uppercase leading-tight">Free<br/>Reprints</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
              <ShieldCheck className="w-5 h-5 text-slate-600"/>
              <span className="text-[10px] font-bold text-slate-700 uppercase leading-tight">Quality<br/>Checked</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center gap-1">
              <CheckCircle2 className="w-5 h-5 text-slate-600"/>
              <span className="text-[10px] font-bold text-slate-700 uppercase leading-tight">100%<br/>Secure</span>
            </div>
          </div>

          {/* Configurator */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 mb-4">Product Options</h3>
            <SchemaConfigurator schema={schema} isLoading={schemaLoading} />
          </div>

          {/* Delivery Estimator UI */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2 mb-3">
              <Truck className="w-5 h-5 text-[#0082CA]" /> Delivery Estimate
            </h3>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input type="text" placeholder="Enter PIN Code" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:outline-none focus:border-[#0082CA] focus:ring-1 focus:ring-[#0082CA]" />
              </div>
              <button className="bg-slate-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">Check</button>
            </div>
            <div className="mt-3 text-xs font-medium text-slate-500 bg-emerald-50 text-emerald-700 p-3 rounded-xl border border-emerald-100 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Standard delivery to most pin codes takes <strong>3-4 business days</strong> after artwork approval.</p>
            </div>
          </div>

          {/* Price Box */}
          <div className="sticky bottom-0 left-0 right-0 lg:static z-40 bg-white lg:bg-transparent p-4 lg:p-0 border-t border-slate-200 lg:border-t-0 mt-8 lg:mt-0 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
            <PriceSummaryBox
              onProceedToDesign={() => setIsModalOpen(true)}
              isReadyForCart={!!designReadyState}
            />
          </div>
        </div>
      </div>

      {/* 4. Below-the-Fold: Product Info, Guidelines & FAQ */}
      <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <FileText className="w-5 h-5 text-[#0082CA]" />
            <span>Print Specifications</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            Our custom print items are manufactured using professional commercial printing equipment. All paper stocks and materials are selected for consistent business application.
          </p>
          <ul className="text-sm text-slate-700 space-y-2 list-none font-bold pt-1">
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> High-resolution digital and offset reproduction</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Precision cutting and standard edge finishing</li>
            <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5"/> Configurable materials via schema options</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            <span>Artwork Requirements</span>
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">
            To ensure your print results match your expectations without clipping important text, please review the specific artwork requirements for this product:
          </p>
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 text-sm space-y-2 font-medium text-amber-900 shadow-sm">
            {schema?.artworkRequirements || product?.artworkRequirements ? (
              <div className="space-y-1 font-bold">
                {String(schema?.artworkRequirements || product?.artworkRequirements)}
              </div>
            ) : (
              <>
                <p>• Accepted Formats: <strong className="font-bold">PDF, AI, PSD, PNG, JPG</strong></p>
                <p>• Color Profile: <strong className="font-bold">CMYK / RGB standard</strong></p>
                <p>• Margin Safety: <strong className="font-bold">Keep text inside safe zone</strong></p>
                <p className="pt-2 text-xs text-amber-700/80 italic font-bold">
                  * Please review specific product instructions before submitting graphic artwork.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[24px] border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
            <HelpCircle className="w-5 h-5 text-indigo-500" />
            <span>FAQ</span>
          </h3>
          <div className="space-y-3">
            <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm group cursor-pointer shadow-sm">
              <summary className="font-bold text-slate-900 flex items-center justify-between">
                Can I order a custom quantity?
              </summary>
              <p className="text-slate-600 mt-2 font-medium leading-relaxed">
                Yes! For high-volume enterprise requirements exceeding 5,000 units, please contact our commercial support team for dedicated volume pricing.
              </p>
            </details>
            <details className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-sm group cursor-pointer shadow-sm">
              <summary className="font-bold text-slate-900 flex items-center justify-between">
                Formatting issues?
              </summary>
              <p className="text-slate-600 mt-2 font-medium leading-relaxed">
                Our staff checks submitted files before press. If an issue with resolution or dimensions is identified, we will reach out to confirm before printing.
              </p>
            </details>
          </div>
        </div>
      </div>
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
