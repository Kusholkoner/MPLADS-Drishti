/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["*"],
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
};

export default nextConfig;
