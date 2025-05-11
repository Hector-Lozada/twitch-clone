import type { NextConfig } from "next";
import { config } from "process";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) =>{
    config.module.rules.push({
      test: /\.msj$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  }
};

export default nextConfig;
