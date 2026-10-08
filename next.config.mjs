import createNextIntlPlugin from 'next-intl/plugin';
 
const withNextIntl = createNextIntlPlugin(
  './src/i18n/request.js'
);
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/all',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/:category',
        has: [
          {
            type: 'query',
            key: 'sub',
            value: '(?<subcategory>.*)',
          },
        ],
        destination: '/:category/:subcategory',
        permanent: true,
      }
    ];
  },
};
 
export default withNextIntl(nextConfig);
