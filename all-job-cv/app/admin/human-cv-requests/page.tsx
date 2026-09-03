import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";
import StatusButtons from "./StatusButtons";

export default async function AdminHumanCvRequestsPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  const requests = await prisma.humanCvRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/admin" className="text-sm text-[#8B8578] hover:underline">
          Back to dashboard
        </Link>

        <h1 className="mb-6 mt-3 text-2xl font-semibold text-[#202A3C]">
          Human CV requests ({requests.length})
        </h1>

        {requests.length === 0 ? (
          <p className="text-sm text-[#8B8578]">No requests yet.</p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#202A3C]">{r.name}</p>
                    <p className="text-sm text-[#8B8578]">
                      {r.email}
                      {r.phone ? ` - ${r.phone}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#F0EEE8] px-2.5 py-1 text-xs font-medium text-[#202A3C]">
                    {r.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#3A3833]">{r.message}</p>
                <p className="mt-2 text-xs text-[#8B8578]">
                  {new Date(r.createdAt).toLocaleString()}
                </p>
                <div className="mt-3">
                  <StatusButtons requestId={r.id} currentStatus={r.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
