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
      "img-src 'self' data: https: https://cdn.sanity.io; " +
      "connect-src 'self' https://formspree.io https://*.sanity.io https://*.api.sanity.io https://cdn.sanity.io; " +
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

  // XSS protection (modern)
  h.set("X-XSS-Protection", "0");

  // DNS prefetch
  h.set("X-DNS-Prefetch-Control", "on");

  // Rate Limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";
    const rl = rateLimit(`api:${ip}`, 30, 60 * 1000);

    if (!rl.success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": Math.ceil((rl.resetAt - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": rl.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": Math.ceil(rl.resetAt / 1000).toString(),
          },
        }
      );
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
