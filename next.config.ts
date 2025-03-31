// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
//   distDir: "build",
//   images: {
//     unoptimized: true,
//     domains: ["res.cloudinary.com"],
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disabling static export since it doesn't work well with dynamic routes
  // output: "export",
  distDir: "build",
  images: {
    // unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
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
