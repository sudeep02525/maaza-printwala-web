'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/common/Header.jsx';
import Footer from '@/components/common/Footer.jsx';

export default function LayoutClientWrapper({ children }) {
  const pathname = usePathname();
  const isCustomizer = pathname.includes('/design');

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
