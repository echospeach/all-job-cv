import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, content, template } = body;

  const cv = await prisma.cv.update({
    where: { id },
    data: { title, content, template },
  });

  return NextResponse.json(cv);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await prisma.cv.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
