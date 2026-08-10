/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.gamepix.com',
      },
      {
        protocol: 'https',
        hostname: 'play.gamepix.com',
      }
    ],
    // Enable modern formats - Next.js will serve AVIF/WebP automatically based on Accept header
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Use unoptimized false to enable optimization
  },
  async headers() {
    return [
      {
        // General security headers - NO X-Frame-Options DENY here, allow SAMEORIGIN for games
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Allow same-origin iframes for /games/* embedding
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
      {
        // Games can be embedded same-origin only
        source: '/games/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Content-Security-Policy', value: "frame-ancestors 'self'" },
          { key: 'Cache-Control', value: 'public, max-age=3600, must-revalidate' },
        ],
      },
      {
        source: '/images/games/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
