import type { NextConfig } from "next";

// Static export: required for Cloudflare Pages hosting (no server runtime).
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
