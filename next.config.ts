import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/Angel Ortega-Melton.github.io' : '',
  typescript: {
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
