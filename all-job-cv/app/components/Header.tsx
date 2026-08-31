import Link from "next/link";
import { auth, signIn, signOut } from "@/app/lib/auth";

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-[#D8D3C8] bg-[#F0EEE8]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight text-[#202A3C]">
          ALL JOB CV
        </Link>

        {session?.user ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/templates" className="text-sm font-medium text-[#202A3C] hover:underline">
              Templates
            </Link>
            <Link href="/my-cvs" className="text-sm font-medium text-[#202A3C] hover:underline">
              My CVs
            </Link>
            <Link href="/applications" className="text-sm font-medium text-[#202A3C] hover:underline">
              Applications
            </Link>
            <span className="hidden text-sm text-[#8B8578] sm:inline">{session.user.email}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="rounded-lg border border-[#D8D3C8] px-3 py-1.5 text-sm font-medium text-[#202A3C] hover:bg-white">
                Sign out
              </button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/builder" });
            }}
          >
            <button className="rounded-lg bg-[#202A3C] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2C3B52]">
              Sign in with Google
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
