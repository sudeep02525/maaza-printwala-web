'use client';

import React, { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function BillingSection({ initialData, deliveryAddress, onSubmit, isLoading, onBack }) {
  const [sameAsDelivery, setSameAsDelivery] = useState(initialData?.sameAsDelivery !== false);
  const [isBusinessPurchase, setIsBusinessPurchase] = useState(initialData?.isBusinessPurchase === true);
  const [companyName, setCompanyName] = useState(initialData?.companyName || '');
  const [gstin, setGstin] = useState(initialData?.gstin || '');
  const [purchaseOrderNumber, setPurchaseOrderNumber] = useState(initialData?.purchaseOrderNumber || '');

  const [billingAddr, setBillingAddr] = useState({
    fullName: initialData?.address?.fullName || deliveryAddress?.fullName || '',
    phone: initialData?.address?.phone || deliveryAddress?.phone || '',
    streetAddress: initialData?.address?.streetAddress || deliveryAddress?.streetAddress || '',
    addressLine2: initialData?.address?.addressLine2 || deliveryAddress?.addressLine2 || '',
    landmark: initialData?.address?.landmark || deliveryAddress?.landmark || '',
    city: initialData?.address?.city || deliveryAddress?.city || '',
    state: initialData?.address?.state || deliveryAddress?.state || '',
    pinCode: initialData?.address?.pinCode || deliveryAddress?.pinCode || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (isBusinessPurchase) {
      if (!companyName.trim()) errs.companyName = 'Company / Registered Legal Name is required for business purchase.';
      if (!gstin.trim()) {
        errs.gstin = 'GSTIN is required to claim Input Tax Credit.';
      } else {
        const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        if (!gstinRegex.test(gstin.trim().toUpperCase())) {
          errs.gstin = 'Invalid Indian GSTIN format (e.g. 27AAAAA0000A1Z5).';
        }
      }
    }

    if (!sameAsDelivery) {
      if (!billingAddr.fullName.trim()) errs.billingFullName = 'Billing Name is required.';
      if (!billingAddr.streetAddress.trim()) errs.billingStreet = 'Billing Street Address is required.';
      if (!billingAddr.city.trim()) errs.billingCity = 'Billing City is required.';
      if (!billingAddr.state.trim()) errs.billingState = 'Billing State is required.';
      if (!billingAddr.pinCode.trim() || !/^[1-9][0-9]{5}$/.test(billingAddr.pinCode)) {
        errs.billingPin = 'Valid 6-digit Indian PIN code is required.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        sameAsDelivery,
        address: sameAsDelivery ? deliveryAddress : billingAddr,
        isBusinessPurchase,
        companyName: isBusinessPurchase ? companyName.trim() : undefined,
        gstin: isBusinessPurchase ? gstin.trim().toUpperCase() : undefined,
        purchaseOrderNumber: isBusinessPurchase && purchaseOrderNumber.trim() ? purchaseOrderNumber.trim() : undefined,
      });
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-slate-200 select-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-slate-900">3. Billing & GST Details</h2>
        <Badge variant="primary" size="sm">Step 3 of 5</Badge>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
        Configure billing address and optional GSTIN for commercial tax invoice generation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Business Purchase / GST Toggle */}
        <div className="bg-slate-50 rounded-lg p-5 border border-slate-200">
          <label className="flex items-start space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isBusinessPurchase}
              onChange={(e) => setIsBusinessPurchase(e.target.checked)}
              className="mt-1 w-5 h-5 text-[#0082CA] rounded border-slate-300 focus:ring-[#0082CA]"
            />
            <div>
              <span className="text-base font-bold text-slate-900">I am buying for my business (Claim GST Input Tax Credit)</span>
              <p className="text-xs text-slate-600 mt-0.5 font-normal">
                Enter your company GSTIN to receive a commercial B2B tax invoice.
              </p>
            </div>
          </label>

          {isBusinessPurchase && (
            <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Company / Legal Entity Name *</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Maaza Enterprises Pvt Ltd"
                  className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                    errors.companyName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
                  }`}
                />
                {errors.companyName && <p className="text-xs font-semibold text-red-600 mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">15-Digit GSTIN *</label>
                <input
                  type="text"
                  maxLength="15"
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  placeholder="e.g. 27AAAAA0000A1Z5"
                  className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all font-mono uppercase text-sm font-bold text-slate-900 ${
                    errors.gstin ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
                  }`}
                />
                {errors.gstin && <p className="text-xs font-semibold text-red-600 mt-1">{errors.gstin}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Purchase Order (PO) Number (Optional)</label>
                <input
                  type="text"
                  value={purchaseOrderNumber}
                  onChange={(e) => setPurchaseOrderNumber(e.target.value)}
                  placeholder="e.g. PO-2026-8891"
                  className="w-full px-4 py-3 rounded-lg border bg-white border-slate-300 focus:border-[#0082CA] focus:ring-2 focus:ring-[#0082CA]/20 focus:outline-none transition-all text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
          )}
        </div>

        {/* Same as delivery address toggle */}
        <div className="pt-2">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={sameAsDelivery}
              onChange={(e) => setSameAsDelivery(e.target.checked)}
              className="w-5 h-5 text-[#0082CA] rounded border-slate-300 focus:ring-[#0082CA]"
            />
            <span className="text-sm font-bold text-slate-800">My billing address is the same as my delivery address</span>
          </label>
        </div>

        {/* Separate billing address fields */}
        {!sameAsDelivery && (
          <div className="p-5 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Separate Billing Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Billing Name *</label>
                <input
                  type="text"
                  value={billingAddr.fullName}
                  onChange={(e) => setBillingAddr({ ...billingAddr, fullName: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none text-sm font-semibold text-slate-900 ${
                    errors.billingFullName ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.billingFullName && <p className="text-xs font-semibold text-red-600 mt-1">{errors.billingFullName}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Billing Mobile</label>
                <input
                  type="text"
                  maxLength="10"
                  value={billingAddr.phone}
                  onChange={(e) => setBillingAddr({ ...billingAddr, phone: e.target.value.replace(/\D/g, '') })}
                  className="w-full px-4 py-3 rounded-lg border bg-white border-slate-300 text-sm font-semibold text-slate-900"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Street Address *</label>
              <input
                type="text"
                value={billingAddr.streetAddress}
                onChange={(e) => setBillingAddr({ ...billingAddr, streetAddress: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border bg-white text-sm font-semibold text-slate-900 ${
                  errors.billingStreet ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.billingStreet && <p className="text-xs font-semibold text-red-600 mt-1">{errors.billingStreet}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Code *</label>
                <input
                  type="text"
                  maxLength="6"
                  value={billingAddr.pinCode}
                  onChange={(e) => setBillingAddr({ ...billingAddr, pinCode: e.target.value.replace(/\D/g, '') })}
                  className={`w-full px-4 py-3 rounded-lg border bg-white font-mono text-sm font-bold text-slate-900 ${
                    errors.billingPin ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.billingPin && <p className="text-xs font-semibold text-red-600 mt-1">{errors.billingPin}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City *</label>
                <input
                  type="text"
                  value={billingAddr.city}
                  onChange={(e) => setBillingAddr({ ...billingAddr, city: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-sm font-semibold text-slate-900 ${
                    errors.billingCity ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.billingCity && <p className="text-xs font-semibold text-red-600 mt-1">{errors.billingCity}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State *</label>
                <input
                  type="text"
                  value={billingAddr.state}
                  onChange={(e) => setBillingAddr({ ...billingAddr, state: e.target.value })}
                  className={`w-full px-4 py-3 rounded-lg border bg-white text-sm font-semibold text-slate-900 ${
                    errors.billingState ? 'border-red-500' : 'border-slate-300'
                  }`}
                />
                {errors.billingState && <p className="text-xs font-semibold text-red-600 mt-1">{errors.billingState}</p>}
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 flex items-center justify-between border-t border-slate-100 mt-6">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
          >
            <span>Continue to Delivery Method</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
