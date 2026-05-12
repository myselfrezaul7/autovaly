import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const h = response.headers;

  // Content Security Policy
  h.set("Content-Security-Policy",
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
    "font-src 'self' https://fonts.gstatic.com; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://formspree.io; " +
    "frame-ancestors 'none';"
  );

  // Anti-clickjacking / anti-phishing
  h.set("X-Frame-Options", "DENY");

  // Prevent MIME sniffing
  h.set("X-Content-Type-Options", "nosniff");

  // Referrer policy
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // Restrict browser features
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");

  // Force HTTPS
  h.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");

  // XSS protection (legacy browsers)
  h.set("X-XSS-Protection", "1; mode=block");

  // DNS prefetch
  h.set("X-DNS-Prefetch-Control", "on");

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
