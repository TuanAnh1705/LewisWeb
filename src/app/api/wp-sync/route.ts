// File: app/api/wp-sync/route.ts (DASHBOARD)
import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import he from "he"

function extractImagesFromContent(html: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g
  const urls: string[] = []
  let match
  while ((match = imgRegex.exec(html)) !== null) {
    urls.push(match[1])
  }
  return urls
}

export async function GET(req: NextRequest) {
  try {
    const wpUrl = process.env.WP_BASE_URL
    const user = process.env.WP_USER
    const appPassword = process.env.WP_APP_PASSWORD
    const token = Buffer.from(`${user}:${appPassword}`).toString("base64")

    const { searchParams } = new URL(req.url)
    const full = searchParams.get("full") === "true"

    if (full) {
      // Yêu cầu của bạn: Reset ID
      // Dùng TRUNCATE an toàn hơn
      await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 0;`);
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE PostCategory;`);
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE BlogImage;`);
      await prisma.$executeRawUnsafe(`TRUNCATE TABLE BlogPost;`);
      // Bạn cũng có thể TRUNCATE Category, User... nếu muốn
      await prisma.$executeRawUnsafe(`SET FOREIGN_KEY_CHECKS = 1;`);
    }

    let page = 1
    const perPage = 50
    let imported = 0

    while (true) {
      const res = await fetch(
        `${wpUrl}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&status=any&_embed`,
        { headers: { Authorization: `Basic ${token}` } }
      )
      if (res.status === 400 || res.status === 404) break
      if (!res.ok) throw new Error(`Failed to fetch WP posts: ${res.status}`)

      const posts = await res.json()
      if (!posts.length) break

      for (const post of posts) {
        const cover = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null
        const contentHtml = post.content?.rendered || ""
        const images = extractImagesFromContent(contentHtml)
        const decodedTitle = he.decode(post.title?.rendered || "")

        const saved = await prisma.blogPost.upsert({
          where: { wpId: post.id },
          update: {
            title: decodedTitle,
            slug: post.slug,
            contentHtml,
            coverImage: cover,
            wpStatus: post.status,
            wpCreatedAt: new Date(post.date),
          },
          create: {
            wpId: post.id,
            title: decodedTitle,
            slug: post.slug,
            contentHtml,
            coverImage: cover,
            wpStatus: post.status,
            wpCreatedAt: new Date(post.date),
            // isPublishedOnNextjs sẽ là false (mặc định)
          },
        })

        await prisma.blogImage.deleteMany({ where: { postId: saved.id } })
        if (images.length > 0) {
          await prisma.blogImage.createMany({
            data: images.map(url => ({ url, postId: saved.id }))
          })
        }
        imported++
      }
      page++
    }
    return NextResponse.json({ success: true, imported })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}