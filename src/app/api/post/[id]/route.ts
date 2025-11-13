// File: app/api/post/[id]/route.ts (Dashboard)

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// ✅ THÊM FUNCTION NÀY - Handle CORS preflight
export async function OPTIONS(req: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const postId = Number(id)

    if (isNaN(postId)) {
      return NextResponse.json(
        { error: "Invalid ID" },
        {
          status: 400,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    const post = await prisma.blogPost.findFirst({
      where: {
        id: postId,
        isPublishedOnNextjs: true
      },
      include: {
        images: true,
        categories: { include: { category: true } }
      }
    })

    if (!post) {
      return NextResponse.json(
        { error: "Post not found" },
        {
          status: 404,
          headers: {
            'Access-Control-Allow-Origin': '*',
          },
        }
      )
    }

    // ✅ THÊM CORS HEADERS VÀO RESPONSE
    return NextResponse.json(
      { post },
      {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
}