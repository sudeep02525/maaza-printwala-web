'use client';

import React from 'react';
import { IndianRupee, ShieldCheck, CheckCircle2, ArrowRight, Sparkles, ShoppingBag } from 'lucide-react';
import { useConfiguratorStore } from '../../store/configuratorStore.js';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';

export default function PriceSummaryBox({ onProceedToDesign, onOpenExperienceModal, isReadyForCart, onAddToCart }) {
  const { quantity, setQuantity, priceData, isCalculating } = useConfiguratorStore();

  const handleProceed = onProceedToDesign || onOpenExperienceModal;
  const standardQuantities = [100, 250, 500, 1000, 2500, 5000];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 sticky top-24 select-none font-sans">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-extrabold text-[#0082CA] uppercase tracking-wider block">
            Authoritative Calculation
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">Order Summary &amp; Pricing</h3>
        </div>
        <Badge variant="primary" size="sm">Live Engine</Badge>
      </div>

      {/* 1. Quantity Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Select Order Quantity
          </label>
          <span className="text-xs font-bold text-slate-900">{quantity.toLocaleString('en-IN')} units</span>
        </div>

        {/* Quantity Tiers Grid */}
        <div className="grid grid-cols-3 gap-2">
          {standardQuantities.map((q) => {
            const isSelected = quantity === q;
            return (
              <button
                key={q}
                type="button"
                onClick={() => setQuantity(q)}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#0082CA] text-white border-[#0082CA] shadow-2xs scale-102 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 font-bold'
                }`}
              >
                <span className="text-xs">{q.toLocaleString('en-IN')}</span>
                <span className={`text-[9px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>units</span>
              </button>
            );
          })}
        </div>

        {/* Custom Quantity Input */}
        <div className="pt-1 flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500 whitespace-nowrap">Or custom qty:</span>
          <input
            type="number"
            min={10}
            max={50000}
            step={50}
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 100))}
            className="w-full px-3 py-1.5 bg-[#F7F8FA] border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#0082CA] focus:border-[#0082CA]"
          />
        </div>
      </div>

      {/* 2. Price Breakdown Box (Clean Commercial Neutral) */}
      <div className="bg-[#F7F8FA] text-slate-800 p-5 rounded-2xl space-y-4 border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <span className="font-semibold">Authoritative Unit Rate:</span>
          <span className="font-bold text-slate-900">
            {isCalculating ? '...' : `₹${priceData?.unitPrice || 0} / unit`}
          </span>
        </div>

        <div className="flex items-baseline justify-between pt-2.5 border-t border-slate-200">
          <div>
            <span className="text-xs font-bold text-slate-900 block">Total Estimated Price</span>
            <span className="text-[10px] font-medium text-slate-500">Excludes GST &amp; shipping</span>
          </div>
          <div className="text-right">
            {isCalculating ? (
              <div className="w-24 h-8 bg-slate-200 rounded animate-pulse inline-block"></div>
            ) : (
              <div className="flex items-center justify-end text-2xl font-black text-[#0082CA]">
                <IndianRupee className="w-5 h-5 -mr-0.5" />
                <span>{(priceData?.totalPrice || 0).toLocaleString('en-IN')}</span>
              </div>
            )}
          </div>
        </div>

        {priceData?.discountPercentage > 0 && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-bold px-3 py-2 rounded-xl flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Volume Savings Applied:
            </span>
            <span>{priceData.discountPercentage}% OFF</span>
          </div>
        )}
      </div>

      {/* 3. CTA Actions */}
      <div className="space-y-3 pt-2">
        {!isReadyForCart ? (
          <Button
            variant="primary"
            size="lg"
            className="w-full shadow-sm text-sm py-4 group"
            onClick={handleProceed}
            disabled={isCalculating}
          >
            <span>Proceed to Design Options</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-sm text-sm py-4 group"
            onClick={onAddToCart || handleProceed}
            disabled={isCalculating}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Review &amp; Add to Cart</span>
          </Button>
        )}

        <p className="text-[11px] text-slate-500 text-center font-normal">
          Next step: Choose whether to upload your print file or customize a template.
        </p>
      </div>

      {/* 4. Trust Assurance */}
      <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Server-verified quantity price breaks</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-[#0082CA] shrink-0" />
          <span>Standard staff review before production press</span>
        </div>
      </div>
    </div>
  );
}
