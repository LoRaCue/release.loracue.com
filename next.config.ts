import type { NextConfig } from 'next';

const config: NextConfig = {
  output: 'standalone',
  experimental: {
    // turbo: {},
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // ISR for releases.json
  async rewrites() {
    return [
      {
        source: '/api/releases',
        destination: '/releases.json',
      },
    ];
  },
};

export default config;
