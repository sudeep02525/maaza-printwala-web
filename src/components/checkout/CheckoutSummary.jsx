'use client';

import React, { useState } from 'react';
import { IndianRupee, ShieldCheck, CheckCircle2, ArrowRight, Lock, AlertCircle, CreditCard, Loader2 } from 'lucide-react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';
import { useCheckoutStore } from '@/store/checkoutStore.js';

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutSummary({ draft, isLoading, onPreparePayment, currentStep }) {
  const { initiateOnlinePayment, verifyOnlinePayment } = useCheckoutStore();
  const [isPayingOnline, setIsPayingOnline] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccessData, setPaymentSuccessData] = useState(null);

  if (!draft) return null;

  const items = draft.itemsSnapshot || [];
  const subtotal = draft.authoritativeSubtotal || 0;
  const deliveryCharge = draft.deliveryCharge || 0;
  const total = draft.finalTotalAmount || subtotal + deliveryCharge;
  const isReady = draft.status === 'READY_FOR_PAYMENT';

  const handleOnlinePayment = async () => {
    setPaymentError(null);
    setIsPayingOnline(true);

    try {
      // 1. Ensure Razorpay SDK is loaded
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load secure Razorpay payment gateway. Please check your network connection.');
      }

      // 2. Initiate Payment Attempt with Backend
      const initResult = await initiateOnlinePayment();
      if (!initResult.success) {
        throw new Error(initResult.error || 'Failed to initialize payment gateway.');
      }

      const { attempt, razorpayOrder, keyId } = initResult.data || {};
      const activeKey = keyId || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      if (!activeKey) {
        throw new Error('Merchant Razorpay Key ID is not configured. Please use offline invoice option.');
      }

      // 3. Configure Razorpay Checkout Options
      const options = {
        key: activeKey,
        amount: razorpayOrder?.amount || Math.round(total * 100),
        currency: razorpayOrder?.currency || 'INR',
        name: 'Maaza Printwala',
        description: `Order #${draft.orderNumber || ''}`,
        image: '/logo-maaza.png',
        order_id: razorpayOrder?.id,
        prefill: {
          name: draft.contactDetails?.fullName || '',
          email: draft.contactDetails?.email || '',
          contact: draft.contactDetails?.phone || '',
        },
        theme: {
          color: '#0082CA',
        },
        handler: async (response) => {
          try {
            const verifyRes = await verifyOnlinePayment({
              attemptId: attempt._id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if (verifyRes.success) {
              setPaymentSuccessData({
                paymentId: response.razorpay_payment_id,
                orderNumber: draft.orderNumber || verifyRes.data?.order?.orderNumber,
                amount: total,
              });
            } else {
              setPaymentError(verifyRes.error || 'Signature verification failed. Please contact support.');
            }
          } catch (vErr) {
            setPaymentError(vErr.message || 'Error confirming payment verification.');
          } finally {
            setIsPayingOnline(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPayingOnline(false);
          },
        },
      };

      const rzpInstance = new window.Razorpay(options);
      rzpInstance.on('payment.failed', (failRes) => {
        setPaymentError(failRes.error?.description || 'Payment transaction failed. Please retry.');
        setIsPayingOnline(false);
      });
      rzpInstance.open();
    } catch (err) {
      setPaymentError(err.message || 'Payment initiation failed.');
      setIsPayingOnline(false);
    }
  };

  return (
    <Card className="p-6 sm:p-8 space-y-6 sticky top-24 border-[var(--border)] select-none">
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
        <div>
          <span className="text-[10px] font-bold text-[#0082CA] uppercase tracking-wider block">
            Order Valuation
          </span>
          <h3 className="text-lg font-black text-[var(--text-main)] mt-0.5">Order Summary</h3>
        </div>
        <Badge variant="primary" size="sm">Live Server</Badge>
      </div>

      {/* Items Breakdown */}
      <div className="space-y-4 max-h-64 overflow-y-auto pr-1 no-scrollbar">
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between items-start text-xs sm:text-sm">
            <div className="flex-1 pr-3 min-w-0">
              <p className="font-black text-[var(--text-main)] truncate">{item.productNameSnapshot || 'Custom Print Item'}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5 font-normal">
                Qty: <strong className="text-[var(--text-main)]">{item.quantity}</strong> • Type: <strong className="text-[var(--text-main)] uppercase">{item.designType}</strong>
              </p>
              {item.template?.templateName && (
                <p className="text-[11px] text-[#0082CA] font-semibold truncate mt-0.5">Layout: {item.template.templateName}</p>
              )}
            </div>
            <div className="text-right font-black text-[var(--text-main)] shrink-0">
              ₹{Number(item.authoritativeLineTotal || 0).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      {/* Warning Banners */}
      {draft.priceChangeWarning && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-normal flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold mb-0.5">Price Valuation Update</p>
            <p className="leading-relaxed">{draft.priceChangeWarning}</p>
          </div>
        </div>
      )}

      {/* Authoritative Totals Breakdown */}
      <div className="space-y-3 py-4 border-t border-b border-[var(--border)] text-xs sm:text-sm font-semibold">
        <div className="flex justify-between text-[var(--text-muted)]">
          <span>Subtotal Amount</span>
          <span className="font-black text-[var(--text-main)]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>

        <div className="flex justify-between text-[var(--text-muted)]">
          <span className="truncate pr-2">Delivery ({draft.deliveryMethodSnapshot?.name || 'Pending Selection'})</span>
          <span className="font-black text-[var(--text-main)] shrink-0">
            {draft.selectedDeliveryRule ? (
              deliveryCharge === 0 ? (
                <span className="text-emerald-600 font-black">FREE</span>
              ) : (
                `₹${deliveryCharge.toLocaleString('en-IN')}`
              )
            ) : (
              <span className="text-[var(--text-faint)] font-normal italic">Select method</span>
            )}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 rounded-lg bg-[var(--bg-subtle)] border border-[var(--border)] text-[var(--text-main)] text-xs">
          <div>
            <span className="font-bold text-[var(--text-main)] block">Applicable Taxes:</span>
            <span className="text-[11px] text-[var(--text-muted)] font-normal">Standard commercial GST invoiced separately</span>
          </div>
          <span className="font-bold text-[var(--text-muted)]">As per invoice</span>
        </div>
      </div>

      {/* Final Total Display */}
      <div className="py-2">
        <div className="flex justify-between items-baseline mb-1">
          <span className="text-base font-black text-[var(--text-main)]">Total Estimated Payable</span>
          <span className="text-2xl font-black text-[#0082CA]">₹{total.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] font-normal">
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

      {/* Payment Success State */}
      {paymentSuccessData && (
        <div className="mt-6 p-6 rounded-xl bg-emerald-50 text-[var(--text-main)] space-y-4 border border-emerald-300 shadow-md animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-2 text-emerald-800 font-black text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Payment Confirmed & Verified!</span>
          </div>
          <p className="text-xs text-[var(--text-muted)] leading-relaxed">
            Your payment has been successfully authorized and reconciled. Order <strong>#{paymentSuccessData.orderNumber}</strong> is now confirmed and queued for commercial print production.
          </p>
          <div className="p-3.5 rounded-lg bg-white border border-emerald-200 text-xs space-y-1.5 font-mono text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Order Number:</span>
              <span className="font-bold">#{paymentSuccessData.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment ID:</span>
              <span className="font-bold text-[11px] truncate max-w-[180px]">{paymentSuccessData.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Amount Paid:</span>
              <span className="font-bold text-emerald-700">₹{paymentSuccessData.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <a
            href="/products"
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {/* Payment Error Banner */}
      {paymentError && !paymentSuccessData && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-bold mb-0.5">Payment Issue</p>
            <p className="leading-relaxed">{paymentError}</p>
          </div>
        </div>
      )}

      {/* Production Payment Options (Online & Offline) */}
      {isReady && !paymentSuccessData && (
        <div className="mt-6 space-y-4">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
            <div className="flex items-center space-x-2 text-emerald-800 font-black text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>Order Registered {draft.orderNumber ? `(#${draft.orderNumber})` : ''}</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Your order is recorded on our production server. Choose how you would like to complete payment:
            </p>
          </div>

          {/* Option 1: Live Online Payment (Razorpay) */}
          <div className="p-4 rounded-xl border-2 border-[#0082CA] bg-[var(--bg-card)] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0082CA]" />
                <span className="text-xs font-black text-[var(--text-main)]">Pay Online Instantly</span>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-sky-100 text-[#0082CA] rounded-full">
                Instant
              </span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Pay securely via UPI (Google Pay, PhonePe, Paytm), Credit/Debit Cards, or NetBanking.
            </p>
            <Button
              variant="primary"
              size="md"
              onClick={handleOnlinePayment}
              disabled={isPayingOnline || isLoading}
              className="w-full bg-[#0082CA] hover:bg-[#006ba8] text-white py-3 text-xs font-bold shadow-md"
            >
              {isPayingOnline ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>Connecting to Gateway...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 mr-1.5" />
                  <span>Pay ₹{total.toLocaleString('en-IN')} via Razorpay</span>
                </>
              )}
            </Button>
            <div className="text-[10px] text-center text-[var(--text-muted)] flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>256-bit SSL Secure Encrypted Checkout</span>
            </div>
          </div>

          {/* Option 2: Offline Invoice & Billing */}
          <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[var(--text-main)]">Pay on Invoice (Offline)</span>
              <span className="text-[10px] text-[var(--text-muted)]">NEFT / RTGS</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
              Order #{draft.orderNumber} is already held in pending payment mode. Our team will email your proforma invoice with bank details.
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
