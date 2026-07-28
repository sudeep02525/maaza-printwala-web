'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, ShieldCheck, ArrowRight, RefreshCw, FileText, LayoutTemplate, Layers, ShoppingBag, AlertCircle } from 'lucide-react';
import { useConfiguratorStore } from '../../store/configuratorStore.js';
import { useCartStore } from '../../store/cartStore.js';
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
    <Card className="p-6 sm:p-8 bg-slate-900 text-white border-slate-800 shadow-xl space-y-8 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md shrink-0">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div>
            <Badge variant="success" size="sm">Ready for Cart</Badge>
            <h2 className="text-xl sm:text-2xl font-black mt-1">Configuration & Design Complete</h2>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={resetConfigurator}
          disabled={isAddingToCart}
          className="bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1" /> Start Over
        </Button>
      </div>

      {/* Grid: Left Config Summary, Right Price Snapshot & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Product & Design Snapshot (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D63384]" />
              <span>Product Specifications ({product.name})</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(configuration).map(([k, v]) => (
                <div key={k} className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">{k}</span>
                  <span className="text-sm font-black text-white capitalize mt-0.5 block truncate" title={String(v)}>{String(v)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/60 p-6 rounded-2xl border border-slate-700/80 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              {designReadyState.type === 'UPLOAD' ? (
                <FileText className="w-4 h-4 text-blue-400" />
              ) : (
                <LayoutTemplate className="w-4 h-4 text-pink-400" />
              )}
              <span>Attached Artwork Experience ({designReadyState.type === 'UPLOAD' ? 'Uploaded Custom Artwork' : 'Customised Template Layout'})</span>
            </h3>
            <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div className="overflow-hidden pr-3">
                <p className="text-xs font-black text-white truncate">
                  {designReadyState.type === 'UPLOAD'
                    ? `File: ${designReadyState.payload.originalName || 'Custom Artwork File'}`
                    : `Template Ref: #${designReadyState.payload.templateId}`}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
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
        <div className="lg:col-span-5 bg-slate-800/80 p-6 sm:p-8 rounded-2xl border border-slate-700 space-y-6">
          <div>
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block">
              Server Authoritative Summary
            </span>
            <h3 className="text-xl font-black text-white mt-1">Order Valuation</h3>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-700">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Order Quantity:</span>
              <span className="font-bold text-white">{quantity.toLocaleString('en-IN')} units</span>
            </div>
            <div className="flex justify-between text-xs text-slate-300">
              <span>Authoritative Unit Rate:</span>
              <span className="font-bold text-white">₹{priceResult?.finalUnitPrice} / unit</span>
            </div>
            <div className="pt-3 border-t border-slate-700 flex items-baseline justify-between">
              <span className="text-xs uppercase font-bold text-slate-400">Total Price</span>
              <span className="text-3xl font-black text-amber-400">
                ₹{priceResult?.totalPrice?.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-blue-300">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Price Protection Guarantee:</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed font-normal">
              When you add to cart, our server independently verifies all specification attributes and calculates final pricing.
            </p>
          </div>

          {cartError && (
            <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-xl text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{cartError}</span>
            </div>
          )}

          {/* Add to Cart CTA */}
          <div className="space-y-2 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-lg text-sm py-4"
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
            <p className="text-[10px] text-center text-slate-400 font-medium">
              * Cart items are saved securely to your session.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
