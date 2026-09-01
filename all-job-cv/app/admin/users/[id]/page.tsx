import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";
import SubscriptionToggle from "./SubscriptionToggle";
import DeleteUserButton from "./DeleteUserButton";

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      cvs: { orderBy: { createdAt: "desc" }, select: { id: true, title: true, template: true, createdAt: true } },
      applications: { orderBy: { appliedAt: "desc" }, select: { id: true, appliedAt: true, job: { select: { title: true, company: true } } } },
      purchases: { orderBy: { createdAt: "desc" }, select: { id: true, amount: true, createdAt: true } },
    },
  });

  if (!user) notFound();

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link href="/admin/users" className="text-sm text-[#8B8578] hover:underline">
          Back to users
        </Link>

        <h1 className="mb-1 mt-3 text-2xl font-semibold text-[#202A3C]">{user.email}</h1>
        <p className="mb-8 text-sm text-[#8B8578]">
          {user.name || "No name set"} - Joined {new Date(user.createdAt).toLocaleDateString()}
        </p>

        <div className="mb-6 rounded-lg border border-[#D8D3C8] bg-white p-6">
          <p className="mb-3 text-sm font-semibold text-[#202A3C]">Subscription</p>
          <p className="mb-3 text-sm text-[#5C5A52]">
            Current status: <span className="font-medium">{user.subscriptionStatus || "none"}</span>
          </p>
          <SubscriptionToggle userId={user.id} currentStatus={user.subscriptionStatus} />
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">CVs ({user.cvs.length})</h2>
          {user.cvs.length === 0 ? (
            <p className="text-sm text-[#8B8578]">No CVs yet.</p>
          ) : (
            <div className="space-y-2">
              {user.cvs.map((cv) => (
                <div key={cv.id} className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-3 text-sm">
                  <span className="font-medium text-[#202A3C]">{cv.title}</span>
                  <span className="ml-2 text-[#8B8578]">
                    {cv.template} - {new Date(cv.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">
            Applications ({user.applications.length})
          </h2>
          {user.applications.length === 0 ? (
            <p className="text-sm text-[#8B8578]">No applications tracked.</p>
          ) : (
            <div className="space-y-2">
              {user.applications.map((app) => (
                <div key={app.id} className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-3 text-sm">
                  <span className="font-medium text-[#202A3C]">{app.job.title}</span>
                  <span className="ml-2 text-[#8B8578]">
                    {app.job.company} - {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">
            One-time purchases ({user.purchases.length})
          </h2>
          {user.purchases.length === 0 ? (
            <p className="text-sm text-[#8B8578]">No one-time purchases.</p>
          ) : (
            <div className="space-y-2">
              {user.purchases.map((p) => (
                <div key={p.id} className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-3 text-sm">
                  <span className="font-medium text-[#202A3C]">£{(p.amount / 100).toFixed(2)}</span>
                  <span className="ml-2 text-[#8B8578]">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[#D8D3C8] bg-white p-6">
          <p className="mb-3 text-sm font-semibold text-[#202A3C]">Danger zone</p>
          <DeleteUserButton userId={user.id} userEmail={user.email} />
        </div>
      </div>
    </div>
  );
}
