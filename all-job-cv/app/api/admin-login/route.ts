import { NextResponse } from "next/server";
import { setAdminSession } from "@/app/lib/adminAuth";
import { checkRateLimit } from "@/app/lib/rateLimit";
import { getClientIp } from "@/app/lib/getClientIp";
import crypto from "crypto";

function safeCompare(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const { allowed } = await checkRateLimit(`admin-login:${ip}`, 5, 15 * 60);

  if (!allowed) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body = await request.json();
  const { password } = body;

  if (!password || !safeCompare(password, process.env.ADMIN_PASSWORD || "")) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
