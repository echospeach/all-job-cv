import { redirect } from "next/navigation";
import { auth, signOut } from "@/app/lib/auth";

export async function requireUser() {
  const session = await auth();

  if (!session?.user?.id) {
    // Stale or malformed session - force a clean re-auth instead of crashing
    if (session?.user) {
      await signOut({ redirectTo: "/signin" });
    }
    redirect("/signin");
  }

  return { ...session.user, id: session.user.id as string };
}
