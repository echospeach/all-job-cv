import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import DeleteJobButton from "./DeleteJobButton";

export default async function AdminJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const jobs = await prisma.job.findMany({
    where: q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { company: { contains: q, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#202A3C]">Manage jobs</h1>
        <Link
          href="/admin/add-job"
          className="rounded-lg bg-[#3F6C51] px-4 py-2 text-sm font-medium text-white hover:bg-[#345A44]"
        >
          + Add sponsor job
        </Link>
      </div>

      <form method="GET" className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by title or company"
          className="input max-w-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-lg border border-[#D8D3C8] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#D8D3C8] text-left text-xs uppercase text-[#8B8578]">
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Sponsors visa</th>
              <th className="px-4 py-2">Added</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id} className="border-b border-[#D8D3C8] last:border-0">
                <td className="px-4 py-2 text-[#202A3C]">{job.title}</td>
                <td className="px-4 py-2 text-[#5C5A52]">{job.company}</td>
                <td className="px-4 py-2 text-[#8B8578]">{job.country.toUpperCase()}</td>
                <td className="px-4 py-2 text-[#8B8578]">{job.sponsorsVisa ? "Yes" : "No"}</td>
                <td className="px-4 py-2 text-[#8B8578]">
                  {new Date(job.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/jobs/${job.id}`}
                      className="text-sm font-medium text-[#3F6C51] hover:underline"
                    >
                      Edit
                    </Link>
                    <DeleteJobButton jobId={job.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {jobs.length === 0 && (
        <p className="mt-6 text-sm text-[#8B8578]">No jobs found.</p>
      )}
    </div>
  );
}
