// =============================================================================
// next.config.mjs — Must be .mjs for standalone Docker builds
// =============================================================================
// Next.js reads this as native ESM — no TypeScript compilation needed.

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SUPPRESS_NO_CONFIG_WARNING: "true",
  },
  // Required: produces a self-contained .next/standalone/ directory
  // that bundles its own Node.js-compatible server_modules
  output: "standalone",
  // Recommended for container environments
  poweredByHeader: false,
};

export default nextConfig;