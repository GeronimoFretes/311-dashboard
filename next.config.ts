import type { NextConfig } from "next";
import type { Configuration } from "webpack";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack(config: Configuration) {
    // Add raw-loader for .csv files
    config.module?.rules?.push({
      test: /\.csv$/,
      use: 'raw-loader',
    });

    // Prevent bundling the Node-only 'canvas' module
    config.resolve = {
      ...(config.resolve || {}),
      fallback: {
        ...(config.resolve?.fallback || {}),
        canvas: false,
      },
    };

    return config;
  },
};

export default nextConfig;
