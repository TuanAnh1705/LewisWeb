// File: app/admin/preview/[id]/page.tsx (DASHBOARD)
// (Trang này chạy trên server của Dashboard, nên được phép dùng Prisma)
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"

interface PreviewPageProps {
  params: { id: string }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { id } = params
  const postId = Number(id)

  if (isNaN(postId)) return notFound()

  const post = await prisma.blogPost.findUnique({
    where: { id: postId },
    include: { images: true },
  })

  if (!post) {
    return notFound()
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {/* Cover Image trước */}
      {post.coverImage && (
        <div className="mb-6">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-80 object-cover rounded-xl shadow"
          />
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold mb-6">{post.title}</h1>

      {/* Nội dung giữ nguyên */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </div>
  )
}