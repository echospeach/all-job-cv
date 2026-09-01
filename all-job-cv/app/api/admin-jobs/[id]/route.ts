import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, company, location, description, url, country, sponsorsVisa } = body;

  const job = await prisma.job.update({
    where: { id },
    data: { title, company, location: location || null, description, url: url || null, country, sponsorsVisa: Boolean(sponsorsVisa) },
  });

  return NextResponse.json(job);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.job.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
