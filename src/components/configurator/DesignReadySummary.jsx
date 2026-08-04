'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, FileText, LayoutTemplate, Layers, ShoppingBag, AlertCircle } from 'lucide-react';
import { useConfiguratorStore } from '@/store/configuratorStore.js';
import { useCartStore } from '@/store/cartStore.js';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function DesignReadySummary({ product }) {
  const router = useRouter();
  const { configuration, quantity, priceResult, designReadyState, resetConfigurator } = useConfiguratorStore();
  const { addItemToCart } = useCartStore();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartError, setCartError] = useState(null);

  if (!designReadyState) return null;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    setCartError(null);

    const payload = {
      productId: product._id,
      configuration,
      quantity,
      dimensions:
        configuration.width && configuration.height
          ? { width: Number(configuration.width), height: Number(configuration.height), unit: 'ft' }
          : undefined,
      designType: designReadyState.type,
      artwork:
        designReadyState.type === 'UPLOAD'
          ? {
              fileId: designReadyState.payload.artwork?.fileId || designReadyState.payload.fileId,
              originalName: designReadyState.payload.originalName || designReadyState.payload.artwork?.originalName,
            }
          : undefined,
      template:
        designReadyState.type === 'TEMPLATE'
          ? {
              templateId: designReadyState.payload.templateId,
              customFields: designReadyState.payload.customFields,
            }
          : undefined,
    };

    const res = await addItemToCart(payload);
    if (res.success) {
      router.push('/cart');
    } else {
      setCartError(res.error || 'Failed to add item to cart.');
      setIsAddingToCart(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 bg-white text-slate-900 border-slate-200 shadow-md space-y-8 select-none font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <Badge variant="success" size="sm">Ready for Cart</Badge>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">Configuration &amp; Design Complete</h2>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetConfigurator}
          disabled={isAddingToCart}
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-300"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Start Over
        </Button>
      </div>

      {/* Grid: Left Config Summary, Right Price Snapshot & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product & Design Snapshot (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#F7F8FA] p-6 rounded-lg border border-slate-200 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#0082CA]" />
              <span>Product Specifications ({product.name})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(configuration).map(([k, v]) => (
                <div key={k} className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{k}</span>
                  <span className="text-sm font-black text-slate-900 capitalize mt-0.5 block truncate" title={String(v)}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F7F8FA] p-6 rounded-lg border border-slate-200 space-y-4 shadow-2xs">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              {designReadyState.type === 'UPLOAD' ? (
                <FileText className="w-4 h-4 text-[#0082CA]" />
              ) : (
                <LayoutTemplate className="w-4 h-4 text-[#C71578]" />
              )}
              <span>Attached Artwork Experience ({designReadyState.type === 'UPLOAD' ? 'Uploaded Custom Artwork' : 'Customised Template Layout'})</span>
            </h3>
            <div className="bg-white p-4 rounded-lg border border-slate-200 flex items-center justify-between shadow-2xs">
              <div className="overflow-hidden pr-3">
                <p className="text-xs font-black text-slate-900 truncate">
                  {designReadyState.type === 'UPLOAD'
                    ? `File: ${designReadyState.payload.originalName || 'Custom Artwork File'}`
                    : `Template Ref: #${designReadyState.payload.templateId}`}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 truncate font-medium">
                  {designReadyState.type === 'UPLOAD'
                    ? `Ref ID: ${designReadyState.payload.artwork?.fileId || designReadyState.payload.fileId}`
                    : `${Object.keys(designReadyState.payload.customFields || {}).length} personalized text fields`}
                </p>
              </div>
              <Badge variant="success" size="sm">Verified</Badge>
            </div>
          </div>
        </div>

        {/* Right: Authoritative Price Snapshot & CTA Button (5 cols) */}
        <div className="lg:col-span-5 bg-[#F7F8FA] p-6 sm:p-8 rounded-lg border border-slate-200 space-y-6 shadow-2xs">
          <div>
            <span className="text-[10px] font-bold text-[#0082CA] uppercase tracking-widest block">
              Server Authoritative Summary
            </span>
            <h3 className="text-xl font-black text-slate-900 mt-1">Order Valuation</h3>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-200">
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Order Quantity:</span>
              <span className="font-bold text-slate-900">{quantity.toLocaleString('en-IN')} units</span>
            </div>
            <div className="flex justify-between text-xs text-slate-600 font-medium">
              <span>Authoritative Unit Rate:</span>
              <span className="font-bold text-slate-900">₹{priceResult?.finalUnitPrice} / unit</span>
            </div>
            <div className="pt-3 border-t border-slate-200 flex items-baseline justify-between">
              <span className="text-xs uppercase font-bold text-slate-500">Total Price</span>
              <span className="text-3xl font-black text-[#0082CA]">
                ₹{priceResult?.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs space-y-1 shadow-2xs">
            <div className="flex items-center gap-1.5 font-bold text-[#0082CA]">
              <ShieldCheck className="w-4 h-4 text-[#0082CA] shrink-0" />
              <span>Price Protection Guarantee:</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
              When you add to cart, our server independently verifies all specification attributes and calculates final pricing.
            </p>
          </div>

          {cartError && (
            <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span className="font-semibold">{cartError}</span>
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-sm text-sm py-4"
            >
              {isAddingToCart ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying with Server...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Shopping Cart</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
            <p className="text-[10px] text-center text-slate-500 font-medium">
              * Cart items are saved securely to your session.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
