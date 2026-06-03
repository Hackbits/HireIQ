import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use Turbopack config for Next.js 16+ compatibility
  turbopack: {
    resolveAlias: {
      canvas: "./empty-module.js",
      encoding: "./empty-module.js",
    },
  },
};

export default nextConfig;
