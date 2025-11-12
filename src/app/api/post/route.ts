// File: app/api/post/route.ts (Bên dự án DASHBOARD)

import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

/**
 * Helper function để tạo excerpt
 * Nó sẽ xóa tag HTML và cắt chuỗi an toàn
 */
function createExcerpt(html: string, maxLength: number = 150) {
  if (!html) return "";
  // 1. Xóa tất cả tag HTML
  // 2. Thay thế nhiều khoảng trắng/ngắt dòng bằng 1 khoảng trắng
  // 3. Cắt chuỗi
  const text = html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  
  if (text.length <= maxLength) return text;
  
  // Cắt và thêm "..."
  return text.substring(0, maxLength) + "...";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const categoryId = searchParams.get("categoryId")

    // `where` này CHỈ LẤY BÀI ĐÃ PUBLISH
    const where: any = { isPublishedOnNextjs: true }

    if (categoryId) {
      where.categories = { some: { categoryId: Number(categoryId) } }
    }

    // 1. Dùng `include` để lấy dữ liệu thô (bao gồm cả categories)
    const postsData = await prisma.blogPost.findMany({
      where,
      orderBy: { wpCreatedAt: "desc" },
      include: { // Dùng `include` thay vì `select`
        categories: {
          include: {
            category: {
              select: { name: true } // Chỉ cần tên của category
            }
          }
        }
      }
    })

    // 2. Dùng `.map()` để *biến đổi* (transform) dữ liệu
    //    thành đúng định dạng mà Frontend (Client) mong đợi
    const posts = postsData.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      coverImage: post.coverImage,
      wpCreatedAt: post.wpCreatedAt,
      
      // === PHẦN SỬA LỖI CỦA BẠN ===

      // a. Tạo mảng string[] cho categories
      // Biến đổi từ [{ category: { name: "A" } }] thành ["A"]
      categories: post.categories.map(pc => pc.category.name),
      
      // b. Tạo excerpt từ contentHtml
      excerpt: createExcerpt(post.contentHtml, 150) // 150 là độ dài
    }));

    return NextResponse.json({ posts })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}