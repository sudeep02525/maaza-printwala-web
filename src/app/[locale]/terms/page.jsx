import React from 'react';
import { FileText, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing.js';

export const metadata = {
  title: 'Terms of Service | Maza Printwala',
  description: 'Review our print manufacturing, artwork review, dispatch, and ordering terms of service at Maza Printwala.',
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[var(--bg-card)] rounded-2xl shadow-xs border border-[var(--border)] p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0082CA] rounded-full text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Customer Agreement</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">Effective Date: October 2026</p>
        </div>

        {/* Section 1: Ordering & Artwork */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">1. Orders & Artwork Specifications</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            By placing an order with Maza Printwala, you confirm that you hold all necessary legal rights, copyrights, or authorizations to reproduce the logos, designs, and text submitted for print. Customers are responsible for reviewing proofs, dimensions, spelling, and color calibration before confirming production.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
              <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Color Matching (CMYK)</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Industrial print runs are converted to standard CMYK color gamut. Slight tonal variances between backlit digital displays and physical ink on paper/fabric are normal industry tolerances.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
              <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Print Readiness</h3>
              <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                Our pre-press automated checker inspects resolution (300 DPI) and bleed margins. Low resolution user uploads may affect reproduction clarity.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Turnaround & Shipping */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">2. Production Turnaround & Shipping</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Estimated turnaround times start once artwork approval and payment verification are finalized. Deliveries are dispatched via accredited express surface and air logistics partners. Unforeseen courier transit delays or national holidays are managed with proactive tracking updates.
          </p>
        </div>

        {/* Section 3: Returns & Quality Guarantee */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-[#0082CA]" />
            <h2 className="text-xl font-bold text-[var(--text-main)]">3. Quality Guarantee & Reprint Policy</h2>
          </div>
          <p className="text-sm text-[var(--text-muted)] leading-relaxed">
            Because printed merchandise is customized to unique customer specifications, items cannot be returned for buyer remorse. However, if a manufacturing defect, cutting flaw, or transit damage occurs, notify our support within 48 hours of delivery with photos for an expedited reprint or resolution.
          </p>
        </div>

        {/* Back navigation */}
        <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-[#0082CA] hover:underline">
            &larr; Return to Store Home
          </Link>
          <Link href="/privacy" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]">
            Read Privacy & Cookie Policy &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
