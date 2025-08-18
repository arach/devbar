import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // Base path will be set via environment variable for GitHub Pages
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    unoptimized: true,
  },
  // Disable error overlay in production
  productionBrowserSourceMaps: false,
  // Skip trailing slash redirect
  skipTrailingSlashRedirect: true,
};

export default nextConfig;