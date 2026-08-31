import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

function detectSponsorship(description: string): boolean {
  const lower = description.toLowerCase();
  const hasVisaWord = lower.includes("visa") || lower.includes("h-1b") || lower.includes("h1b");
  const hasSponsorWord = lower.includes("sponsor");
  return hasVisaWord && hasSponsorWord;
}

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const jobs = await prisma.job.findMany({
    where: { sponsorsVisa: false },
    select: { id: true, description: true },
  });

  let updated = 0;

  for (const job of jobs) {
    if (detectSponsorship(job.description)) {
      await prisma.job.update({
        where: { id: job.id },
        data: { sponsorsVisa: true },
      });
      updated++;
    }
  }

  return NextResponse.json({ checked: jobs.length, updated });
}
