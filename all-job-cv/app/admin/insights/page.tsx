import { prisma } from "@/app/lib/prisma";
import SignupsChart from "./SignupsChart";

export default async function InsightsPage() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    activeSubscriptions,
    recentUsers,
    usersBySignupCountry,
    usersBySignupRegion,
    usersByPreferredCountry,
    purchases,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { subscriptionStatus: "active" } }),
    prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
    }),
    prisma.user.groupBy({
      by: ["signupCountry"],
      _count: { _all: true },
      where: { signupCountry: { not: null } },
      orderBy: { _count: { signupCountry: "desc" } },
      take: 10,
    }),
    prisma.user.groupBy({
      by: ["signupRegion", "signupCountry"],
      _count: { _all: true },
      where: { signupRegion: { not: null } },
      orderBy: { _count: { signupRegion: "desc" } },
      take: 10,
    }),
    prisma.user.groupBy({
      by: ["country"],
      _count: { _all: true },
      where: { country: { not: null } },
      orderBy: { _count: { country: "desc" } },
      take: 10,
    }),
    prisma.purchase.findMany({ select: { amount: true } }),
  ]);

  const dayBuckets: Record<string, number> = {};
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    dayBuckets[key] = 0;
  }
  for (const u of recentUsers) {
    const key = new Date(u.createdAt).toISOString().slice(0, 10);
    if (key in dayBuckets) dayBuckets[key]++;
  }
  const chartData = Object.entries(dayBuckets).map(([date, count]) => ({ date, count }));

  const conversionRate = totalUsers > 0 ? ((activeSubscriptions / totalUsers) * 100).toFixed(1) : "0";
  const oneTimeRevenue = purchases.reduce((sum, p) => sum + p.amount, 0) / 100;
  const monthlyRevenue = activeSubscriptions * 18;

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Insights</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat label="Total users" value={totalUsers} />
        <Stat label="Active subscriptions" value={activeSubscriptions} />
        <Stat label="Conversion rate" value={`${conversionRate}%`} />
        <Stat label="Est. monthly + one-time revenue" value={`£${(monthlyRevenue + oneTimeRevenue).toFixed(2)}`} />
      </div>

      <div className="mb-10 rounded-lg border border-[#D8D3C8] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#202A3C]">Sign-ups, last 30 days</h2>
        <SignupsChart data={chartData} />
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-lg border border-[#D8D3C8] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#202A3C]">
            Visitors by country (at sign-up)
          </h2>
          {usersBySignupCountry.length === 0 ? (
            <p className="text-sm text-[#8B8578]">No geo data yet.</p>
          ) : (
            <div className="space-y-2">
              {usersBySignupCountry.map((row) => (
                <div key={row.signupCountry} className="flex items-center justify-between text-sm">
                  <span className="text-[#202A3C]">{row.signupCountry}</span>
                  <span className="text-[#8B8578]">{row._count._all}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-lg border border-[#D8D3C8] bg-white p-6">
          <h2 className="mb-4 text-lg font-semibold text-[#202A3C]">
            Visitors by state/region (at sign-up)
          </h2>
          {usersBySignupRegion.length === 0 ? (
            <p className="text-sm text-[#8B8578]">No geo data yet.</p>
          ) : (
            <div className="space-y-2">
              {usersBySignupRegion.map((row, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-[#202A3C]">
                    {row.signupRegion}, {row.signupCountry}
                  </span>
                  <span className="text-[#8B8578]">{row._count._all}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-[#D8D3C8] bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-[#202A3C]">
          Job search country preference
        </h2>
        <p className="mb-4 text-xs text-[#8B8578]">
          Set by users in Account settings - may differ from where they actually signed up from.
        </p>
        {usersByPreferredCountry.length === 0 ? (
          <p className="text-sm text-[#8B8578]">No preference data yet.</p>
        ) : (
          <div className="space-y-2">
            {usersByPreferredCountry.map((row) => (
              <div key={row.country} className="flex items-center justify-between text-sm">
                <span className="text-[#202A3C]">{row.country?.toUpperCase()}</span>
                <span className="text-[#8B8578]">{row._count._all}</span>
              </div>
            ))}
          </div>
        )}
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
