import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { checkRateLimit } from "@/app/lib/rateLimit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || "unknown";
  const { allowed } = await checkRateLimit(`signup:${ip}`, 5, 60 * 60);

  if (!allowed) {
    return NextResponse.json(
      { error: "Too many sign-up attempts. Please try again later." },
      { status: 429 }
    );
  }

  const body = await request.json();
  const { email, password, name } = body;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const signupCountry = request.headers.get("x-vercel-ip-country") || null;
  const signupRegion = request.headers.get("x-vercel-ip-country-region") || null;

  const user = await prisma.user.create({
    data: { email, password: hashed, name: name || null, signupCountry, signupRegion },
  });

  return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
}
