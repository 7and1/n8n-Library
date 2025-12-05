/** @type {import('next').NextConfig} */
const nextConfig = {
  // Trailing slash for static hosting
  trailingSlash: true,

  // Image optimization disabled for static export
  images: {
    unoptimized: true,
  },

  // Strict mode for better development
  reactStrictMode: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Env variables
  env: {
    SITE_URL: process.env.SITE_URL || 'https://n8n-library.com',
    SITE_NAME: 'n8n Library',
  },
};

export default nextConfig;
