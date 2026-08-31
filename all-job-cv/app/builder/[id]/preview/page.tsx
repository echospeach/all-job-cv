import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import ClassicTemplate from "@/app/lib/templates/ClassicTemplate";
import ModernTemplate from "@/app/lib/templates/ModernTemplate";
import MinimalTemplate from "@/app/lib/templates/MinimalTemplate";
import ProfileTemplate from "@/app/lib/templates/ProfileTemplate";
import CompactTemplate from "@/app/lib/templates/CompactTemplate";
import SidebarTemplate from "@/app/lib/templates/SidebarTemplate";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  const { id } = await params;
  const cv = await prisma.cv.findUnique({ where: { id } });
  if (!cv || cv.userId !== session.user.id) notFound();

  const content = cv.content as any;
  const template = cv.template || "classic";

  return (
    <div className="min-h-screen bg-[#DDD9CE]">
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href={`/builder/${cv.id}`} className="text-sm font-medium text-[#202A3C] hover:underline">
            Back to edit
          </Link>
          <a href={`/api/cv/${cv.id}/pdf`} className="rounded-lg bg-[#202A3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C3B52]">
            Download PDF
          </a>
        </div>

        <div className="mx-auto" style={{ width: "210mm", maxWidth: "100%" }}>
          {template === "modern" ? (
            <ModernTemplate content={content} />
          ) : template === "minimal" ? (
            <MinimalTemplate content={content} />
          ) : template === "profile" ? (
            <ProfileTemplate content={content} />
          ) : template === "compact" ? (
            <CompactTemplate content={content} />
          ) : template === "sidebar" ? (
            <SidebarTemplate content={content} />
          ) : (
            <ClassicTemplate content={content} />
          )}
        </div>
      </div>
    </div>
  );
}
