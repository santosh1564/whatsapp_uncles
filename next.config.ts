import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silence workspace root inference warning
    root: __dirname,
  },
};

export default nextConfig;
