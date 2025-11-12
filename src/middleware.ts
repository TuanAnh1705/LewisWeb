import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/verify-edge";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Bỏ qua các trang public
  const publicPaths = ["/login", "/register", "/"];
  const isPublic = publicPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));

  if (!isPublic) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const ok = await verifyTokenEdge(token);
    if (!ok) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt)).*)',
  ],
};

