'use client';

import React, { useState } from 'react';
import { HelpCircle, Mail, MessageSquare, Phone, Send, CheckCircle2, FileQuestion, ArrowRight } from 'lucide-react';
import axiosInstance from '@/services/axiosInstance.js';
import { Link } from '@/i18n/routing.js';

export default function SupportPage() {
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
    { q: 'What artwork format should I upload?', a: 'We accept high-resolution PDF, AI, PSD, PNG, and JPEG files. We recommend 300+ DPI at 1:1 print scale with a 3mm bleed margin.' },
    { q: 'Can I reorder from a past design?', a: 'Yes! Navigate to My Orders and click Reorder, or reload saved design project drafts from your account dashboard.' },
    { q: 'How can I track my shipment?', a: 'Visit our Track Order page and enter your 10-character Order ID (e.g. MW-10023) along with your registered mobile or email.' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-subtle)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Header */}
        <div className="text-center space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-100 text-[#0082CA] text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5" /> Customer Assistance
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-main)] tracking-tight">
            How can our printing experts help you?
          </h1>
          <p className="text-sm text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed">
            Have questions about design resolution, paper stock weights, delivery tracking, or an existing order? Send us a ticket below.
          </p>
        </div>

        {/* Support Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Submit Ticket Card */}
          <div className="bg-[var(--bg-card)] rounded-2xl border border-[var(--border)] p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-black text-[var(--text-main)] mb-1">Open a Support Request</h2>
            <p className="text-xs text-[var(--text-muted)] mb-6">Our pre-press support specialists reply promptly.</p>

            {isSubmitted ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-lg font-black text-[var(--text-main)]">Ticket Logged!</h3>
                <p className="text-xs text-[var(--text-muted)] font-normal">
                  We have logged your ticket and sent a confirmation to <strong>{formData.email}</strong>. Our support team will assist you shortly.
                </p>
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormData({ email: '', subject: '', message: '' });
                  }}
                  className="mt-4 px-4 py-2 text-xs font-bold text-[#0082CA] hover:underline cursor-pointer"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 text-xs bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg border border-red-200">
                    {errorMsg}
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Your Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Subject / Order ID *</label>
                  <input
                    type="text"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Order #MW-2001 or Question about 350 GSM Finish"
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[var(--text-main)] block mb-1">Message Description *</label>
                  <textarea
                    rows={4}
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Explain your inquiry in detail..."
                    className="w-full text-xs p-3 border border-[var(--border-strong)] rounded-lg focus:outline-none focus:border-[#0082CA]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Submitting...' : 'Send Support Request'}</span>
                </button>
              </form>
            )}
          </div>

          {/* FAQ Column */}
          <div className="space-y-4">
            <h2 className="text-lg font-black text-[var(--text-main)] flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-[#0082CA]" /> Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="bg-[var(--bg-card)] p-4 rounded-xl border border-[var(--border)] shadow-2xs space-y-1.5">
                  <h3 className="text-xs font-bold text-[var(--text-main)]">{faq.q}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed font-normal">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-50/70 rounded-xl p-5 border border-blue-200 text-xs text-[var(--text-main)] space-y-2">
              <span className="font-bold text-[#0082CA] block">Need to track an existing shipment?</span>
              <p className="text-[var(--text-muted)] font-normal">Use our self-service order tracking dashboard for live courier transit status.</p>
              <Link
                href="/track-order"
                className="inline-flex items-center gap-1 font-bold text-[#0082CA] hover:underline pt-1"
              >
                Track My Order <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
