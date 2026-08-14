import '../globals.css';
import QueryProvider from '@/providers/QueryProvider.jsx';
import LayoutClientWrapper from '@/components/common/LayoutClientWrapper.jsx';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing.js';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  try {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const title = t('title');
    const description = t('description');

    return {
      metadataBase: new URL('https://maazaprintwala.in'),
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `https://maazaprintwala.in/${locale}`,
        siteName: 'Maza Printwala',
        locale: locale,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: title,
        description: description,
      },
      alternates: {
        canonical: `https://maazaprintwala.in/${locale}`,
        languages: {
          'en': 'https://maazaprintwala.in/en',
          'hi': 'https://maazaprintwala.in/hi',
          'mr': 'https://maazaprintwala.in/mr',
          'x-default': 'https://maazaprintwala.in/en'
        },
      },
    };
  } catch (error) {
    return {
      title: 'Maza Printwala',
    };
  }
}

export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="bg-[var(--color-bg-neutral)] text-[var(--color-charcoal)] antialiased font-sans min-h-screen flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <LayoutClientWrapper>{children}</LayoutClientWrapper>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
