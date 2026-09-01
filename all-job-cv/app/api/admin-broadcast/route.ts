import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";
import { resend } from "@/app/lib/resend";

function buildEmailHtml(job: {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  sponsorsVisa: boolean;
}, appUrl: string) {
  return `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #202A3C;">
      <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #3F6C51; margin-bottom: 4px;">
        New sponsored job
      </p>
      <h1 style="font-size: 20px; margin: 0 0 8px;">${job.title}</h1>
      <p style="color: #8B8578; margin: 0 0 16px;">
        ${job.company}${job.location ? " - " + job.location : ""}
      </p>
      ${job.sponsorsVisa ? '<p style="display:inline-block; background:#EAF3DE; color:#3F6C51; padding:4px 10px; border-radius:999px; font-size:12px; margin-bottom:16px;">May sponsor visa</p>' : ""}
      <p style="line-height: 1.6; color: #3A3833;">
        ${job.description.slice(0, 300)}${job.description.length > 300 ? "..." : ""}
      </p>
      <a href="${appUrl}/jobs/${job.id}" style="display:inline-block; margin-top:16px; background:#202A3C; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none; font-size:14px;">
        View on ALL JOB CV
      </a>
      <p style="margin-top: 32px; font-size: 12px; color: #8B8578;">
        You're receiving this because you have an ALL JOB CV account.
        <a href="${appUrl}/account" style="color:#3F6C51;">Manage email preferences</a>.
      </p>
    </div>
  `;
}

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { jobId, targetEmail, targetCountry } = body;

  if (!jobId) {
    return NextResponse.json({ error: "jobId is required" }, { status: 400 });
  }

  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://all-job-cv.vercel.app";
  const html = buildEmailHtml(job, appUrl);

  // Individual send
  if (targetEmail) {
    try {
      await resend.emails.send({
        from: "ALL JOB CV <onboarding@resend.dev>",
        to: [targetEmail],
        subject: `New job: ${job.title} at ${job.company}`,
        html,
      });
      return NextResponse.json({ message: "Sent to individual", sent: 1, total: 1 });
    } catch (err) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Send failed" },
        { status: 500 }
      );
    }
  }

  // Broadcast to all opted-in users, optionally filtered by country
  const recipients = await prisma.user.findMany({
    where: {
      emailOptOut: false,
      ...(targetCountry ? { country: targetCountry } : {}),
    },
    select: { email: true },
  });

  if (recipients.length === 0) {
    return NextResponse.json({ message: "No recipients to send to", sent: 0, total: 0 });
  }

  let sent = 0;
  const batchSize = 50;

  for (let i = 0; i < recipients.length; i += batchSize) {
    const batch = recipients.slice(i, i + batchSize);
    try {
      await resend.emails.send({
        from: "ALL JOB CV <onboarding@resend.dev>",
        to: batch.map((r) => r.email),
        subject: `New job: ${job.title} at ${job.company}`,
        html,
      });
      sent += batch.length;
    } catch (err) {
      console.error("Broadcast batch failed:", err);
    }
  }

  return NextResponse.json({ message: "Broadcast sent", sent, total: recipients.length });
}
