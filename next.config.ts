import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    qualities: [75, 92],
  },
  reactStrictMode: false,
};

export default nextConfig;
