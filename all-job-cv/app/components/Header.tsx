import Link from "next/link";
import { auth, signOut } from "@/app/lib/auth";
import MobileNav from "./MobileNav";

export default async function Header() {
  const session = await auth();

  const signedInItems = [
    { href: "/templates", label: "Templates" },
    { href: "/applications", label: "Applications" },
    { href: "/account", label: "Account" },
  ];

  const signedOutItems = [
    { href: "/jobs", label: "Find Jobs" },
    { href: "/signin", label: "Sign in" },
  ];

  async function handleSignOut() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <header className="relative border-b border-[#D8D3C8] bg-[#F0EEE8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-sm font-semibold tracking-tight text-[#202A3C]">
            ALL JOB CV
          </Link>
          <Link href="/jobs" className="text-sm font-medium text-[#202A3C] hover:underline">
            Find Jobs
          </Link>
          {session?.user && (
            <Link href="/my-cvs" className="text-sm font-medium text-[#202A3C] hover:underline sm:hidden">
              My CVs
            </Link>
          )}
        </div>

        {/* Desktop nav */}
        {session?.user ? (
          <div className="hidden items-center gap-4 sm:flex">
            <Link href="/templates" className="text-sm font-medium text-[#202A3C] hover:underline">
              Templates
            </Link>
            <Link href="/my-cvs" className="text-sm font-medium text-[#202A3C] hover:underline">
              My CVs
            </Link>
            <Link href="/applications" className="text-sm font-medium text-[#202A3C] hover:underline">
              Applications
            </Link>
            <Link href="/account" className="text-sm font-medium text-[#202A3C] hover:underline">
              Account
            </Link>
            <span className="text-sm text-[#8B8578]">{session.user.email}</span>
            <form action={handleSignOut}>
              <button className="rounded-lg border border-[#D8D3C8] px-3 py-1.5 text-sm font-medium text-[#202A3C] hover:bg-white">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <Link
            href="/signin"
            className="hidden rounded-lg bg-[#202A3C] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2C3B52] sm:inline-block"
          >
            Sign in
          </Link>
        )}

        {/* Mobile nav */}
        <MobileNav
          items={session?.user ? signedInItems : signedOutItems}
          userEmail={session?.user?.email ?? undefined}
          signOutAction={session?.user ? handleSignOut : undefined}
        />
      </div>
    </header>
  );
}
