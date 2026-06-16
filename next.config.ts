import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_URL || "http://52.77.214.191:8082"}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
