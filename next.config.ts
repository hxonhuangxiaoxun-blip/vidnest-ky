import type { NextConfig } from "next";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
if (basePath && !/^\/[a-zA-Z0-9_-]+$/.test(basePath))
  throw Error("Invalid NEXT_PUBLIC_BASE_PATH");
const config: NextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  images: { unoptimized: true },
  productionBrowserSourceMaps: false,
  experimental: { cpus: 2 },
};
export default config;
