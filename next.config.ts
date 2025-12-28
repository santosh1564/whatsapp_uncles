import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence workspace root inference warning
    root: __dirname,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
