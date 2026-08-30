import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { jobId, cvId } = body;

  const application = await prisma.application.upsert({
    where: { userId_jobId: { userId: session.user.id!, jobId } },
    update: {},
    create: { userId: session.user.id!, jobId, cvId: cvId ?? null },
  });

  return NextResponse.json(application, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { jobId } = body;

  await prisma.application.deleteMany({
    where: { userId: session.user.id!, jobId },
  });

  return NextResponse.json({ ok: true });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id! },
    include: { job: true },
    orderBy: { appliedAt: "desc" },
  });

  return NextResponse.json(applications);
}
