"use client";

import { useState } from "react";

export default function ApplyButton({
  jobId,
  cvId,
  initiallyApplied,
}: {
  jobId: string;
  cvId: string;
  initiallyApplied: boolean;
}) {
  const [applied, setApplied] = useState(initiallyApplied);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    if (applied) {
      await fetch("/api/applications", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      setApplied(false);
    } else {
      await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, cvId }),
      });
      setApplied(true);
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={
        applied
          ? "mt-3 ml-2 inline-block rounded-lg border border-[#3F6C51] px-4 py-2 text-sm font-medium text-[#3F6C51] disabled:opacity-60"
          : "mt-3 ml-2 inline-block rounded-lg border border-[#D8D3C8] px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8] disabled:opacity-60"
      }
    >
      {loading ? "..." : applied ? "Applied" : "Mark as applied"}
    </button>
  );
}
