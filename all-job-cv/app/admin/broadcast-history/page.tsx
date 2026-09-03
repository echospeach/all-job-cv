import { prisma } from "@/app/lib/prisma";

export default async function BroadcastHistoryPage() {
  const logs = await prisma.broadcastLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#202A3C]">Broadcast history</h1>

      {logs.length === 0 ? (
        <p className="text-sm text-[#8B8578]">No broadcasts sent yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-[#D8D3C8] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#D8D3C8] text-left text-xs uppercase text-[#8B8578]">
                <th className="px-4 py-2">Job</th>
                <th className="px-4 py-2">Target</th>
                <th className="px-4 py-2">Sent / Total</th>
                <th className="px-4 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b border-[#D8D3C8] last:border-0">
                  <td className="px-4 py-2 text-[#202A3C]">
                    {log.jobTitle} - {log.jobCompany}
                  </td>
                  <td className="px-4 py-2 text-[#5C5A52]">
                    {log.target === "individual"
                      ? `Individual (${log.targetDetail})`
                      : log.target === "country"
                      ? `Country: ${log.targetDetail?.toUpperCase()}`
                      : "All users"}
                  </td>
                  <td className="px-4 py-2 text-[#8B8578]">
                    {log.sentCount} / {log.totalCount}
                  </td>
                  <td className="px-4 py-2 text-[#8B8578]">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
