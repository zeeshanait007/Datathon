/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/app",
  trailingSlash: true,
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {
    cpus: 1,
    workerThreads: false
  },
  webpack: (config) => {
    config.cache = false;
    return config;
  }
};

export default nextConfig;
