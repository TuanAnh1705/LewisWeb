import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const { name, position, imageUrl } = await req.json();
  const updated = await prisma.aboutUsRepresentative.update({
    where: { id },
    data: { name, position, imageUrl },
  });
  return NextResponse.json(updated);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  await prisma.aboutUsRepresentative.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
