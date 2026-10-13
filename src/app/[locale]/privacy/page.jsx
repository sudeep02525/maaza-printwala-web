import React from 'react';
import { ShieldCheck, Cookie, Lock, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

export const metadata = {
  title: 'Privacy & Cookie Policy | Maza Printwala',
  description: 'Learn how Maza Printwala protects your personal data and uses cookies to enhance your printing and design experience.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[var(--bg-card)] rounded-2xl shadow-xs border border-[var(--border)] p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0082CA] rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Transparency & Compliance</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Privacy & Cookie Policy</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: October 2026</p>
        </div>

        {/* Section 1: Cookie Policy */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Cookie className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">1. How We Use Cookies</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Maza Printwala uses cookies and similar storage technologies to provide an optimal shopping and design customization experience, remember your preferences, and analyze website traffic.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
              <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Essential Cookies</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Necessary for shopping cart management, user session authentication, and secure checkout processing. These cannot be disabled.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
              <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Analytics & Personalization</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Help us understand how customers discover our printing catalogue, optimize site speed, and display relevant commercial offers.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Managing Preferences */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">2. Managing Your Cookie Choices</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            You can modify your cookie consent at any time directly through the corner cookie preferences card on our website, or by clearing cookies in your browser settings. Declining analytics cookies will not hinder your ability to configure or order print products.
          </p>
        </div>

        {/* Section 3: Data Protection */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">3. Artwork & File Security</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Files uploaded to our print preflight studio (PDF, AI, PNG artwork) are processed over secure SSL encryption and inspected exclusively for resolution, safe zones, and print production quality control. Your designs remain your intellectual property.
          </p>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[var(--text-muted)]">
            Questions regarding our policy? Contact <span className="font-semibold text-[var(--text-main)]">support@maazaprintwala.in</span>
          </div>
          <Link
            href="/products"
            className="px-5 py-2 bg-[#0082CA] hover:bg-[#0068A2] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Explore Catalogue &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
