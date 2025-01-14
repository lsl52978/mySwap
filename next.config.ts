import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  trailingSlash: true,
  basePath: "/mySwap", // 替换为你的 GitHub 仓库名
  assetPrefix: "/mySwap", // 同样替换为你的 GitHub 仓库名
};

export default nextConfig;
