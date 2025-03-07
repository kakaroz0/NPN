import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ปิด ESLint ระหว่าง build
  },
};

export default nextConfig;