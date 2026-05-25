import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const apiInternalUrl = process.env.API_INTERNAL_URL || 'http://localhost:5246';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  turbopack: {
    root: __dirname,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiInternalUrl}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${apiInternalUrl}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
