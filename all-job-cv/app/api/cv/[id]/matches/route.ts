import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { matchJobsForCv } from "@/app/lib/matchJobs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const cv = await prisma.cv.findUnique({ where: { id } });

  if (!cv || cv.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const jobs = await prisma.job.findMany();
  const matches = await matchJobsForCv(cv.content as any, jobs);

  return NextResponse.json(matches);
}
