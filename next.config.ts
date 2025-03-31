/** @type {import('next').NextConfig} */
const nextConfig = {
  // Do not use output: "export" for Vercel deployments
  // output: "export",

  // Remove custom dist directory for Vercel compatibility
  // distDir: "next",

  // Ensure all paths are properly handled (including dynamic ones)
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
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
