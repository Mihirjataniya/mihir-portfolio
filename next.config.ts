import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // One post so far, so /blogs goes straight to it. Temporary (307) on purpose:
  // when a second post lands, /blogs becomes a real list page again.
  async redirects() {
    return [
      {
        source: "/blogs",
        destination: "/blogs/from-prompt-to-bill",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
