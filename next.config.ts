import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/history',
        destination: '/loan/history',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
