import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const numId = Number(id); // ✅ Convert sang number
  const { name, position, imageUrl } = await req.json();
  
  const updated = await prisma.aboutUsRepresentative.update({
    where: { id: numId }, // ✅ Dùng numId
    data: { name, position, imageUrl },
  });
  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const numId = Number(id);
  
  await prisma.aboutUsRepresentative.delete({ where: { id: numId } });
  return NextResponse.json({ success: true });
}