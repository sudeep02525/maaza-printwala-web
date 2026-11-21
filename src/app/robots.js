export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account', '/account/*', '/cart', '/checkout', '/orders', '/orders/*', '/private/*'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://mazaprintwala.com'}/sitemap.xml`,
  };
}
