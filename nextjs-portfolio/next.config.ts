import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable image optimization for Vercel deployment
  images: {
    unoptimized: true
  },
  output: 'export',
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/Angel Ortega-Melton.github.io' : '',
};

export default nextConfig;
