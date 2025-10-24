import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: "/Users/joeyq/Desktop/trumpfiles.fun-warp", // absolute path
  },
  experimental: {
    allowDevelopmentBuild: true,
  },
};

export default nextConfig;