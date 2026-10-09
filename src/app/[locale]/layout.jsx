import '../globals.css';
import QueryProvider from '@/providers/QueryProvider.jsx';
import LayoutClientWrapper from '@/components/common/LayoutClientWrapper.jsx';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing.js';
import { cookies } from 'next/headers';
import Script from 'next/script';

export async function generateMetadata({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);
  
  try {
    const t = await getTranslations({ locale, namespace: 'metadata' });
    const title = t('title');
    const description = t('description');

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maazaprintwala.in';
    return {
      metadataBase: new URL(baseUrl),
      title: title,
      description: description,
      openGraph: {
        title: title,
        description: description,
        url: `${baseUrl}/${locale}`,
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
        canonical: `${baseUrl}/${locale}`,
        languages: {
          'en': `${baseUrl}/en`,
          'hi': `${baseUrl}/hi`,
          'mr': `${baseUrl}/mr`,
          'x-default': `${baseUrl}/en`
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
  const cookieStore = await cookies();
  const hasConsent = cookieStore.get('cookieConsent')?.value === 'true';

  return (
    <html lang={locale}>
      <head>
        {hasConsent && process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">{`
            !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
          `}</Script>
        )}

        {hasConsent && process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
            <Script id="ga" strategy="afterInteractive">{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              ${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ? `gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_ID}');` : ''}
            `}</Script>
          </>
        )}
      </head>
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
