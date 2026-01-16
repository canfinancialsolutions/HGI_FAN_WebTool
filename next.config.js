
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverExternalPackages: ['pdfkit'],
  },
};

module.exports = nextConfig;
