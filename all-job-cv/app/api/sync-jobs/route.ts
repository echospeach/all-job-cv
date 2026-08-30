import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const searchTerms = [
  "software developer",
  "product designer",
  "data analyst",
  "marketing manager",
];

type AdzunaJob = {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
};

export async function POST() {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;

  if (!appId || !appKey) {
    return NextResponse.json(
      { error: "Adzuna credentials not configured" },
      { status: 500 }
    );
  }

  let totalInserted = 0;

  for (const term of searchTerms) {
    const url = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(
      term
    )}&content-type=application/json`;

    const res = await fetch(url);
    if (!res.ok) continue;

    const data = await res.json();
    const jobs: AdzunaJob[] = data.results ?? [];

    for (const job of jobs) {
      await prisma.job.create({
        data: {
          title: job.title,
          company: job.company?.display_name ?? "Unknown",
          location: job.location?.display_name ?? null,
          description: job.description,
        },
      });
      totalInserted++;
    }
  }

  return NextResponse.json({ message: "Jobs synced", count: totalInserted });
}
