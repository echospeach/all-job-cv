import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function POST() {
  const user = await prisma.user.create({
    data: { email: "test@example.com" },
  });
  return NextResponse.json(user, { status: 201 });
}
