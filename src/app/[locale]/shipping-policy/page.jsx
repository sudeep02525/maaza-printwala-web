import React from 'react';
import { Truck, ShieldCheck, Clock, MapPin, PackageCheck, AlertCircle } from 'lucide-react';
import { Link } from '@/i18n/routing.js';
import { serverApi } from '@/lib/server-api.js';

export const metadata = {
  title: 'Shipping Policy | Maza Printwala',
  description: 'Understand shipping timelines, Pan-India courier partners, order tracking, and delivery terms for Maza Printwala.',
};

export default async function ShippingPolicyPage({ params }) {
  const { locale } = await params;
  const cmsRes = await serverApi.get('/cms/key/policy_shipping', 60).catch(() => null);
  const policy = cmsRes?.data?.content?.content;
  const policyTitle = policy?.[`title_${locale}`] || policy?.title || (
    locale === 'hi' ? 'शिपिंग एवं डिलीवरी नीति' : locale === 'mr' ? 'शिपिंग आणि वितरण धोरण' : 'Shipping & Delivery Policy'
  );
  const policyText = policy?.[`body_${locale}`] || policy?.body || policy?.content;
  const hasCustomContent = Boolean(policyText && policyText.trim().length > 0);

  return (
    <div className="bg-[var(--bg-subtle)] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-[var(--bg-card)] rounded-2xl shadow-xs border border-[var(--border)] p-6 sm:p-10 space-y-8">
        
        {/* Header */}
        <div className="border-b border-[var(--border)] pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-[#0082CA] rounded-full text-xs font-bold mb-3">
            <Truck className="w-4 h-4" />
            <span>Pan-India Logistics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[var(--text-main)] tracking-tight">
            {policyTitle}
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
            {/* Section 1: Pan-India Coverage */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">1. Nationwide Courier Coverage</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Maza Printwala delivers to over 25,000+ pin codes across India in partnership with accredited express carriers including Blue Dart, Delhivery, DTDC, and India Post Speed Post.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
                  <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Standard Delivery (3-5 Days)</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Most standard commercial printing orders dispatch within 2-3 business days of artwork sign-off, reaching major metro and tier-1 cities within 24-48 hours after dispatch.
                  </p>
                </div>
                <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-subtle)]">
                  <h3 className="font-bold text-sm text-[var(--text-main)] mb-1">Express & Same-Day Dispatch</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    Same-day and next-day production turnaround is available on select digital printing items (e.g. standard visiting cards, flyers, and ID cards) placed before 1:00 PM IST.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 2: Order Tracking */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">2. Live Consignment Tracking</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                Once your print order leaves our commercial production hub, an AWB consignment tracking number is sent automatically via SMS and WhatsApp. You can also view step-by-step courier transit milestones on our <Link href="/track-order" className="text-[#0082CA] font-semibold underline">Track Order</Link> page.
              </p>
            </div>

            {/* Section 3: Safe Packaging */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <PackageCheck className="w-5 h-5 text-[#0082CA]" />
                <h2 className="text-xl font-bold text-[var(--text-main)]">3. Protective Weatherproof Packaging</h2>
              </div>
              <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                All finished print collateral is sealed in moisture-barrier poly wraps and rigid corrugated boxes with edge reinforcement to ensure zero corner dings or transit scuffs.
              </p>
            </div>
          </>
        )}

        {/* Back navigation */}
        <div className="pt-6 border-t border-[var(--border)] flex items-center justify-between">
          <Link href="/" className="text-xs font-bold text-[#0082CA] hover:underline">
            &larr; Return to Store Home
          </Link>
          <Link href="/refund-policy" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-main)]">
            Read Refund & Reprint Policy &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
