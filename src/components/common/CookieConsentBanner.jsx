'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if consent is already set
    const consent = document.cookie.split('; ').find(row => row.startsWith('cookieConsent='));
    if (!consent) {
      setShow(true);
    }
  }, []);

  const acceptCookies = () => {
    document.cookie = "cookieConsent=true; path=/; max-age=31536000"; // 1 year
    setShow(false);
    // Reload to inject the scripts
    window.location.reload();
  };

  const declineCookies = () => {
    document.cookie = "cookieConsent=false; path=/; max-age=31536000";
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900 text-slate-200 p-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p className="font-bold text-white mb-1">We value your privacy</p>
          <p className="text-slate-400">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={declineCookies} 
            className="px-4 py-2 border border-slate-700 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors"
          >
            Decline
          </button>
          <button 
            onClick={acceptCookies} 
            className="px-6 py-2 bg-[#0082CA] text-white rounded-lg text-sm font-bold hover:bg-[#0068A2] transition-colors"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}
