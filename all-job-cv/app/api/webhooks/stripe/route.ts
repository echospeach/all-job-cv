import { NextResponse } from "next/server";
import { stripe } from "@/app/lib/stripe";
import { prisma } from "@/app/lib/prisma";
import type Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.mode === "payment" && session.metadata?.cvId) {
      // One-time CV unlock
      await prisma.cv.update({
        where: { id: session.metadata.cvId },
        data: { paidUnlocked: true },
      });

      await prisma.purchase.create({
        data: {
          userId: session.metadata.userId!,
          cvId: session.metadata.cvId,
          stripeSessionId: session.id,
          amount: session.amount_total ?? 0,
        },
      });
    }

    if (session.mode === "subscription" && session.customer) {
      const customerId =
        typeof session.customer === "string" ? session.customer : session.customer.id;

      const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            subscriptionId: session.subscription as string,
            subscriptionStatus: "active",
          },
        });
      }
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const customerId =
      typeof subscription.customer === "string" ? subscription.customer : subscription.customer.id;

    const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });

    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          subscriptionStatus: subscription.status,
          subscriptionPeriodEnd: new Date(subscription.current_period_end * 1000),
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
