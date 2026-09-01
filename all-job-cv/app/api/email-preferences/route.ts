import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const sessionUser = await requireUser();
  const body = await request.json();
  const { emailOptOut, country } = body;

  const data: { emailOptOut?: boolean; country?: string | null } = {};
  if (emailOptOut !== undefined) data.emailOptOut = Boolean(emailOptOut);
  if (country !== undefined) data.country = country || null;

  await prisma.user.update({
    where: { id: sessionUser.id },
    data,
  });

  return NextResponse.json({ ok: true });
}
