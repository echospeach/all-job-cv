import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { userId, title, content } = body;

  if (!userId || !title || !content) {
    return NextResponse.json(
      { error: "userId, title, and content are required" },
      { status: 400 }
    );
  }

  const cv = await prisma.cv.create({
    data: { userId, title, content },
  });

  return NextResponse.json(cv, { status: 201 });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  const cvs = await prisma.cv.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(cvs);
}
