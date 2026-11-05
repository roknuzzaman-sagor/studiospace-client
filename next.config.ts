import type { NextConfig } from "next";
import { getApiOrigin } from "./src/lib/auth-contract";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiOrigin = getApiOrigin(process.env.NEXT_PUBLIC_API_URL);
    return [
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",   
      },
      {
        protocol: "http",
        hostname: "**",   
      },
    ],
   
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;