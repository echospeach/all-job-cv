import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

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

  return NextResponse.json(jobs);
}
