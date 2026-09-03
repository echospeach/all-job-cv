import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { resend } from "@/app/lib/resend";
import { checkRateLimit } from "@/app/lib/rateLimit";
import { getClientIp } from "@/app/lib/getClientIp";
import { escapeHtml } from "@/app/lib/escapeHtml";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(`human-cv-request:${ip}`, 5, 60 * 60);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const session = await auth();
  const body = await request.json();
  const { name, email, phone, message } = body;

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 });
  }

  const req = await prisma.humanCvRequest.create({
    data: {
      userId: session?.user?.id || null,
      name,
      email,
      phone: phone || null,
      message,
    },
  });

  try {
    await resend.emails.send({
      from: "ALL JOB CV <onboarding@resend.dev>",
      to: ["echospeach@gmail.com"],
      subject: `New human CV request from ${escapeHtml(name)}`,
      html: `
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(message)}</p>
      `,
    });
  } catch {
    // Non-critical - the request is already saved even if the notification email fails
  }

  return NextResponse.json({ id: req.id }, { status: 201 });
}
