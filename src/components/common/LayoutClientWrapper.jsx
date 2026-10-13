'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/common/Header.jsx';
import Footer from '@/components/common/Footer.jsx';
import CookieConsentBanner from '@/components/common/CookieConsentBanner.jsx';
import { AuthHeader, AuthFooter } from '@/components/common/AuthChrome.jsx';
import { track } from '@/lib/track.js';
import { useAuthStore } from '@/store/authStore.js';

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const isCustomizer = pathname.includes('/design');
  const isAuthPage =
    pathname.includes('/login') ||
    pathname.includes('/register') ||
    pathname.includes('/forgot-password') ||
    pathname.includes('/reset-password');

  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    track('PageView');
  }, [pathname]);

  if (isCustomizer) {
    return <main className="flex-1 h-screen flex flex-col">{children}</main>;
  }

  if (isAuthPage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#FAFCFF]">
        <AuthHeader />
        <main className="flex-1 flex flex-col justify-center">{children}</main>
        <AuthFooter />
      </div>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsentBanner />
    </>
  );
}
