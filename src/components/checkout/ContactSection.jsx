'use client';

import React, { useState } from 'react';
import Button from '../ui/Button.jsx';
import Card from '../ui/Card.jsx';
import Badge from '../ui/Badge.jsx';

export default function ContactSection({ initialData, onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) errs.fullName = 'Full Name is required.';
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Valid email address is required.';
    }
    if (!formData.phone.trim() || !/^[6-9]\d{9}$/.test(formData.phone)) {
      errs.phone = 'Valid 10-digit Indian mobile number is required.';
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
        <h2 className="text-xl font-black text-slate-900">1. Contact Information</h2>
        <Badge variant="primary" size="sm">Step 1 of 5</Badge>
      </div>
      <p className="text-xs sm:text-sm text-slate-600 mb-6 font-normal">
        We will send order confirmation, production updates, and commercial invoice details to this email and phone number.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name *</label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="e.g. Rahul Sharma"
            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
              errors.fullName ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0A58CA] focus:ring-[#0A58CA]/20'
            }`}
          />
          {errors.fullName && <p className="text-xs font-semibold text-red-600 mt-1">{errors.fullName}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="rahul@example.com"
              className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                errors.email ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0A58CA] focus:ring-[#0A58CA]/20'
              }`}
            />
            {errors.email && <p className="text-xs font-semibold text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mobile Number (10 digits) *</label>
            <div className="flex">
              <span className="inline-flex items-center px-3.5 rounded-l-xl border border-r-0 border-slate-300 bg-slate-100 text-slate-700 text-sm font-bold">
                +91
              </span>
              <input
                type="text"
                maxLength="10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                placeholder="9876543210"
                className={`w-full px-4 py-3 rounded-r-xl border bg-white focus:ring-2 focus:outline-none transition-all text-sm font-semibold text-slate-900 ${
                  errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-slate-300 focus:border-[#0A58CA] focus:ring-[#0A58CA]/20'
                }`}
              />
            </div>
            {errors.phone && <p className="text-xs font-semibold text-red-600 mt-1">{errors.phone}</p>}
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isLoading}
          >
            <span>Continue to Delivery Address</span>
          </Button>
        </div>
      </form>
    </Card>
  );
}
