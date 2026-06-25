import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js", maximumFileSizeToCacheInBytes: 5000000,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default withSerwist(nextConfig);
