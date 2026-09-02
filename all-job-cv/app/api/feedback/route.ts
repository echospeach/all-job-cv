import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimit";
import { getClientIp } from "@/app/lib/getClientIp";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(`feedback:${ip}`, 10, 60 * 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many submissions" }, { status: 429 });
  }

  const session = await auth();
  const body = await request.json();
  const { context, rating, message } = body;

  if (!context) {
    return NextResponse.json({ error: "context is required" }, { status: 400 });
  }

  const feedback = await prisma.feedback.create({
    data: {
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
      context,
      rating: rating || null,
      message: message || null,
    },
  });

  return NextResponse.json({ id: feedback.id }, { status: 201 });
}
