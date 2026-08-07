import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

export function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const h = response.headers;

  // Content Security Policy
  h.set(
    "Content-Security-Policy",
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

  // XSS protection
  h.set("X-XSS-Protection", "1; mode=block");

  // DNS prefetch
  h.set("X-DNS-Prefetch-Control", "on");

  // Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const rl = rateLimit(`api:${ip}`, 30, 60 * 1000);

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
