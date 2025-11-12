// File: app/api/admin/post/[id]/route.ts (DASHBOARD)
// (Đây là file MỚI để xử lý DELETE)

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// DELETE: Xóa vĩnh viễn một bài viết
export async function DELETE(
  req: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params
    const postId = Number(id)

    if (isNaN(postId)) {
      return NextResponse.json({ error: "Invalid Post ID" }, { status: 400 })
    }

    // Nhờ có `onDelete: Cascade` trong schema,
    // lệnh này sẽ tự động xóa `BlogImage` và `PostCategory` liên quan
    await prisma.blogPost.delete({
      where: { id: postId },
    })

    return NextResponse.json({ success: true, message: "Post deleted permanently" })
  } catch (err: any) {
    // Xử lý lỗi nếu không tìm thấy post để xóa
    if (err.code === 'P2025') {
       return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}