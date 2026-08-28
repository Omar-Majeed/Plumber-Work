import type { NextConfig } from "next";

/**
 * Security headers.
 *
 * CSP notes:
 *  - `script-src`/`style-src` allow 'unsafe-inline' because Next.js emits an
 *    inline bootstrap script and this site is fully statically prerendered.
 *    Tightening those two directives requires per-request nonces, which means
 *    middleware and dynamic rendering on every route — a deliberate trade-off
 *    to make at launch, not a default.
 *  - `'unsafe-eval'` is added in development ONLY. React's dev build uses
 *    eval() for debugging features such as reconstructing call stacks; without
 *    it `npm run dev` logs "eval() is not supported in this environment".
 *    Production builds never need it and never get it.
 *
 * See README.md → Security notes.
 */
const isDev = process.env.NODE_ENV === "development";

const scriptSrc = [
  "script-src",
  "'self'",
  "'unsafe-inline'",
  ...(isDev ? ["'unsafe-eval'"] : []),
].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "object-src 'none'",
  // Photography is served from the Unsplash CDN (see src/content/photos.ts).
  "img-src 'self' data: blob: https://images.unsplash.com https://images.pexels.com",
  // Google Maps embed on the contact and home pages.
  "frame-src 'self' https://www.google.com https://maps.google.com",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  // The dev server needs its HMR websocket; production talks to itself only.
  isDev ? "connect-src 'self' ws: wss:" : "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    // Narrow rule: only Unsplash's image host, https only, and only the photo
    // paths it serves. No wildcard hostnames.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
        pathname: "/photos/**",
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
