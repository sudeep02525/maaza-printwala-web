import React from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react';
import { Link } from '@/i18n/routing.js';
import { serverApi } from '@/lib/server-api.js';

export const metadata = {
  title: 'Refund & Reprint Policy | Maza Printwala',
  description: 'Understand reprint, quality guarantee, and return guidelines for custom printed merchandise at Maza Printwala.',
};

export default async function RefundPolicyPage() {
  const cmsRes = await serverApi.get('/cms/key/policy_returns', 60).catch(() => null);
  const policy = cmsRes?.data?.content?.content;
  const policyText = policy?.body || policy?.content;
  const hasCustomContent = Boolean(policyText && policyText.trim().length > 0);

  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[var(--bg-card)] rounded-2xl shadow-xs border border-[var(--border)] p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0082CA] rounded-full text-xs font-bold mb-3">
            <RotateCcw className="w-4 h-4" />
            <span>Quality Commitment</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            {policy?.title || 'Refund & Reprint Policy'}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">
            Last updated: {policy?.lastUpdated || 'October 2026'}
          </p>
        </div>

        {hasCustomContent ? (
          <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
            {policyText.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="text-sm text-[var(--text-muted)] leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        ) : (
          <>
            {/* Section 1: Custom Printed Products */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">1. Made-to-Order Custom Products</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Because printed products are manufactured with custom names, corporate artwork, logos, and dimensions tailored exclusively to you, orders cannot be cancelled or returned once production begins or for customer change-of-mind.
              </p>
            </div>

            {/* Section 2: Defect & Damage Protection */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">2. 100% Free Reprint Guarantee</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                If your order arrives with manufacturing defects, incorrect cutting dimensions, ink smearing, or transit damage, we will reprint and express-dispatch your order completely free of charge, or issue full store credit.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
                  <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">48-Hour Claim Window</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Please submit a ticket via our <Link href="/support" className="text-[#0082CA] font-semibold underline">Support Desk</Link> within 48 hours of courier delivery along with clear photos of the defect and outer package label.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
                  <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Rapid Pre-Press Review</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Our technical pre-press team reviews reported issues within 24 business hours. Approved claims are prioritized on production presses immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 3: Customer Proof Responsibility */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <HelpCircle className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">3. Proofing & Resolution Errors</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Maza Printwala is not liable for customer-supplied typos, spelling errors, low-resolution pixelation (under 150 DPI), or design elements placed outside the safe bleed line that were accepted during proof sign-off.
              </p>
            </div>
          </>
        )}

        {/* Back navigation */}
        <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-[#0082CA] hover:underline">
            &larr; Return to Store Home
          </Link>
          <Link href="/terms" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]">
            Read Terms of Service &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
