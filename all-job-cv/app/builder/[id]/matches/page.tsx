import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { matchJobsForCv } from "@/app/lib/matchJobs";

export default async function MatchesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { id } = await params;
  const cv = await prisma.cv.findUnique({ where: { id } });
  if (!cv || cv.userId !== session.user.id) notFound();

  const jobs = await prisma.job.findMany();
  const matches = await matchJobsForCv(cv.content as any, jobs);

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Job matches
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-[#202A3C]">
          Matches for {cv.title}
        </h1>
        <Link href={`/builder/${cv.id}`} className="text-sm text-[#8B8578] hover:underline">
          ← Back to CV
        </Link>

        <div className="mt-8 space-y-3">
          {matches.map((m) => (
            <div key={m.job.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[#202A3C]">{m.job.title}</p>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
