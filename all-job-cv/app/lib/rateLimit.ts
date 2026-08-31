import { prisma } from "@/app/lib/prisma";

/**
 * Simple fixed-window rate limiter backed by Postgres.
 * Returns true if the request is allowed, false if the limit was exceeded.
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<{ allowed: boolean; remaining: number }> {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({ where: { key } });

  if (!existing) {
    await prisma.rateLimit.create({ data: { key, count: 1, windowStart: now } });
    return { allowed: true, remaining: limit - 1 };
  }

  const windowAgeSeconds = (now.getTime() - existing.windowStart.getTime()) / 1000;

  if (windowAgeSeconds > windowSeconds) {
    // Window expired, reset
    await prisma.rateLimit.update({
      where: { key },
      data: { count: 1, windowStart: now },
    });
    return { allowed: true, remaining: limit - 1 };
  }

  if (existing.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimit.update({
    where: { key },
    data: { count: { increment: 1 } },
  });

  return { allowed: true, remaining: limit - existing.count - 1 };
}
