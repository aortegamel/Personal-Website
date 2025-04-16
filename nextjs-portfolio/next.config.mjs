import mdx from '@next/mdx';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const withMDX = mdx();

export default withMDX({
  ...nextConfig,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
});