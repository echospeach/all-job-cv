import { NextResponse } from "next/server";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const sessionUser = await requireUser();
  const body = await request.json();
  const { emailOptOut } = body;

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { emailOptOut: Boolean(emailOptOut) },
  });

  return NextResponse.json({ ok: true });
}
