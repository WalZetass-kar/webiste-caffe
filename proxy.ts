import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { canAccessPath, getDefaultRouteForRole, normalizeUserRole } from "@/lib/auth/roles";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const role = normalizeUserRole(request.cookies.get("cafeflow-role")?.value);

  if (canAccessPath(role, pathname)) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(getDefaultRouteForRole(role), request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|icons|uploads).*)"],
};
