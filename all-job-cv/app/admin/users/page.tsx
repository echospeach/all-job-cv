import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const users = await prisma.user.findMany({
    where: q ? { email: { contains: q, mode: "insensitive" } } : {},
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      subscriptionStatus: true,
      country: true,
      _count: { select: { cvs: true, applications: true } },
    },
  });

  return (
    <div className="mx-auto max-w-5xl px-8 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#202A3C]">Manage users</h1>

      <form method="GET" className="mb-6">
        <input
          type="text"
          name="q"
          defaultValue={q || ""}
          placeholder="Search by email"
          className="input max-w-sm"
        />
      </form>

      <div className="overflow-x-auto rounded-lg border border-[#D8D3C8] bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#D8D3C8] text-left text-xs uppercase text-[#8B8578]">
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Country</th>
              <th className="px-4 py-2">Joined</th>
              <th className="px-4 py-2">Plan</th>
              <th className="px-4 py-2">CVs</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[#D8D3C8] last:border-0">
                <td className="px-4 py-2 text-[#202A3C]">{u.email}</td>
                <td className="px-4 py-2 text-[#5C5A52]">{u.name || "-"}</td>
                <td className="px-4 py-2 text-[#8B8578]">{u.country?.toUpperCase() || "-"}</td>
                <td className="px-4 py-2 text-[#8B8578]">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 text-[#8B8578]">
                  {u.subscriptionStatus === "active" ? "Premium" : "Free"}
                </td>
                <td className="px-4 py-2 text-[#8B8578]">{u._count.cvs}</td>
                <td className="px-4 py-2">
                  <Link
                    href={`/admin/users/${u.id}`}
                    className="text-sm font-medium text-[#3F6C51] hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <p className="mt-6 text-sm text-[#8B8578]">No users found.</p>
      )}
    </div>
  );
}
