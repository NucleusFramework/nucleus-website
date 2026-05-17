import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

const isExport = process.env.NEXT_OUTPUT === 'export';
const basePath = process.env.NEXT_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: process.cwd(),
  experimental: {
    optimizePackageImports: ['fumadocs-ui', 'fumadocs-core'],
    cpus: 80,
    workerThreads: true,
    staticGenerationMaxConcurrency: 80,
    staticGenerationMinPagesPerWorker: 1,
  },
  ...(isExport
    ? {
        output: 'export',
        trailingSlash: true,
        images: { unoptimized: true },
        basePath: basePath || undefined,
        assetPrefix: basePath || undefined,
        skipMiddlewareUrlNormalize: true,
      }
    : {
        async headers() {
          return [
            {
              source: '/(.*)',
              headers: [
                { key: 'X-Content-Type-Options', value: 'nosniff' },
                { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
                { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
              ],
            },
          ];
        },
      }),
};

export default withMDX(config);
