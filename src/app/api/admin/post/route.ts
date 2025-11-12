// File: app/api/admin/post/route.ts (DASHBOARD)
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// API này lấy TẤT CẢ bài (đã duyệt và chưa duyệt) cho TRANG ADMIN
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const perPage = parseInt(searchParams.get("per_page") || "10")

    // Logic `Promise.all` của bạn rất tốt
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        orderBy: { wpCreatedAt: "desc" },
        skip: (page - 1) * perPage,
        take: perPage,
        include: { categories: { include: { category: true } } }, // Gửi kèm categories
      }),
      prisma.blogPost.count(), // Đếm tổng số post
    ])

    return NextResponse.json({ posts, totalPages: Math.ceil(total / perPage) })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}