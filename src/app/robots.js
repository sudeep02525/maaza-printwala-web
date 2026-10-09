export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/private/'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://maazaprintwala.in'}/sitemap.xml`,
  };
}
