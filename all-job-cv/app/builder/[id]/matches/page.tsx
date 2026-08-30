import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { matchJobsForCv, type JobMatch } from "@/app/lib/matchJobs";

const CACHE_HOURS = 6;

export default async function MatchesPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ refresh?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { id } = await params;
  const { refresh } = await searchParams;
  const cv = await prisma.cv.findUnique({ where: { id } });
  if (!cv || cv.userId !== session.user.id) notFound();

  const isStale =
    !cv.matchesAt ||
    Date.now() - new Date(cv.matchesAt).getTime() > CACHE_HOURS * 60 * 60 * 1000;

  let matches: JobMatch[];

  if (cv.matches && !isStale && refresh !== "1") {
    matches = cv.matches as unknown as JobMatch[];
  } else {
    const jobs = await prisma.job.findMany();
    matches = await matchJobsForCv(cv.content as any, jobs);
    await prisma.cv.update({
      where: { id: cv.id },
      data: { matches: matches as any, matchesAt: new Date() },
    });
  }

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
            href={`/builder/${cv.id}/matches?refresh=1`}
            className="text-sm font-medium text-[#3F6C51] hover:underline"
          >
            Refresh matches
          </Link>
        </div>
        <Link href={`/builder/${cv.id}`} className="text-sm text-[#8B8578] hover:underline">
          ← Back to CV
        </Link>

        <div className="mt-8 space-y-3">
          {matches.map((m) => (
            <div key={m.job.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  
                    href={m.job.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[15px] font-semibold text-[#202A3C] hover:underline"
                  >
                    {m.job.title}
                  </a>
                  <p className="text-sm text-[#8B8578]">
                    {m.job.company}
                    {m.job.location ? ` · ${m.job.location}` : ""}
                  </p>
                </div>
                <span className="rounded-full bg-[#3F6C51] px-3 py-1 text-xs font-medium text-white">
                  {m.score}% match
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5A52]">{m.reason}</p>
              {m.job.url && (
                
                  href={m.job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block rounded-lg bg-[#202A3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C3B52]"
                >
                  View & apply →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
