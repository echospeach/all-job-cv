import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { auth } from "@/app/lib/auth";
import { keywordMatchScore } from "@/app/lib/keywordScore";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("q") || "";
  const location = searchParams.get("location") || "";
  const country = searchParams.get("country") || "";
  const sponsorship = searchParams.get("sponsorship") === "1";

  const jobs = await prisma.job.findMany({
    where: {
      AND: [
        keyword
          ? {
              OR: [
                { title: { contains: keyword, mode: "insensitive" } },
                { description: { contains: keyword, mode: "insensitive" } },
                { company: { contains: keyword, mode: "insensitive" } },
              ],
            }
          : {},
        location ? { location: { contains: location, mode: "insensitive" } } : {},
        country ? { country } : {},
        sponsorship ? { sponsorsVisa: true } : {},
      ],
    },
    orderBy: { createdAt: "desc" },
    take: 60,
  });

  const session = await auth();
  let latestCv: { content: unknown } | null = null;

  if (session?.user?.id) {
    latestCv = await prisma.cv.findFirst({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
      select: { content: true },
    });
  }

  if (!latestCv) {
    return NextResponse.json(jobs.map((j) => ({ ...j, matchScore: null })));
  }

  const withScores = jobs.map((job) => ({
    ...job,
    matchScore: keywordMatchScore(latestCv!.content as any, job),
  }));

  return NextResponse.json(withScores);
}
