import { notFound } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";
import { matchJobsForCv, type JobMatch } from "@/app/lib/matchJobs";
import { checkRateLimit } from "@/app/lib/rateLimit";
import ApplyButton from "./ApplyButton";
import FeedbackWidget from "@/app/components/FeedbackWidget";

const CACHE_HOURS = 6;

export default async function MatchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refresh?: string }>;
}) {
  const sessionUser = await requireUser();

  const { id } = await params;
  const { refresh } = await searchParams;
  const cv = await prisma.cv.findUnique({ where: { id } });
  if (!cv || cv.userId !== sessionUser.id) notFound();

  const isStale =
    !cv.matchesAt ||
    Date.now() - new Date(cv.matchesAt).getTime() > CACHE_HOURS * 60 * 60 * 1000;

  let matches: JobMatch[];
  let rateLimited = false;

  if (cv.matches && !isStale && refresh !== "1") {
    matches = cv.matches as unknown as JobMatch[];
  } else {
    const { allowed } = await checkRateLimit(`matches-refresh:${sessionUser.id}`, 10, 60 * 60);

    if (!allowed) {
      rateLimited = true;
      matches = cv.matches ? (cv.matches as unknown as JobMatch[]) : [];
    } else {
      const jobs = await prisma.job.findMany();
      matches = await matchJobsForCv(cv.content as any, jobs);
      await prisma.cv.update({
        where: { id: cv.id },
        data: { matches: matches as any, matchesAt: new Date() },
      });
    }
  }

  const applications = await prisma.application.findMany({
    where: { userId: sessionUser.id },
  });
  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Job matches
        </p>
        <div className="mb-1 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-[#202A3C]">
            Matches for {cv.title}
          </h1>
          <Link
            href={"/builder/" + cv.id + "/matches?refresh=1"}
            className="text-sm font-medium text-[#3F6C51] hover:underline"
          >
            Refresh matches
          </Link>
        </div>
        <Link href={"/builder/" + cv.id} className="text-sm text-[#8B8578] hover:underline">
          Back to CV
        </Link>

        {rateLimited && (
          <div className="mt-4 rounded-lg border border-[#D97757]/30 bg-[#FBEDE7] px-4 py-3 text-sm text-[#993C1D]">
            You have refreshed matches a lot recently. Showing your last saved results - try again in a bit.
          </div>
        )}

        <div className="mt-8 space-y-3">
          {matches.map((m) => (
            <div key={m.job.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <a href={m.job.url || "#"} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-[#202A3C] hover:underline">
                    {m.job.title}
                  </a>
                  <p className="text-sm text-[#8B8578]">
                    {m.job.company}
                    {m.job.location ? " - " + m.job.location : ""}
                  </p>
                </div>
                <span className="rounded-full bg-[#3F6C51] px-3 py-1 text-xs font-medium text-white">
                  {m.score}% match
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5A52]">{m.reason}</p>
              {m.job.url && (
                <a href={m.job.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-lg bg-[#202A3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C3B52]">
                  View and apply
                </a>
              )}
              <ApplyButton jobId={m.job.id} cvId={cv.id} initiallyApplied={appliedJobIds.has(m.job.id)} />
            </div>
          ))}
        </div>

        <div className="mt-8">
          <FeedbackWidget context="job_matches" prompt="Were these matches useful?" />
        </div>
      </div>
    </div>
  );
}
