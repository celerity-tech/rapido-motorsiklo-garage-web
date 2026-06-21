import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    // The sample marketplace placeholders are first-party SVGs we author.
    // Real photos from the CMS should be raster (jpg/webp) — add the CMS image
    // host to `remotePatterns` below when wiring the live endpoint.
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      // CMS images are served from Cloudinary. A custom Cloudinary CNAME would
      // need its own entry here.
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;
