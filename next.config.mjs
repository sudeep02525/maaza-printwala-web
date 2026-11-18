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
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'api.maazaprintwala.in',
      },
      {
        protocol: 'https',
        hostname: 'maazaprintwala.in',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '5000',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/categories',
        destination: '/products',
        permanent: true,
      },
      {
        source: '/:locale/categories',
        destination: '/:locale/products',
        permanent: true,
      },
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
