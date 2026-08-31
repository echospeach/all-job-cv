"use client";

import { useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

export default function MobileNav({
  items,
  userEmail,
  signOutAction,
}: {
  items: NavItem[];
  userEmail?: string;
  signOutAction?: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        className="rounded-lg border border-[#D8D3C8] p-2 text-[#202A3C]"
      >
        {open ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M3 6H17M3 10H17M3 14H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-40 border-b border-[#D8D3C8] bg-[#F0EEE8] px-4 py-3">
          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-[#202A3C]"
              >
                {item.label}
              </Link>
            ))}
            {userEmail && (
              <p className="text-sm text-[#8B8578]">{userEmail}</p>
            )}
            {signOutAction && (
              <form action={signOutAction}>
                <button className="w-full rounded-lg border border-[#D8D3C8] px-3 py-1.5 text-left text-sm font-medium text-[#202A3C]">
                  Sign out
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
