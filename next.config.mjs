/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: '*.gamepix.com',
      },
      {
        protocol: 'https',
        hostname: 'img.gamepix.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.gamepix.com',
      },
    ],
  },
};

export default nextConfig;
