// File: app/api/admin/post/[id]/categories/route.ts (DASHBOARD)
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET: lấy tất cả categories + categories đã gắn cho post (cho dialog)
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const postId = Number(id)

    const [allCategories, postCategories] = await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.postCategory.findMany({ where: { postId } }) // không cần include
    ])

    return NextResponse.json({
      allCategories,
      selectedIds: postCategories.map((pc) => pc.categoryId),
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// PUT: cập nhật toàn bộ categories cho post (KHÔNG publish)
// Dùng cho nút "Edit"
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const postId = Number(id)
    const { categoryIds } = await req.json()
    if (!Array.isArray(categoryIds)) {
      return NextResponse.json({ error: "categoryIds[] required" }, { status: 400 })
    }

    // clear & insert
    await prisma.$transaction([
        prisma.postCategory.deleteMany({ where: { postId } }),
        prisma.postCategory.createMany({
            data: categoryIds.map((cid: number) => ({ postId, categoryId: cid })),
        })
    ])

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: xoá 1 category khỏi post
// (API này code của bạn có, nhưng dialog của bạn không dùng)
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const postId = Number(id)
    const { searchParams } = new URL(req.url)
    const categoryId = Number(searchParams.get("categoryId"))
    if (!categoryId) return NextResponse.json({ error: "categoryId required" }, { status: 400 })

    await prisma.postCategory.delete({
      where: { postId_categoryId: { postId, categoryId } }
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}