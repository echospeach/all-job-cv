import { NextResponse } from "next/server";
import { clearAdminSession } from "@/app/lib/adminAuth";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
