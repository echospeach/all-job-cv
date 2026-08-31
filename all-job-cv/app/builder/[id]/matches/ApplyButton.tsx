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
  const [error, setError] = useState("");

  async function toggle() {
    setLoading(true);
    setError("");
    try {
      if (applied) {
        const res = await fetch("/api/applications", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId }),
        });
        if (!res.ok) throw new Error("Server returned " + res.status);
        setApplied(false);
      } else {
        const res = await fetch("/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobId, cvId }),
        });
        if (!res.ok) throw new Error("Server returned " + res.status);
        setApplied(true);
      }
    } catch {
      setError("Could not update. Please try again.");
    }
    setLoading(false);
  }

  return (
    <div className="mt-3 ml-2 inline-block">
      <button
        onClick={toggle}
        disabled={loading}
        className={
          applied
            ? "inline-block rounded-lg border border-[#3F6C51] px-4 py-2 text-sm font-medium text-[#3F6C51] disabled:opacity-60"
            : "inline-block rounded-lg border border-[#D8D3C8] px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8] disabled:opacity-60"
        }
      >
        {loading ? "..." : applied ? "Applied" : "Mark as applied"}
      </button>
      {error && <p className="mt-1 text-xs text-[#993C1D]">{error}</p>}
    </div>
  );
}
