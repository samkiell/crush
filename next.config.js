/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  swSrc: "public/sw-source.js",
  strategies: "injectManifest",
});

const nextConfig = {
  reactStrictMode: true,
  // Add empty turbopack config to silence Next.js 16 warning
  turbopack: {},
  images: {
    // Updated from deprecated 'domains' to 'remotePatterns'
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

module.exports = withPWA(nextConfig);
