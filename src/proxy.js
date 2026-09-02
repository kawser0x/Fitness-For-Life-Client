import { NextResponse } from "next/server";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Protect all /dashboard and /payment routes
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/payment")) {
    const token =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token") ||
      request.cookies.get("better-auth.session");

    // If no active session cookie found, redirect unauthenticated user directly to /unauthorized
    if (!token) {
      const unauthorizedUrl = new URL("/unauthorized", request.url);
      return NextResponse.redirect(unauthorizedUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*"],
};
