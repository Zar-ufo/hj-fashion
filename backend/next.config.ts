import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  // API-only backend; keep everything dynamic.
  outputFileTracingRoot: path.resolve(__dirname),
};

export default nextConfig;
