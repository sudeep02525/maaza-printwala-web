'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/common/Header.jsx';
import Footer from '@/components/common/Footer.jsx';
import { track } from '@/lib/track.js';

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const isCustomizer = pathname.includes('/design');

  useEffect(() => {
    track('PageView');
  }, [pathname]);

  if (isCustomizer) {
    return <main className="flex-1 h-screen flex flex-col">{children}</main>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
