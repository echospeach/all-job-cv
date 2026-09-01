import { cookies } from "next/headers";
import crypto from "crypto";

const COOKIE_NAME = "admin_session";

function sign(value: string): string {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const hmac = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return `${value}.${hmac}`;
}

function verify(signed: string): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET!;
  const [value, sig] = signed.split(".");
  if (!value || !sig) return false;
  const expected = crypto.createHmac("sha256", secret).update(value).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie) return false;
  return verify(cookie.value);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const token = sign("admin-authenticated");
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}
