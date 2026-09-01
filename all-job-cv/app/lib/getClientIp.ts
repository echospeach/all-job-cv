/**
 * Extracts a client IP for rate-limiting purposes.
 *
 * On Vercel, x-forwarded-for is set/overwritten at the edge and is not
 * trivially spoofable by the client (Vercel strips incoming client-supplied
 * values on non-Enterprise "Trusted Proxy" plans). x-real-ip is used as a
 * secondary signal where available. This is defense-in-depth: if the app is
 * ever moved off Vercel or placed behind an untrusted proxy, this function
 * should be revisited.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");

  const ip = forwardedFor?.split(",")[0].trim() || realIp || "unknown";
  return ip;
}
