import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const searchTerms = [
  "software developer",
  "software engineer",
  "product designer",
  "ux designer",
  "data analyst",
  "data scientist",
  "marketing manager",
  "project manager",
  "customer service",
  "sales executive",
  "accountant",
  "hr manager",
  "graphic designer",
  "operations manager",
  "business analyst",
  "devops engineer",
];

type AdzunaJob = {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
};

async function runSync() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return NextResponse.json(
      { error: "Adzuna credentials not configured" },
      { status: 500 }
    );
  }

  let totalInserted = 0;
  let totalSkipped = 0;

  for (const term of searchTerms) {
    const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=15&what=${encodeURIComponent(
      term
    )}&content-type=application/json`;

    const res = await fetch(url);
    if (!res.ok) continue;

    const data = await res.json();
    const jobs: AdzunaJob[] = data.results ?? [];

    for (const job of jobs) {
      const existing = await prisma.job.findFirst({
        where: { title: job.title, company: job.company?.display_name },
      });

      if (existing) {
        totalSkipped++;
        continue;
      }

      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company?.display_name ?? "Unknown",
          location: job.location?.display_name ?? null,
          description: job.description,
          url: job.redirect_url ?? null,
        },
      });
      totalInserted++;
    }
  }

  return NextResponse.json({
    message: "Jobs synced",
    inserted: totalInserted,
    skippedDuplicates: totalSkipped,
  });
}

function isAuthorized(request: Request): boolean {
  const authHeader = request.headers.get("authorization");
  return authHeader === `Bearer ${process.env.CRON_SECRET}`;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync();
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return runSync();
}
