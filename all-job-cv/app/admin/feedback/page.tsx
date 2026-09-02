import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";

export default async function AdminFeedbackPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  const feedback = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/admin" className="text-sm text-[#8B8578] hover:underline">
          Back to dashboard
        </Link>

        <h1 className="mb-6 mt-3 text-2xl font-semibold text-[#202A3C]">Feedback</h1>

        {feedback.length === 0 ? (
          <p className="text-sm text-[#8B8578]">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-3">
            {feedback.map((f) => (
              <div key={f.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-[#F0EEE8] px-2.5 py-1 text-xs font-medium text-[#202A3C]">
                      {f.context}
                    </span>
                    {f.rating && (
                      <span className="text-lg">{f.rating === "up" ? "👍" : "👎"}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#8B8578]">
                    {new Date(f.createdAt).toLocaleString()}
                  </span>
                </div>
                {f.message && (
                  <p className="mt-2 text-sm text-[#3A3833]">{f.message}</p>
                )}
                <p className="mt-2 text-xs text-[#8B8578]">
                  {f.userEmail || "Anonymous / guest"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
