import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import ClassicPdf from "@/app/lib/pdf-templates/ClassicPdf";
import ModernPdf from "@/app/lib/pdf-templates/ModernPdf";
import MinimalPdf from "@/app/lib/pdf-templates/MinimalPdf";
import ProfilePdf from "@/app/lib/pdf-templates/ProfilePdf";
import CompactPdf from "@/app/lib/pdf-templates/CompactPdf";
import SidebarPdf from "@/app/lib/pdf-templates/SidebarPdf";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } = await params;
  const cv = await prisma.cv.findUnique({ where: { id } });

  if (!cv || cv.userId !== session.user.id) {
    return new Response("Not found", { status: 404 });
  }

  const content = cv.content as any;
  const template = cv.template || "classic";

  const docMap: Record<string, JSX.Element> = {
    classic: <ClassicPdf content={content} />,
    modern: <ModernPdf content={content} />,
    minimal: <MinimalPdf content={content} />,
    profile: <ProfilePdf content={content} />,
    compact: <CompactPdf content={content} />,
    sidebar: <SidebarPdf content={content} />,
  };

  const buffer = await renderToBuffer(docMap[template] ?? docMap.classic);

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cv.title.replace(/[^a-z0-9]/gi, "_")}.pdf"`,
    },
  });
}
