'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldCheck, ShoppingBag, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { useCheckoutStore } from '../../store/checkoutStore.js';
import CheckoutProgress from '../../components/checkout/CheckoutProgress.jsx';
import ContactSection from '../../components/checkout/ContactSection.jsx';
import AddressSection from '../../components/checkout/AddressSection.jsx';
import BillingSection from '../../components/checkout/BillingSection.jsx';
import DeliveryMethodSection from '../../components/checkout/DeliveryMethodSection.jsx';
import CheckoutSummary from '../../components/checkout/CheckoutSummary.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Alert from '../../components/ui/Alert.jsx';

export default function CheckoutPage() {
  const {
    draft,
    deliveryMethods,
    isLoading,
    error,
    currentStep,
    setStep,
    resetError,
    initCheckout,
    fetchDeliveryMethods,
    updateContact,
    updateAddress,
    updateBilling,
    selectDeliveryRule,
    preparePayment,
  } = useCheckoutStore();

  useEffect(() => {
    initCheckout();
  }, [initCheckout]);

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 select-none">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-500">
            <Link href="/" className="hover:text-slate-900 flex items-center gap-1">Home</Link>
            <span>/</span>
            <Link href="/cart" className="hover:text-slate-900">Shopping Cart</Link>
            <span>/</span>
            <span className="text-slate-900 font-extrabold">Order Checkout</span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#0082CA]" />
            <span>Secure Commercial Order Processing</span>
          </div>
        </div>

        {/* Step Indicator */}
        <CheckoutProgress currentStep={currentStep} onStepClick={(step) => setStep(step)} />

        {/* Error Notification Banner */}
        {error && (
          <Alert variant="error" title="Checkout Notice">
            <div className="flex items-center justify-between">
              <span>{error}</span>
              <button onClick={resetError} className="font-bold underline ml-4 cursor-pointer">Dismiss</button>
            </div>
          </Alert>
        )}

        {/* Loading Skeleton */}
        {isLoading && !draft ? (
          <Card className="py-24 text-center space-y-4 border-slate-200">
            <RefreshCw className="w-10 h-10 text-[#0082CA] animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Verifying cart specifications and calculating pricing...</p>
          </Card>
        ) : !draft ? (
          <Card className="p-12 text-center max-w-lg mx-auto space-y-6 border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-[#0082CA]">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-slate-900">Cart Session Expired</h2>
              <p className="text-xs text-slate-500 font-normal leading-relaxed">We could not initialize a checkout session. Your shopping cart may be empty or your session expired.</p>
            </div>
            <Link href="/products">
              <Button variant="primary" size="md">Browse Catalogue</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left/Main Column: Step Content (8 cols) */}
            <div className="lg:col-span-8 space-y-6">
              {currentStep === 1 && (
                <ContactSection
                  initialData={draft.contactDetails}
                  isLoading={isLoading}
                  onSubmit={(data) => updateContact(data)}
                />
              )}

              {currentStep === 2 && (
                <AddressSection
                  initialData={draft.deliveryAddress}
                  contactData={draft.contactDetails}
                  isLoading={isLoading}
                  onSubmit={(data) => updateAddress(data)}
                  onBack={() => setStep(1)}
                />
              )}

              {currentStep === 3 && (
                <BillingSection
                  initialData={draft.billingDetails}
                  deliveryAddress={draft.deliveryAddress}
                  isLoading={isLoading}
                  onSubmit={(data) => updateBilling(data)}
                  onBack={() => setStep(2)}
                />
              )}

              {currentStep === 4 && (
                <DeliveryMethodSection
                  methods={deliveryMethods}
                  selectedRuleId={draft.selectedDeliveryRule}
                  subtotal={draft.authoritativeSubtotal || 0}
                  pinCode={draft.deliveryAddress?.pinCode}
                  isLoading={isLoading}
                  onFetchMethods={(pin) => fetchDeliveryMethods(pin)}
                  onSelect={(ruleId) => selectDeliveryRule(ruleId)}
                  onBack={() => setStep(3)}
                />
              )}

              {currentStep === 5 && (
                <Card className="p-6 sm:p-8 space-y-6 border-slate-200">
                  <div className="border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-900">
                      5. Review Order & Shipping Specifications
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5 font-normal">
                      Please verify your contact details, Indian delivery address, and billing preference before registering your order.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Contact Details</span>
                        <button onClick={() => setStep(1)} className="text-xs text-[#0082CA] font-bold hover:underline cursor-pointer">Edit</button>
                      </div>
                      <p className="text-slate-900 font-bold">{draft.contactDetails?.fullName}</p>
                      <p className="text-slate-600">{draft.contactDetails?.email}</p>
                      <p className="text-slate-600">+91 {draft.contactDetails?.phone}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Delivery Address</span>
                        <button onClick={() => setStep(2)} className="text-xs text-[#0082CA] font-bold hover:underline cursor-pointer">Edit</button>
                      </div>
                      <p className="text-slate-900 font-bold">{draft.deliveryAddress?.fullName}</p>
                      <p className="text-slate-600">{draft.deliveryAddress?.streetAddress}</p>
                      <p className="text-slate-600">{draft.deliveryAddress?.city}, {draft.deliveryAddress?.state} - <span className="font-mono font-bold">{draft.deliveryAddress?.pinCode}</span></p>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Billing & GST</span>
                        <button onClick={() => setStep(3)} className="text-xs text-[#0082CA] font-bold hover:underline cursor-pointer">Edit</button>
                      </div>
                      <p className="text-slate-900 font-bold">{draft.billingDetails?.sameAsDelivery ? 'Same as Delivery Address' : draft.billingDetails?.address?.fullName}</p>
                      {draft.billingDetails?.isBusinessPurchase && (
                        <div className="mt-2 pt-2 border-t border-slate-200/60 text-xs font-mono text-slate-700">
                          <p><span className="font-bold">Company:</span> {draft.billingDetails.companyName}</p>
                          <p><span className="font-bold">GSTIN:</span> {draft.billingDetails.gstin}</p>
                        </div>
                      )}
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200/60">
                        <span className="font-extrabold text-slate-900">Delivery Method</span>
                        <button onClick={() => setStep(4)} className="text-xs text-[#0082CA] font-bold hover:underline cursor-pointer">Edit</button>
                      </div>
                      <p className="text-slate-900 font-bold">{draft.deliveryMethodSnapshot?.name}</p>
                      <p className="text-xs text-slate-500 mt-1 font-normal">Est. timeline: {draft.deliveryMethodSnapshot?.estimatedDaysMin}–{draft.deliveryMethodSnapshot?.estimatedDaysMax} working days</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Right Column: Sticky Order Summary (4 cols) */}
            <div className="lg:col-span-4">
              <CheckoutSummary
                draft={draft}
                isLoading={isLoading}
                currentStep={currentStep}
                onPreparePayment={preparePayment}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
