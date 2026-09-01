import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";
import BroadcastForm from "./BroadcastForm";

export default async function BroadcastPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, title: true, company: true },
  });

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin" className="text-sm text-[#8B8578] hover:underline">
          Back to dashboard
        </Link>
        <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Internal
        </p>
        <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Send broadcast</h1>
        <BroadcastForm jobs={jobs} />
      </div>
    </div>
  );
}
