'use client';

import React, { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function AddressSection({ initialData, contactData, onSubmit, isLoading, onBack }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || contactData?.fullName || '',
    phone: initialData?.phone || contactData?.phone || '',
    streetAddress: initialData?.streetAddress || '',
    addressLine2: initialData?.addressLine2 || '',
    landmark: initialData?.landmark || '',
    city: initialData?.city || '',
    state: initialData?.state || '',
    pinCode: initialData?.pinCode || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Receiver Full Name is required.';
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      errs.phone = 'Valid 10-digit Indian mobile number is required.';
    }
    if (!formData.streetAddress.trim()) errs.streetAddress = 'Street address / Flat / Building is required.';
    if (!formData.city.trim()) errs.city = 'City is required.';
    if (!formData.state.trim()) errs.state = 'State is required.';
    if (!formData.pinCode.trim() || !/^[1-9][0-9]{5}$/.test(formData.pinCode)) {
      errs.pinCode = 'Valid 6-digit Indian PIN code is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <Card className="p-6 sm:p-8 border-slate-200 select-none">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-black text-slate-900">2. Indian Delivery Address</h2>
        <Badge variant="primary" size="sm">Step 2 of 5</Badge>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
        Enter the physical address where your print order should be delivered across India.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Receiver Name *</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
              }`}
            />
            {errors.fullName && <p className="text-xs font-semibold text-red-600 mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Receiver Mobile *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 rounded-l-lg border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-sm font-bold">
                +91
              </span>
              <input
                type="text"
                maxLength="10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="9876543210"
                className={`w-full px-4 py-3 rounded-r-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                  errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs font-semibold text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Flat, House no., Building, Company, Apartment *</label>
          <input
            type="text"
            value={formData.streetAddress}
            onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
            placeholder="e.g. Flat 101, Print Towers, MG Road"
            className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
              errors.streetAddress ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
            }`}
          />
          {errors.streetAddress && <p className="text-xs font-semibold text-red-600 mt-1">{errors.streetAddress}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Area, Street, Sector, Village (Optional)</label>
            <input
              type="text"
              value={formData.addressLine2}
              onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
              placeholder="e.g. Near HDFC Bank, Andheri West"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#0082CA] focus:ring-2 focus:ring-[#0082CA]/20 focus:outline-none transition-all text-sm font-semibold text-slate-900 bg-white"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Landmark (Optional)</label>
            <input
              type="text"
              value={formData.landmark}
              onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
              placeholder="e.g. Behind Metro Station"
              className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-[#0082CA] focus:ring-2 focus:ring-[#0082CA]/20 focus:outline-none transition-all text-sm font-semibold text-slate-900 bg-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">PIN Code (6 digits) *</label>
            <input
              type="text"
              maxLength="6"
              value={formData.pinCode}
              onChange={(e) => setFormData({ ...formData, pinCode: e.target.value.replace(/\D/g, '') })}
              placeholder="e.g. 400001"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all font-mono text-sm font-bold text-slate-900 ${
                errors.pinCode ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
              }`}
            />
            {errors.pinCode && <p className="text-xs font-semibold text-red-600 mt-1">{errors.pinCode}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">City *</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="e.g. Mumbai"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                errors.city ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
              }`}
            />
            {errors.city && <p className="text-xs font-semibold text-red-600 mt-1">{errors.city}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">State *</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              placeholder="e.g. Maharashtra"
              className={`w-full px-4 py-3 rounded-lg border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                errors.state ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0082CA] focus:ring-[#0082CA]/20'
              }`}
            />
            {errors.state && <p className="text-xs font-semibold text-red-600 mt-1">{errors.state}</p>}
          </div>
        </div>

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
            <span>Continue to Billing & GST</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
