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
  // output: "export",
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  distDir: "build",
  images: {
    unoptimized: true,
    domains: ["res.cloudinary.com"],
    loader: "cloudinary",
    path: "https://res.cloudinary.com/djxuqljgr/",
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
