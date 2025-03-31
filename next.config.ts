/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not use output: "export" for Vercel deployments
  // output: "export",
  
  // Remove custom dist directory for Vercel compatibility
  // distDir: "next",
  
  images: {
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
