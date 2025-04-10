import type { NextConfig } from "next";
import { withContentlayer } from 'contentlayer/next';

const nextConfig: NextConfig = {
  // Enable image optimization for Vercel deployment
  images: {
    domains: ['angleito.github.io'],
    formats: ['image/avif', 'image/webp']
  },
  // Add trailing slashes for consistent URLs
  trailingSlash: true
};

export default withContentlayer(nextConfig);
