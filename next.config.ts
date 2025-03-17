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
  output: "export",
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
