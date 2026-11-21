'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, Send, CheckCircle2, FileQuestion, ArrowRight } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import { useSettingsStore } from '@/store/settingsStore.js';
import { Link } from '@/i18n/routing.js';

export default function SupportPage() {
  const { settings, fetchSettings } = useSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    message: '',
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
      await axiosInstance.post('/inquiries/support', formData);
      setIsSubmitted(true);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to submit ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    { q: 'How long does printing and dispatch take?', a: 'Standard orders dispatch in 2-3 business days. Same-day dispatch is available for select business cards and promotional items in metro regions.' },
    { q: 'What artwork format should I upload?', a: `We accept high-resolution PDF, AI, PSD, PNG, and JPEG files. We recommend ${settings?.defaultDpiCheck || 300}+ DPI at 1:1 print scale with a 3mm bleed margin.` },
    { q: 'Can I reorder from a past design?', a: 'Yes! Navigate to My Orders and click Reorder, or reload saved design project drafts from your account dashboard.' },
    { q: 'How can I track my shipment?', a: 'Visit our Track Order page and enter your 10-character Order ID (e.g. MW-10023) along with your registered mobile or email.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0082CA] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5" /> Customer Assistance
          </span>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold text-[var(--text-main)] tracking-tight">
            How can our printing experts help you?
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            Have questions about design resolution, paper stock weights, delivery tracking, or an existing order? Send us a ticket below.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Submit Ticket Card */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] mb-1.5">Open a Support Request</h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">Our pre-press support specialists reply promptly during business hours.</p>

            {isSubmitted ? (
              <div className="text-center py-12 space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
                <h3 className="font-display text-2xl font-bold text-[var(--text-main)]">Ticket Logged!</h3>
                <p className="text-sm text-[var(--text-muted)] font-normal max-w-sm mx-auto leading-relaxed">
                  We have logged your ticket and sent a confirmation to <strong className="text-[var(--text-main)]">{formData.email}</strong>. Our support team will assist you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-5 py-2.5 text-sm font-bold text-[#0082CA] hover:underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 text-sm bg-red-500/10 text-red-500 dark:text-red-400 border border-red-500/20 rounded-xl font-medium">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] focus:border-[#0082CA] rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                    Subject / Order ID *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Order #MW-2001 or Question about 350 GSM Finish"
                    className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] focus:border-[#0082CA] rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-bold text-[var(--text-main)] mb-1.5">
                    Message Description *
                  </label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Explain your inquiry in detail..."
                    className="w-full px-4 py-3 bg-[var(--bg-subtle)] border border-[var(--border)] focus:border-[#0082CA] rounded-xl text-sm text-[var(--text-main)] placeholder-[var(--text-faint)] focus:outline-none transition-colors resize-y"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#0082CA] hover:bg-[#006EA8] text-white text-sm font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Support Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Column */}
          <div className="space-y-4">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[var(--text-main)] flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-[#0082CA]" /> Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[var(--bg-card)] p-4 sm:p-5 rounded-xl border border-[var(--border)] shadow-2xs space-y-2">
                  <h3 className="text-sm sm:text-base font-bold text-[var(--text-main)]">{faq.q}</h3>
                  <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed font-normal">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/70 dark:bg-blue-950/30 rounded-xl p-5 sm:p-6 border border-blue-200 dark:border-blue-900/60 text-xs sm:text-sm text-[var(--text-main)] space-y-2">
              <span className="font-bold text-[#0082CA] block text-sm sm:text-base">Need to track an existing shipment?</span>
              <p className="text-[var(--text-muted)] font-normal leading-relaxed">Use our self-service order tracking dashboard for live courier transit status.</p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1.5 font-bold text-[#0082CA] hover:underline pt-1 text-sm"
              >
                Track My Order <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl p-5 sm:p-6 border border-[var(--border)] text-xs sm:text-sm text-[var(--text-main)] space-y-3 shadow-2xs">
              <span className="font-bold text-[var(--text-main)] block text-sm sm:text-base">Direct Support Helpline</span>
              <p className="text-[var(--text-muted)] font-normal">Connect directly with our pre-press customer assistance desk:</p>
              <div className="space-y-2.5 pt-1 font-bold">
                <div className="flex items-center gap-2.5 text-sm sm:text-base text-[var(--text-main)]">
                  <Phone className="w-4 h-4 text-[#0082CA] shrink-0" />
                  <a href={`tel:${(settings?.supportPhone || '+91 7700054984').replace(/\s+/g, '')}`} className="hover:text-[#0082CA] transition-colors">
                    {settings?.supportPhone || '+91 7700054984'}
                  </a>
                </div>
                <div className="flex items-center gap-2.5 text-sm sm:text-base text-[var(--text-main)]">
                  <Mail className="w-4 h-4 text-[#0082CA] shrink-0" />
                  <a href={`mailto:${settings?.supportEmail || 'imagemazaprintwala@gmail.com'}`} className="break-all text-[#0082CA] hover:underline">
                    {settings?.supportEmail || 'imagemazaprintwala@gmail.com'}
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
