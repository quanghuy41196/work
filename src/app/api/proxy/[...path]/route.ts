import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/utils/logger";
import { withProxyRateLimit } from "@/utils/apiMiddleware";

const BACKEND_URL = process.env.BACKEND_API_URL;

if (!BACKEND_URL) {
  throw new Error("BACKEND_API_URL is not defined in environment variables.");
}

// Validate the backend host once at startup so we can compare at request time.
const BACKEND_HOST = new URL(BACKEND_URL).host;

// ── PATH SECURITY ────────────────────────────────────────────────────────────

// Only allow paths that consist of safe URL characters.
// Blocks path traversal (../, %2e%2e), null bytes, and protocol injection.
const SAFE_PATH_RE = /^[a-zA-Z0-9/_\-=.~%]+$/;

/**
 * Returns a sanitized rewritten path, or null if the path is unsafe.
 * The proxy only accepts paths under /api/v1/*, /uploaded-files/*, and /storage/*.
 */
function sanitizePath(rawPath: string): string | null {
  // Decode percent-encoding so we catch encoded traversal sequences (%2e%2e).
  let decoded: string;
  try {
    decoded = decodeURIComponent(rawPath);
  } catch {
    return null; // malformed percent-encoding
  }

  // Reject any traversal attempt
  if (decoded.includes("..") || decoded.includes("\0")) {
    return null;
  }

  // Only allow the character set we expect in API paths
  if (!SAFE_PATH_RE.test(rawPath)) {
    return null;
  }

  if (!rawPath) return null;

  // Route to the correct backend prefix
  if (rawPath.startsWith("/uploaded-files") || rawPath.startsWith("/storage")) {
    return rawPath;
  }

  return `/api/v1${rawPath}`;
}

// ── HANDLER ──────────────────────────────────────────────────────────────────

async function handler(req: NextRequest) {
  const originalPath = req.nextUrl.pathname;
  const rawPath = originalPath.replace(/^\/api\/proxy/, "");

  const rewrittenPath = sanitizePath(rawPath);

  if (!rewrittenPath) {
    logger.securityEvent("Proxy blocked unsafe path", undefined, originalPath);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let targetUrl: URL;
  try {
    targetUrl = new URL(rewrittenPath, BACKEND_URL);
    targetUrl.search = req.nextUrl.search;
  } catch {
    return NextResponse.json({ error: "Invalid target path" }, { status: 400 });
  }

  // Guard: ensure the resolved URL still points to the configured backend host.
  // This catches edge cases where URL parsing could redirect to a different host.
  if (targetUrl.host !== BACKEND_HOST) {
    logger.securityEvent("Proxy host mismatch blocked", undefined, targetUrl.host);
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  logger.debug(
    `Proxy ${req.method} ${originalPath} -> ${targetUrl.toString()}`,
    undefined,
    "API Proxy"
  );

  // Forward only the headers the backend needs. Forwarding all client headers
  // risks leaking X-Admin, X-Internal-*, or attacker-controlled headers that
  // the backend might trust. Extend this list when your backend requires more.
  const FORWARDED_HEADERS = new Set([
    'accept',
    'accept-encoding',
    'accept-language',
    'authorization',    // will be overwritten with the session token below
    'content-length',
    'content-type',
    'cookie',
    'if-modified-since',
    'if-none-match',
    'range',
    'x-request-id',
  ])

  const headers = new Headers()
  for (const [key] of req.headers) {
    if (FORWARDED_HEADERS.has(key.toLowerCase())) {
      headers.set(key, req.headers.get(key)!)
    }
  }
  // Append real client IP so the backend can log/rate-limit correctly
  headers.set('x-forwarded-for', req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown')

  const nextAuthToken = await getToken({ req, secret: process.env.AUTH_SECRET });
  if (nextAuthToken?.accessToken) {
    const accessToken = nextAuthToken.accessToken;
    const token =
      typeof accessToken === "string"
        ? accessToken
        : (accessToken as { value?: string })?.value ?? "";
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  try {
    const backendResponse = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body: req.body,
      // Node 18+ fetch requires duplex when body is a ReadableStream
      // @ts-expect-error: duplex is valid in Node fetch but absent from TS lib types
      duplex: "half",
      cache: "no-store",
    });

    // new Headers() already copies all headers including set-cookie.
    // Do not manually append set-cookie — that would duplicate it.
    const responseHeaders = new Headers(backendResponse.headers);

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    logger.error(
      `Proxy failed for ${targetUrl.toString()}`,
      { error: error instanceof Error ? error.message : String(error) },
      "API Proxy"
    );
    return NextResponse.json(
      { error: "Proxy request to backend failed." },
      { status: 502 }
    );
  }
}

const rateLimitedHandler = withProxyRateLimit(handler)

export {
  rateLimitedHandler as DELETE,
  rateLimitedHandler as GET,
  rateLimitedHandler as PATCH,
  rateLimitedHandler as POST,
  rateLimitedHandler as PUT,
};
