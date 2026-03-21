import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Map role → default dashboard path */
const ROLE_DASHBOARD: Record<string, string> = {
  ADMIN: "/dashboard/admin",
  USER: "/dashboard/user",
  FIELD_OFFICER: "/dashboard/field-officer",
  VERIFIER: "/dashboard/verifier",
  BUYER: "/dashboard/buyer",
};

/** Paths that require authentication */
const PROTECTED_PREFIXES = ["/dashboard"];

/** Paths that authenticated users should NOT visit */
const AUTH_PAGES = ["/signin", "/signup"];

function decodeJwtPayload(token: string) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8"),
    );
    return payload;
  } catch {
    return null;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get("user")?.value;
  const { pathname } = request.nextUrl;

  const payload = token ? decodeJwtPayload(token) : null;
  const isAuthenticated = !!payload?.id;
  const role: string | undefined = payload?.role;

  // ── Protect /dashboard routes ───────────────────────────
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // ── Redirect authenticated users away from auth pages ───
  if (isAuthenticated && AUTH_PAGES.some((p) => pathname.startsWith(p))) {
    const dest = ROLE_DASHBOARD[role ?? ""] ?? "/dashboard/user";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  // ── Prevent users from accessing dashboards they don't own ──
  if (isAuthenticated && isProtected && role) {
    const allowed = ROLE_DASHBOARD[role];
    if (allowed && !pathname.startsWith(allowed)) {
      return NextResponse.redirect(new URL(allowed, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup"],
};
