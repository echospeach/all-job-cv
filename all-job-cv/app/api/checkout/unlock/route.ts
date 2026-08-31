import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { stripe } from "@/app/lib/stripe";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { cvId } = body;

  if (!cvId) {
    return NextResponse.json({ error: "cvId is required" }, { status: 400 });
  }

  const cv = await prisma.cv.findUnique({ where: { id: cvId } });
  if (!cv || cv.userId !== session.user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const origin = request.headers.get("origin") || "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: session.user.email!,
    line_items: [{ price: process.env.STRIPE_ONETIME_PRICE_ID!, quantity: 1 }],
    metadata: { userId: session.user.id, cvId },
    success_url: `${origin}/builder/${cvId}?unlocked=1`,
    cancel_url: `${origin}/builder/${cvId}?canceled=1`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}
