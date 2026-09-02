"use client";

import { useState } from "react";
import Link from "next/link";

export default function PaymentSuccessModal({
  title,
  message,
  ctaHref,
  ctaLabel,
}: {
  title: string;
  message: string;
  ctaHref: string;
  ctaLabel: string;
}) {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#EAF3DE]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12.5L9 17.5L20 6.5" stroke="#3F6C51" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-[#202A3C]">{title}</h2>
        <p className="mt-2 text-sm text-[#5C5A52]">{message}</p>

        <Link
          href={ctaHref}
          className="mt-5 block rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52]"
        >
          {ctaLabel}
        </Link>
        <button
          onClick={() => setOpen(false)}
          className="mt-3 text-sm text-[#8B8578] hover:underline"
        >
          Close
        </button>
      </div>
    </div>
  );
}
