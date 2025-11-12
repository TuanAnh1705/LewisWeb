// File: app/api/post/[id]/route.ts (Bên dự án DASHBOARD)

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// API này CHO CLIENT GỌI
export async function GET(
  req: Request, 
  { params }: { params: { id: string } }
) {
  try {
    const {id} = await params
    const postId = Number(id)
    if (isNaN(postId)) {
        return NextResponse.json({ error: "Invalid ID" }, { status: 400 })
    }

    const post = await prisma.blogPost.findFirst({
      where: { 
        id: postId,
        isPublishedOnNextjs: true // CHỈ LẤY BÀI ĐÃ DUYỆT
      },
      include: {
        images: true, // Lấy ảnh trong bài
        categories: { include: { category: true } } // Lấy categories
      }
    })

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }
    
    return NextResponse.json({ post }) // Trả về { post: ... }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}