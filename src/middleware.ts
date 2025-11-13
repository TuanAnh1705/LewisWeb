// middleware.ts (Dashboard)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyTokenEdge } from "@/lib/verify-edge";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // ✅ XỬ LÝ CORS CHO API ROUTES TRƯỚC
  if (pathname.startsWith('/api/')) {
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      })
    }

    // Add CORS headers to API responses
    const response = NextResponse.next()
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    return response
  }

  // XỬ LÝ AUTHENTICATION CHO CÁC TRANG KHÁC (code cũ của bạn)
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

// ✅ SỬA MATCHER ĐỂ BẮT API ROUTES
export const config = {
  matcher: [
    '/api/:path*', // Bắt tất cả API routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|txt)).*)',
  ],
};