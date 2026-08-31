import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import DeleteCvButton from "./DeleteCvButton";

export default async function MyCvsPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const cvs = await prisma.cv.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
              Your CVs
            </p>
            <h1 className="text-2xl font-semibold text-[#202A3C]">My CVs</h1>
          </div>
          <Link
            href="/builder"
            className="rounded-lg bg-[#202A3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C3B52]"
          >
            + New CV
          </Link>
        </div>

        {cvs.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#D8D3C8] bg-white px-6 py-16 text-center">
            <p className="text-[15px] text-[#5C5A52]">
              You haven&apos;t created a CV yet.
            </p>
            <Link
              href="/builder"
              className="mt-4 inline-block text-sm font-medium text-[#3F6C51] hover:underline"
            >
              Build your first CV
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {cvs.map((cv) => {
              const content = cv.content as { title?: string; name?: string };
              return (
                <div
                  key={cv.id}
                  className="flex flex-col gap-3 rounded-lg border border-[#D8D3C8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-[15px] font-semibold text-[#202A3C]">{cv.title}</p>
                    <p className="mt-0.5 text-sm text-[#8B8578]">
                      {content?.name || "No name yet"}
                      {content?.title ? ` · ${content.title}` : ""}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8B8578]">
                      Updated {new Date(cv.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      href={`/builder/${cv.id}`}
                      className="rounded-lg border border-[#D8D3C8] px-3 py-1.5 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
                    >
                      Edit
                    </Link>
                    <a
                      href={`/api/cv/${cv.id}/pdf`}
                      className="rounded-lg border border-[#D8D3C8] px-3 py-1.5 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
                    >
                      Download PDF
                    </a>
                    <DeleteCvButton cvId={cv.id} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
