// File: app/api/admin/post/[id]/reapprove/route.ts (DASHBOARD)
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// API này HỦY DUYỆT (unpublish) và XÓA 1 CATEGORY
// Dùng cho nút "Restore"
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const postId = Number(id)
    const { categoryId } = await req.json()

    if (!postId || !categoryId) {
      return NextResponse.json({ error: "postId & categoryId required" }, { status: 400 })
    }

    // Dùng transaction
    const [_, post] = await prisma.$transaction([
        // 1. Xóa liên kết post - category
        prisma.postCategory.deleteMany({
            where: { postId, categoryId }
        }),

        // 2. Update trạng thái publish = false
        prisma.blogPost.update({
            where: { id: postId },
            data: { isPublishedOnNextjs: false },
        })
    ])

    return NextResponse.json({ success: true, post })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}