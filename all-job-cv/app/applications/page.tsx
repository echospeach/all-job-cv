import { redirect } from "next/navigation";
import Link from "next/link";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";

export default async function ApplicationsPage() {
  const sessionUser = await requireUser();

  const applications = await prisma.application.findMany({
    where: { userId: sessionUser.id },
    include: { job: true },
    orderBy: { appliedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Your applications
        </p>
        <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">
          Applications ({applications.length})
        </h1>

        {applications.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D8D3C8] bg-white px-6 py-16 text-center">
            <p className="text-[15px] text-[#5C5A52]">
              You haven&apos;t marked any jobs as applied yet.
            </p>
            <Link
              href="/my-cvs"
              className="mt-4 inline-block text-sm font-medium text-[#3F6C51] hover:underline"
            >
              Go to your CVs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex items-center justify-between rounded-lg border border-[#D8D3C8] bg-white px-5 py-4"
              >
                <div>
                  {app.job.url ? (
                    <a href={app.job.url} target="_blank" rel="noopener noreferrer" className="text-[15px] font-semibold text-[#202A3C] hover:underline">
                      {app.job.title}
                    </a>
                  ) : (
                    <p className="text-[15px] font-semibold text-[#202A3C]">{app.job.title}</p>
                  )}
                  <p className="mt-0.5 text-sm text-[#8B8578]">
                    {app.job.company}
                    {app.job.location ? " - " + app.job.location : ""}
                  </p>
                  <p className="mt-0.5 text-xs text-[#8B8578]">
                    Applied {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="rounded-full bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#3B6D11]">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
