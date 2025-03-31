/** @type {import('next').NextConfig} */
const nextConfig = {
  // Comment out static export for Vercel deployment 
  // output: "export",
  distDir: "build",
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
    ],
  },
  typescript: {
    // During development we can ignore TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // During development we can ignore ESLint errors
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
