import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Cloudflare R2 public dev URL (current storage provider)
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        // Supabase — legacy storage, kept so any pre-migration image URLs still load
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
