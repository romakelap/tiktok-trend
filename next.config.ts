import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://32.236.47.224:8082"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
