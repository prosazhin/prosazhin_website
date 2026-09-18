import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: 'standalone',
  async redirects() {
    return [
      {
        source: '/docs/pbcomponents/getting-started',
        destination: '/docs/pbcomponents',
        permanent: true,
      },
      {
        source: '/docs/pbstyles/:section(getting-started|tokens|reference)',
        destination: '/docs/pbstyles',
        permanent: true,
      },
      {
        source: '/docs/mixin-dictionary/:section(getting-started|reference)',
        destination: '/docs/mixin-dictionary',
        permanent: true,
      },
      {
        source:
          '/docs/tailwind-dictionary/:section(getting-started|tailwind-3|tailwind-4|reference)',
        destination: '/docs/tailwind-dictionary',
        permanent: true,
      },
    ];
  },
};

export default createMDX()(nextConfig);
