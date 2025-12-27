import type { NextConfig } from "next";
import path from "node:path";

const LOADER = path.resolve(__dirname, 'src/visual-edits/component-tagger-loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // In a monorepo, tracing should include the repo root.
  outputFileTracingRoot: path.resolve(__dirname, '..'),
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [LOADER]
      }
    }
  },
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'https://hj-fashion-3.onrender.com';
    return [
      {
        // Skip routes that have custom handlers in /api/auth/
        source: '/api/:path((?!auth/verify-email).*)',
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
// Orchids restart: 1766508523945
