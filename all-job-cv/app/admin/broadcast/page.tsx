import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import BroadcastForm from "./BroadcastForm";

export default async function BroadcastPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, title: true, company: true },
  });

  return (
    <div className="mx-auto max-w-2xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#202A3C]">Send broadcast</h1>
        <Link href="/admin/broadcast-history" className="text-sm font-medium text-[#3F6C51] hover:underline">
          View history
        </Link>
      </div>
      <BroadcastForm jobs={jobs} />
    </div>
  );
}
