import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import CvPdfDocument from "@/app/lib/CvPdfDocument";

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

  const buffer = await renderToBuffer(
    <CvPdfDocument content={cv.content as any} />
  );

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${cv.title.replace(/[^a-z0-9]/gi, "_")}.pdf"`,
    },
  });
}
