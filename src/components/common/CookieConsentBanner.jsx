'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@/i18n/routing.js';

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent is already set
    const consent = document.cookie
      .split('; ')
      .find((row) => row.startsWith('cookieConsent='));
    if (!consent) {
      setShow(true);
    }
  }, []);

  const loadTrackingPixels = () => {
    try {
      const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
      const gaId = process.env.NEXT_PUBLIC_GA_ID;
      const gAdsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

      // Meta Pixel direct injection
      if (metaPixelId && typeof window !== 'undefined' && !window.fbq) {
        !(function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = '2.0';
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
        window.fbq('init', metaPixelId);
        window.fbq('track', 'PageView');
      }

      // Google Analytics / Ads direct injection
      if (gaId && typeof window !== 'undefined' && !document.getElementById('ga-script')) {
        const script = document.createElement('script');
        script.id = 'ga-script';
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(script);

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
          window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', gaId);
        if (gAdsId) {
          window.gtag('config', gAdsId);
        }
      }
    } catch (e) {
      console.error('Error initializing analytics pixels', e);
    }
  };

  const acceptCookies = () => {
    document.cookie = 'cookieConsent=true; path=/; max-age=31536000; SameSite=Lax';
    loadTrackingPixels();
    setShow(false);
  };

  const declineCookies = () => {
    document.cookie = 'cookieConsent=false; path=/; max-age=31536000; SameSite=Lax';
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-4 left-4 right-4 sm:right-auto sm:bottom-6 sm:left-6 z-50 sm:w-[350px] max-w-[360px] mx-auto sm:mx-0 pointer-events-auto"
        >
          <div className="bg-slate-900/95 text-slate-200 p-4 sm:p-4.5 rounded-2xl shadow-2xl border border-slate-800 backdrop-blur-md">
            
            {/* Header / Text */}
            <div className="flex items-start gap-2.5">
              <span className="text-xl shrink-0 leading-none select-none">🍪</span>
              <p className="text-xs sm:text-[13px] leading-snug text-[var(--text-faint)]">
                We use cookies to improve your experience and show relevant offers.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-3.5">
              <button
                type="button"
                onClick={acceptCookies}
                className="flex-1 py-2 px-3.5 bg-[#0082CA] hover:bg-[#0068A2] text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer text-center"
              >
                Accept All
              </button>
              <button
                type="button"
                onClick={declineCookies}
                className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-[var(--text-faint)] border border-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center"
              >
                Decline
              </button>
            </div>

            {/* Policy Link */}
            <div className="pt-2 flex justify-start">
              <Link
                href="/privacy"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-faint)] hover:text-white transition-colors group"
              >
                <span>Cookie Policy</span>
                <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
              </Link>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
