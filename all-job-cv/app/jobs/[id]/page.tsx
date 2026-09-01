import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { countries } from "@/app/lib/countries";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/signin?callbackUrl=/jobs/${id}`);
  }

  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  const countryLabel = countries.find((c) => c.code === job.country)?.label || job.country.toUpperCase();

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/jobs" className="text-sm text-[#8B8578] hover:underline">
          Back to search
        </Link>

        <div className="mt-4 rounded-lg border border-[#D8D3C8] bg-white p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-xl font-semibold text-[#202A3C]">{job.title}</h1>
              <p className="mt-1 text-sm text-[#8B8578]">
                {job.company}
                {job.location ? ` - ${job.location}` : ""} - {countryLabel}
              </p>
            </div>
            {job.sponsorsVisa && (
              <span className="shrink-0 rounded-full bg-[#EAF3DE] px-2.5 py-1 text-xs font-medium text-[#3F6C51]">
                May sponsor visa
              </span>
            )}
          </div>

          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-[#3A3833]">
            {job.description}
          </p>

          {job.url ? (
            <a href={job.url} target="_blank" rel="noopener noreferrer" className="mt-6 inline-block rounded-lg bg-[#3F6C51] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#345A44]">
              View and apply
            </a>
          ) : (
            <p className="mt-6 text-sm text-[#8B8578]">
              No external application link is available for this listing.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
