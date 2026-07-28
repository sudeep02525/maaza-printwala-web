'use client';

import React from 'react';
import { IndianRupee, ShieldCheck, CheckCircle2, ArrowRight, Lock, AlertCircle } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function CheckoutSummary({ draft, isLoading, onPreparePayment, currentStep }) {
  if (!draft) return null;

  const items = draft.itemsSnapshot || [];
  const subtotal = draft.authoritativeSubtotal || 0;
  const deliveryCharge = draft.deliveryCharge || 0;
  const total = draft.finalTotalAmount || subtotal + deliveryCharge;
  const isReady = draft.status === 'READY_FOR_PAYMENT';

  return (
    <Card className="p-6 sm:p-8 space-y-6 sticky top-24 border-slate-200 select-none">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#0A58CA] uppercase tracking-wider block">
            Order Valuation
          </span>
          <h3 className="text-lg font-black text-slate-900 mt-0.5">Order Summary</h3>
        </div>
        <Badge variant="primary" size="sm">Live Server</Badge>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
            <div className="flex-1 pr-3 min-w-0">
              <p className="font-black text-slate-900 truncate">{item.productNameSnapshot || 'Custom Print Item'}</p>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                Qty: <strong className="text-slate-800">{item.quantity}</strong> • Type: <strong className="text-slate-800 uppercase">{item.designType}</strong>
              </p>
              {item.template?.templateName && (
                <p className="text-[11px] text-[#0A58CA] font-semibold truncate mt-0.5">Layout: {item.template.templateName}</p>
              )}
            </div>
            <div className="text-right font-black text-slate-900 shrink-0">
              ₹{Number(item.authoritativeLineTotal || 0).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Banners */}
      {draft.priceChangeWarning && (
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-normal flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Price Valuation Update</p>
            <p className="leading-relaxed">{draft.priceChangeWarning}</p>
          </div>
        </div>
      )}

      {/* Authoritative Totals Breakdown */}
      <div className="space-y-3 py-4 border-t border-b border-slate-100 text-xs sm:text-sm font-semibold">
        <div className="flex justify-between text-slate-600">
          <span>Subtotal Amount</span>
          <span className="font-black text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-slate-600">
          <span className="truncate pr-2">Delivery ({draft.deliveryMethodSnapshot?.name || 'Pending Selection'})</span>
          <span className="font-black text-slate-900 shrink-0">
            {draft.selectedDeliveryRule ? (
              deliveryCharge === 0 ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                `₹${deliveryCharge.toLocaleString('en-IN')}`
              )
            ) : (
              <span className="text-slate-400 font-normal italic">Select method</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs">
          <div>
            <span className="font-bold text-slate-900 block">Applicable Taxes:</span>
            <span className="text-[11px] text-slate-500 font-normal">Standard commercial GST invoiced separately</span>
          </div>
          <span className="font-bold text-slate-600">As per invoice</span>
        </div>
      </div>

      {/* Final Total Display */}
      <div className="py-2">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-base font-black text-slate-900">Total Estimated Payable</span>
          <span className="text-2xl font-black text-[#0A58CA]">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[11px] text-slate-500 font-normal">
          * Final invoice with applicable commercial taxes will be provided upon dispatch.
        </p>
      </div>

      {/* Action Button for Step 5 Review */}
      {currentStep === 5 && !isReady && (
        <div className="pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onPreparePayment}
            disabled={isLoading || !draft.selectedDeliveryRule}
            className="w-full bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600 shadow-lg py-4 text-sm"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            <span>Confirm Order & Register</span>
          </Button>
        </div>
      )}

      {/* Production Payment Readiness Safety Guard (Commercial Messaging Compliance) */}
      {isReady && (
        <div className="mt-6 p-6 rounded-2xl bg-slate-900 text-white space-y-4 border border-slate-800 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-400 font-black text-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Order Successfully Registered</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-normal">
            Your commercial printing specifications, Indian delivery address, and logistics method have been validated and recorded on our production server.
          </p>

          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs space-y-2 font-normal">
            <div className="flex items-center gap-2 text-blue-300 font-bold">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Online Payment Processing Notice</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Online payment gateway processing is temporarily undergoing scheduled banking integration. Your order has been securely captured in our system. A commercial representative will reach out shortly with customized billing instructions and dispatch scheduling.
            </p>
          </div>

          <div className="pt-2">
            <button
              disabled
              className="w-full py-3.5 bg-slate-800 text-emerald-400 font-bold rounded-xl text-xs cursor-not-allowed border border-emerald-500/30 flex items-center justify-center gap-2 shadow-inner"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Order Captured - Payment Pending Offline</span>
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
