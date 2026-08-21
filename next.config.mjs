/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },

  experimental: {
    useWasmBinary: true,
    forceSwcTransforms: false,
  },

  async redirects() {
    return [
      {
        source: '/news',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/news/:slug*',
        destination: '/blog/:slug*',
        permanent: true,
      },
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/terms-of-service',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/cookie-policy',
        destination: '/cookies',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
