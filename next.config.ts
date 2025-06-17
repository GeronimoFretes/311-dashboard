import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config) {
    // Prevent bundling the Node-only 'canvas' module:
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      canvas: false,
    };
    return config;
  },
};

export default nextConfig;
