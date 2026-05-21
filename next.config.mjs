import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

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
        destination: 'http://api:8080/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://api:8080/uploads/:path*',
      },
    ];
  },
};

export default nextConfig;
