'use client';

import React, { useState } from 'react';
import { Building2, Phone, Mail, Clock, Send, CheckCircle2, ShieldCheck, Sparkles, Package, Users } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import { Link } from '@/i18n/routing.js';

export default function BulkEnquiryPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    productType: 'Visiting Cards',
    estimatedQuantity: 1000,
    targetDate: '',
    requirements: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await axiosInstance.post('/inquiries/bulk', formData);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0082CA] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" /> B2B &amp; Corporate Printing
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tracking-tight">
            Volume Printing &amp; Custom Bulk Quotes
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            Need 1,000+ units, custom dies, bespoke packaging, or unified branch stationery? Get direct factory rates and dedicated account management.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-[#0082CA] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">Wholesale Tier Rates</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Up to 45% discount on high volume enterprise contracts.</p>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">Complimentary Proofing</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Physical hardcopy or digital press proof before full production run.</p>
            </div>
          </div>

          <div className="bg-[var(--bg-card)] p-5 rounded-xl border border-[var(--border)] shadow-xs flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[var(--text-main)]">24h Turnaround SLA</h3>
              <p className="text-xs text-[var(--text-muted)] mt-1">Dedicated print specialist responds with tailored quotation in 24 hours.</p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-8 sm:p-10 shadow-sm">
          {isSubmitted ? (
            <div className="text-center py-16 space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-[var(--text-main)]">Enquiry Received!</h2>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">
                Thank you, <strong>{formData.name}</strong>. Our enterprise quoting team is reviewing your specifications for <strong>{formData.productType}</strong> and will reach out to <strong>{formData.email}</strong> / <strong>{formData.phone}</strong> with a detailed quote.
              </p>
              <div className="pt-4">
                <Link
                  href="/products"
                  className="px-6 py-3 bg-[#0082CA] text-white rounded-lg text-xs font-bold hover:bg-[#006da8] transition-colors inline-block"
                >
                  Return to Catalogue
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="border-b border-[var(--border)] pb-4">
                <h2 className="text-lg font-black text-[var(--text-main)]">Request a Commercial Print Quote</h2>
                <p className="text-xs text-[var(--text-muted)]">Fill in your specifications and an account manager will prepare a custom quotation.</p>
              </div>

              {errorMsg && (
                <div className="p-3 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg border border-red-200 font-medium">
                  {errorMsg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Vikram Singhania"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Company / Organization</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    placeholder="e.g. Nexus Technologies Pvt Ltd"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="vikram@nexus.com"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Contact Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Product Category *</label>
                  <select
                    name="productType"
                    value={formData.productType}
                    onChange={handleChange}
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA] font-semibold text-[var(--text-main)] bg-[var(--bg-card)]"
                  >
                    <option value="Visiting Cards">Visiting Cards &amp; Executive Stationery</option>
                    <option value="Packaging Boxes">Custom Packaging &amp; Corrugated Boxes</option>
                    <option value="Flyers & Brochures">Flyers, Folders &amp; Catalogues</option>
                    <option value="Labels & Stickers">Die-Cut Labels &amp; Roll Stickers</option>
                    <option value="Signage & Banners">Outdoor Signage &amp; Standees</option>
                    <option value="Custom Apparel">Corporate Polos, T-Shirts &amp; Hoodies</option>
                    <option value="Corporate Gifts">Drinkware, Hampers &amp; Welcome Kits</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Estimated Quantity *</label>
                  <input
                    type="number"
                    name="estimatedQuantity"
                    required
                    min="100"
                    step="50"
                    value={formData.estimatedQuantity}
                    onChange={handleChange}
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA] font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Specific Print &amp; Finishing Specifications</label>
                <textarea
                  name="requirements"
                  rows={4}
                  value={formData.requirements}
                  onChange={handleChange}
                  placeholder="Mention paper GSM (e.g. 400 GSM), special finishes (Gold Foil, Spot UV, Velvet lamination), multi-branch split deliveries, target delivery date..."
                  className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-faint)] font-medium">
                  🔒 Strictly confidential. We never share enterprise artwork or contact data.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 bg-[#0082CA] hover:bg-[#006da8] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting Quote...' : 'Submit Commercial Quote'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
