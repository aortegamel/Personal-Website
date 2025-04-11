/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Vercel deployment
  images: {
    domains: ['vercel.com'],
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add contentLayer config
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
};

module.exports = nextConfig;
