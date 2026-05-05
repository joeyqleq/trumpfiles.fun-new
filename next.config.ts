import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // Performance optimizations
    experimental: {
        optimizePackageImports: [
            "@radix-ui/*",
            "@tabler/icons-react",
            "recharts",
            "echarts",
            "framer-motion",
            "three",
        ],
    },
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60,
    },
    reactStrictMode: true,
};

export default nextConfig;

