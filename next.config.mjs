/** @type {import('next').NextConfig} */
const nextConfig = {
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
    ]
  },
}

export default nextConfig
