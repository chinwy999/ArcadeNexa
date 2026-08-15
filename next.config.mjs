/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    useWasmBinary: true,
    forceSwcTransforms: false,
  },
}

export default nextConfig
