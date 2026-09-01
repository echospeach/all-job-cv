import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const searchTerms = [
  "visa sponsorship",
  "sponsorship available",
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

const countries = ["gb", "us", "ca", "au"];
const sponsorshipSearchTerms = new Set(["visa sponsorship", "sponsorship available"]);

// Jooble uses its own country codes for the "location" hint text, not ISO codes
const joobleLocationHints: Record<string, string> = {
  gb: "United Kingdom",
  us: "United States",
  ca: "Canada",
  au: "Australia",
};

type NormalizedJob = {
  title: string;
  company: string;
  location: string | null;
  description: string;
  url: string | null;
  country: string;
};

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

async function insertJob(job: NormalizedJob, isFromSponsorshipSearch: boolean) {
  const existing = await prisma.job.findFirst({
    where: { title: job.title, company: job.company, country: job.country },
  });
  if (existing) return false;

  await prisma.job.create({
    data: {
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      url: job.url,
      sponsorsVisa: isFromSponsorshipSearch || detectSponsorship(job.description),
      country: job.country,
    },
  });
  return true;
}

// --- Adzuna ---

type AdzunaJob = {
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
};

async function syncAdzuna(): Promise<{ inserted: number; skipped: number }> {
  const appId = process.env.ADZUNA_APP_ID;
  const appKey = process.env.ADZUNA_APP_KEY;
  if (!appId || !appKey) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  for (const country of countries) {
    for (const term of searchTerms) {
      const isFromSponsorshipSearch = sponsorshipSearchTerms.has(term);
      const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/1?app_id=${appId}&app_key=${appKey}&results_per_page=10&what=${encodeURIComponent(term)}&content-type=application/json`;

      const res = await fetch(url);
      if (!res.ok) continue;

      const data = await res.json();
      const jobs: AdzunaJob[] = data.results ?? [];

      for (const job of jobs) {
        const ok = await insertJob(
          {
            title: job.title,
            company: job.company?.display_name ?? "Unknown",
            location: job.location?.display_name ?? null,
            description: job.description,
            url: job.redirect_url ?? null,
            country,
          },
          isFromSponsorshipSearch
        );
        if (ok) inserted++; else skipped++;
      }
    }
  }

  return { inserted, skipped };
}

// --- Reed (UK only) ---

type ReedJob = {
  jobTitle: string;
  employerName: string;
  locationName: string;
  jobDescription: string;
  jobUrl: string;
};

async function syncReed(): Promise<{ inserted: number; skipped: number }> {
  const apiKey = process.env.REED_API_KEY;
  if (!apiKey) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;
  const auth = Buffer.from(`${apiKey}:`).toString("base64");

  for (const term of searchTerms) {
    const isFromSponsorshipSearch = sponsorshipSearchTerms.has(term);
    const url = `https://www.reed.co.uk/api/1.0/search?keywords=${encodeURIComponent(term)}&resultsToTake=10`;

    const res = await fetch(url, {
      headers: { Authorization: `Basic ${auth}` },
    });
    if (!res.ok) continue;

    const data = await res.json();
    const jobs: ReedJob[] = data.results ?? [];

    for (const job of jobs) {
      const ok = await insertJob(
        {
          title: job.jobTitle,
          company: job.employerName ?? "Unknown",
          location: job.locationName ?? null,
          description: job.jobDescription ?? "",
          url: job.jobUrl ?? null,
          country: "gb",
        },
        isFromSponsorshipSearch
      );
      if (ok) inserted++; else skipped++;
    }
  }

  return { inserted, skipped };
}

// --- Jooble ---

type JoobleJob = {
  title: string;
  company: string;
  location: string;
  snippet: string;
  link: string;
};

async function syncJooble(): Promise<{ inserted: number; skipped: number }> {
  const apiKey = process.env.JOOBLE_API_KEY;
  if (!apiKey) return { inserted: 0, skipped: 0 };

  let inserted = 0;
  let skipped = 0;

  for (const country of countries) {
    for (const term of searchTerms) {
      const isFromSponsorshipSearch = sponsorshipSearchTerms.has(term);
      const url = `https://jooble.org/api/${apiKey}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords: term, location: joobleLocationHints[country] }),
      });
      if (!res.ok) continue;

      const data = await res.json();
      const jobs: JoobleJob[] = data.jobs ?? [];

      for (const job of jobs.slice(0, 10)) {
        const ok = await insertJob(
          {
            title: job.title,
            company: job.company || "Unknown",
            location: job.location || null,
            description: job.snippet || "",
            url: job.link || null,
            country,
          },
          isFromSponsorshipSearch
        );
        if (ok) inserted++; else skipped++;
      }
    }
  }

  return { inserted, skipped };
}

async function runSync() {
  const [adzuna, reed, jooble] = await Promise.all([
    syncAdzuna(),
    syncReed(),
    syncJooble(),
  ]);

  return NextResponse.json({
    message: "Jobs synced",
    adzuna,
    reed,
    jooble,
    totalInserted: adzuna.inserted + reed.inserted + jooble.inserted,
  });
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
