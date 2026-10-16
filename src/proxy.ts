import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { rateLimit } from "@/lib/rate-limit";

// Malicious scanner tools to block via User-Agent
const BLOCKED_USER_AGENTS = [
  "sqlmap",
  "nikto",
  "masscan",
  "wpscan",
  "acunetix",
  "dirbuster",
  "nmap",
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  "../",
  "..\\",
  "..%2f",
  "..%5c",
];

// Sensitive files and probe paths
const SENSITIVE_PROBE_PATTERNS = [
  ".env",
  "/.git",
  "/.svn",
  ".bak",
  ".sql",
  "wp-admin",
  "wp-login",
  "xmlrpc.php",
  "phpinfo",
  "/etc/passwd",
  "config.json",
];

// Injection attack signatures in URL / query
const INJECTION_PATTERNS = [
  "<script",
  "javascript:",
  "union select",
  "union+select",
  "concat(",
];

// Query parameter keys commonly exploited for open redirect attacks
const REDIRECT_KEYS = new Set([
  "redirect",
  "url",
  "next",
  "returnto",
  "return_to",
]);

/**
 * Safely decodes a URL string, handling single or double encoding and falling back gracefully.
 */
function safeDecode(input: string): string {
  let decoded = input;
  try {
    decoded = decodeURIComponent(input);
    try {
      decoded = decodeURIComponent(decoded);
    } catch {
      // Ignore secondary decode error
    }
  } catch {
    // Ignore primary decode error
  }
  return decoded.toLowerCase();
}

/**
 * Checks if target string contains any pattern from the provided list.
 */
function matchesAny(target: string, patterns: string[]): boolean {
  const lower = target.toLowerCase();
  return patterns.some((pattern) => lower.includes(pattern.toLowerCase()));
}

/**
 * Checks if a target pathname and search query match malicious scanner, traversal, or injection patterns.
 */
function isMaliciousPattern(pathname: string, search: string): boolean {
  const decodedPath = safeDecode(pathname);
  const decodedFull = safeDecode(pathname + search);
  return (
    matchesAny(decodedPath, SENSITIVE_PROBE_PATTERNS) ||
    matchesAny(decodedFull, PATH_TRAVERSAL_PATTERNS) ||
    matchesAny(decodedFull, INJECTION_PATTERNS)
  );
}

/**
 * Validates redirect parameters to prevent open redirect phishing bounces.
 * Returns true if the target points to an unverified external origin.
 */
function isExternalUnverifiedRedirect(rawTarget: string, requestOrigin: string): boolean {
  if (!rawTarget) return false;

  const target = rawTarget.trim();
  if (!target) return false;

  let decoded = target;
  try {
    decoded = decodeURIComponent(target).trim();
  } catch {
    // Malformed encoding in redirect parameter
    return true;
  }

  // Block protocol-relative or backslash evasions (e.g., //evil.com, /\\evil.com, \\evil.com)
  if (
    target.startsWith("//") ||
    target.startsWith("/\\") ||
    target.startsWith("\\") ||
    decoded.startsWith("//") ||
    decoded.startsWith("/\\") ||
    decoded.startsWith("\\")
  ) {
    return true;
  }

  // Check for explicit scheme: http:, https:, javascript:, data:, etc.
  const hasScheme =
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(target) ||
    /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(decoded);

  if (hasScheme) {
    try {
      const parsed = new URL(decoded, requestOrigin);
      // Reject non-http(s) schemes like javascript: or data:
      if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
        return true;
      }

      let reqHost = "";
      try {
        reqHost = new URL(requestOrigin).hostname.toLowerCase();
      } catch {
        reqHost = "autovaly.com";
      }

      const parsedHost = parsed.hostname.toLowerCase();
      const isAllowedHost =
        parsedHost === reqHost ||
        parsedHost === "autovaly.com" ||
        parsedHost === "www.autovaly.com" ||
        parsedHost === "localhost" ||
        parsedHost === "127.0.0.1" ||
        parsedHost.endsWith(".autovaly.com");

      if (!isAllowedHost) {
        return true;
      }
      return false;
    } catch {
      return true;
    }
  }

  // Relative paths are safe if they start with a single "/"
  if (
    target.startsWith("/") &&
    !target.startsWith("//") &&
    decoded.startsWith("/") &&
    !decoded.startsWith("//")
  ) {
    return false;
  }

  // Any non-relative path that doesn't start with "/" is considered unverified
  return true;
}

/**
 * Extracts client IP address safely from request headers.
 */
function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

export function proxy(request: NextRequest) {
  // 1. User-Agent Malicious Scanner Blocking
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
  if (BLOCKED_USER_AGENTS.some((scanner) => userAgent.includes(scanner))) {
    return new NextResponse("Access Denied: Malicious request blocked by Autovaly Shield", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // 2. Exploit, Traversal & Sensitive File Probe Blocking (WAF Layer)
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search;

  if (isMaliciousPattern(pathname, search)) {
    return new NextResponse("Access Denied: Malicious request blocked by Autovaly Shield", {
      status: 403,
      headers: {
        "Content-Type": "text/plain",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }

  // 3. Open Redirect Guard
  for (const [key, value] of request.nextUrl.searchParams.entries()) {
    if (REDIRECT_KEYS.has(key.toLowerCase())) {
      if (isExternalUnverifiedRedirect(value, request.nextUrl.origin)) {
        return new NextResponse("Access Denied: Invalid redirect target blocked by Autovaly Shield", {
          status: 400,
          headers: {
            "Content-Type": "text/plain",
            "X-Robots-Tag": "noindex, nofollow",
          },
        });
      }
    }
  }

  // 4. Rate Limiting for API routes (30 req / min)
  if (pathname.startsWith("/api/")) {
    const ip = getClientIp(request);
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

  // 5. Rate Limiting for search routes (60 req / min)
  if (pathname.startsWith("/search")) {
    const ip = getClientIp(request);
    const rl = rateLimit(`search:${ip}`, 60, 60 * 1000);

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

  // 6. Security Headers
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
      "connect-src 'self' https://api.web3forms.com https://formspree.io https://*.sanity.io https://*.api.sanity.io https://cdn.sanity.io; " +
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

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
