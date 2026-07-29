'use client';

import { useState, useEffect, Suspense, use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ChevronRight, Home, ShieldCheck, Truck, HelpCircle, FileText, CheckCircle2, Package } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 select-none">
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Col: Product Gallery & Highlights (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div className="border-b border-slate-200 pb-6">
            <span className="inline-block px-3 py-1 rounded-md text-xs font-black bg-blue-50 text-[#0082CA] uppercase tracking-wider mb-3 border border-blue-200">
              {product.category?.name || 'Commercial Press'}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">{product.name}</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed font-normal">{product.description}</p>
          </div>

          <ProductGallery product={product} />

          {/* Delivery & Architecture Placeholders (Strict Neutral Compliance) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs">
              <Truck className="w-5 h-5 text-[#0082CA] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Standard Dispatch</h4>
                <p className="text-xs text-slate-600 mt-0.5 font-normal leading-relaxed">
                  Careful packaging and logistics support across major commercial destinations in India.
                </p>
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Staff Artwork Review</h4>
                <p className="text-xs text-slate-600 mt-0.5 font-normal leading-relaxed">
                  Submitted files are checked by our staff for basic bleed and safe-zone alignment before press.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Schema Configurator & Price Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <SchemaConfigurator schema={schema} isLoading={schemaLoading} />
          <PriceSummaryBox
            onProceedToDesign={() => setIsModalOpen(true)}
            isReadyForCart={!!designReadyState}
          />
        </div>
      </div>

      {/* 4. Below-the-Fold: Product Info, Guidelines & FAQ */}
      <div className="pt-12 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0082CA]" />
            <span>Print Specifications</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Our custom print items are manufactured using professional commercial printing equipment. All paper stocks and materials are selected for consistent business application.
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside font-semibold pt-1">
            <li>High-resolution digital and offset reproduction</li>
            <li>Precision cutting and standard edge finishing</li>
            <li>Configurable materials via schema options</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Artwork Requirements for This Product</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            To ensure your print results match your expectations without clipping important text, please review the specific artwork requirements for this product:
          </p>
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 font-normal text-slate-700 shadow-xs">
            {schema?.artworkRequirements || product?.artworkRequirements ? (
              <div className="space-y-1 font-semibold">
                {String(schema?.artworkRequirements || product?.artworkRequirements)}
              </div>
            ) : (
              <>
                <p>• Accepted Formats: <strong className="text-slate-900">PDF, AI, PSD, PNG, JPG</strong></p>
                <p>• Color Profile: <strong className="text-slate-900">CMYK / RGB standard</strong></p>
                <p>• Margin Safety: <strong className="text-slate-900">Keep text inside safe zone</strong></p>
                <p className="pt-1 text-[11px] text-slate-500 italic">
                  * Please review specific product instructions before submitting graphic artwork.
                </p>
              </>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-[#C71578]" />
            <span>Frequently Asked Questions</span>
          </h3>
          <div className="space-y-2.5">
            <details className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs group cursor-pointer shadow-xs">
              <summary className="font-bold text-slate-900 flex items-center justify-between">
                Can I order a custom quantity not listed?
              </summary>
              <p className="text-slate-600 mt-2 font-normal leading-relaxed">
                Yes! For high-volume enterprise requirements exceeding 5,000 units, please contact our commercial support team for dedicated volume pricing.
              </p>
            </details>
            <details className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs group cursor-pointer shadow-xs">
              <summary className="font-bold text-slate-900 flex items-center justify-between">
                What happens if my artwork has a formatting issue?
              </summary>
              <p className="text-slate-600 mt-2 font-normal leading-relaxed">
                Our staff checks submitted files before press. If an issue with resolution or dimensions is identified, we will reach out to confirm before printing.
              </p>
            </details>
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
