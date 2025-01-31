/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json'
    });
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  i18n: {
    locales: ['en', 'ar'], // Supported languages
    defaultLocale: 'ar',    // Default language is Arabic
  },
};

module.exports = nextConfig;
