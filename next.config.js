/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };
    }
    return config;
  },
  // Disable static exports for pages that require authentication
  output: 'standalone',
  experimental: {
    // This will allow Next.js to tree shake unused exports
    optimizeCss: true,
    // This will allow Next.js to optimize the bundle size
    optimizePackageImports: ['firebase'],
  },
}

module.exports = nextConfig 