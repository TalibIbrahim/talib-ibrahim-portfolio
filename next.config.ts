import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // QA builds can use their own output folder so parallel builds never swap chunks under a running server.
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
