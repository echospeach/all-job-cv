import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import EditJobForm from "./EditJobForm";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <Link href="/admin/jobs" className="text-sm text-[#8B8578] hover:underline">
        Back to jobs
      </Link>
      <h1 className="mb-8 mt-3 text-2xl font-semibold text-[#202A3C]">Edit job</h1>
      <EditJobForm job={job} />
    </div>
  );
}
