// File: app/api/approve-post/route.ts (DASHBOARD)
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// API này DUYỆT BÀI và GÁN CATEGORIES
export async function POST(req: NextRequest) {
  try {
    const { id, categoryIds } = await req.json()
    const postId = Number(id)

    if (isNaN(postId) || !Array.isArray(categoryIds)) {
      return NextResponse.json({ error: "id (number) và categoryIds[] là bắt buộc" }, { status: 400 })
    }

    // Dùng transaction
    const [_, post] = await prisma.$transaction([
      // 1. Xoá hết categories cũ
      prisma.postCategory.deleteMany({ where: { postId } }),
      
      // 2. Gắn categories mới
      prisma.postCategory.createMany({
        data: categoryIds.map((cid: number) => ({
          postId,
          categoryId: Number(cid),
        })),
      }),

      // 3. Cập nhật trạng thái publish
      prisma.blogPost.update({
        where: { id: postId },
        data: { isPublishedOnNextjs: true },
        include: { categories: { include: { category: true } } },
      })
    ])

    return NextResponse.json({ success: true, post })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}