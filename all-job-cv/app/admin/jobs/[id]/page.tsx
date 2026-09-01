import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";
import EditJobForm from "./EditJobForm";

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) notFound();

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin/jobs" className="text-sm text-[#8B8578] hover:underline">
          Back to jobs
        </Link>
        <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Internal
        </p>
        <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Edit job</h1>
        <EditJobForm job={job} />
      </div>
    </div>
  );
}
