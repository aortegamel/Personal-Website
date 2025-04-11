/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove 'output: export' for Vercel deployment
  images: {
    domains: ['vercel.com'],
    formats: ['image/avif', 'image/webp'],
  },
  trailingSlash: true,
  // Remove basePath for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
  // Add contentLayer config
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    return config;
  }
};

export default nextConfig;