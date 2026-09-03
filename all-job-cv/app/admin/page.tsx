import { prisma } from "@/app/lib/prisma";

export default async function AdminPage() {
  const [
    userCount,
    cvCount,
    applicationCount,
    activeSubscriptions,
    purchases,
    jobCount,
    jobsByCountry,
    recentUsers,
    recentCvs,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.cv.count(),
    prisma.application.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.purchase.findMany({ select: { amount: true } }),
    prisma.job.count(),
    prisma.job.groupBy({ by: ["country"], _count: { _all: true } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { email: true, name: true, createdAt: true, subscriptionStatus: true },
    }),
    prisma.cv.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { title: true, template: true, createdAt: true, user: { select: { email: true } } },
    }),
  ]);

  const purchaseRevenue = purchases.reduce((sum, p) => sum + p.amount, 0) / 100;
  const purchaseCount = purchases.length;
  const estimatedMonthlyRevenue = activeSubscriptions * 18;

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Dashboard</h1>

      <div className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total users" value={userCount} />
        <Stat label="CVs created" value={cvCount} />
        <Stat label="Applications tracked" value={applicationCount} />
        <Stat label="Jobs in database" value={jobCount} />
        <Stat label="Active subscriptions" value={activeSubscriptions} />
        <Stat label="One-time unlocks" value={purchaseCount} />
        <Stat label="One-time revenue" value={`£${purchaseRevenue.toFixed(2)}`} />
        <Stat label="Est. monthly sub revenue" value={`£${estimatedMonthlyRevenue.toFixed(2)}`} />
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">Jobs by country</h2>
        <div className="flex flex-wrap gap-3">
          {jobsByCountry.map((row) => (
            <div key={row.country} className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-2">
              <span className="text-sm font-semibold text-[#202A3C]">{row.country.toUpperCase()}</span>
              <span className="ml-2 text-sm text-[#8B8578]">{row._count._all}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10">
        <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">Recent sign-ups</h2>
        <div className="overflow-x-auto rounded-lg border border-[#D8D3C8] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D8D3C8] text-left text-xs uppercase text-[#8B8578]">
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Joined</th>
                <th className="px-4 py-2">Plan</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((u, i) => (
                <tr key={i} className="border-b border-[#D8D3C8] last:border-0">
                  <td className="px-4 py-2 text-[#202A3C]">{u.email}</td>
                  <td className="px-4 py-2 text-[#5C5A52]">{u.name || "-"}</td>
                  <td className="px-4 py-2 text-[#8B8578]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2 text-[#8B8578]">
                    {u.subscriptionStatus === "active" ? "Premium" : "Free"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-[#202A3C]">Recent CVs</h2>
        <div className="overflow-x-auto rounded-lg border border-[#D8D3C8] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D8D3C8] text-left text-xs uppercase text-[#8B8578]">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Template</th>
                <th className="px-4 py-2">User</th>
                <th className="px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {recentCvs.map((cv, i) => (
                <tr key={i} className="border-b border-[#D8D3C8] last:border-0">
                  <td className="px-4 py-2 text-[#202A3C]">{cv.title}</td>
                  <td className="px-4 py-2 text-[#5C5A52]">{cv.template}</td>
                  <td className="px-4 py-2 text-[#8B8578]">{cv.user.email}</td>
                  <td className="px-4 py-2 text-[#8B8578]">
                    {new Date(cv.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-[#D8D3C8] bg-white p-4">
      <p className="text-2xl font-semibold text-[#202A3C]">{value}</p>
      <p className="mt-1 text-xs text-[#8B8578]">{label}</p>
    </div>
  );
}
