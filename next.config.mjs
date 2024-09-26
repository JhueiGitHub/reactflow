/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: "canvas" }]; // if you need canvas
    return config;
  },
};

export default nextConfig;
