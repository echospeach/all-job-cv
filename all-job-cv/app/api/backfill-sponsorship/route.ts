import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const sponsorshipKeywords = [
  "visa sponsorship",
  "sponsor visa",
  "sponsorship available",
  "sponsorship license",
  "sponsorship licence",
  "skilled worker visa",
  "will sponsor",
  "visa sponsor",
  "h-1b",
  "h1b sponsorship",
  "relocation and visa",
];

function detectSponsorship(description: string): boolean {
  const lower = description.toLowerCase();
  return sponsorshipKeywords.some((kw) => lower.includes(kw));
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
