import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["utfs.io"], // Añade el dominio de UploadThing aquí
  },
  experimental: {
    // appDir: true, // (Opcional) Solo necesario si usas Next.js < 13.4
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.msj$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  }
};

export default nextConfig;