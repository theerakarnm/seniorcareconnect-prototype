import type { NextRequest } from "next/server";
import { getSession } from "~/auth/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes and required roles
  const protectedRoutes = {
    "/admin": ["admin"],
    "/supplier": ["supplier", "admin"],
    "/api/admin": ["admin"],
    "/api/supplier": ["supplier", "admin"],
  };

  // Check if current path matches any protected route patterns
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    const session = await getSession();

    if (!session?.user) {
      // Redirect to login if no session
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return Response.redirect(loginUrl);
    }

    // Check if user has required role for this route
    const requiredRoles = Object.entries(protectedRoutes).find(([route]) =>
      pathname.startsWith(route)
    )?.[1];

    if (requiredRoles && !requiredRoles.includes(session.user.role)) {
      // Redirect to unauthorized page if user doesn't have required role
      return Response.redirect(new URL("/unauthorized", request.url));
    }
  }

  return undefined;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/supplier/:path*",
    "/api/admin/:path*",
    "/api/supplier/:path*",
  ],
  runtime: "nodejs",
};