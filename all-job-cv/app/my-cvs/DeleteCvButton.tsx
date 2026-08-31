"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCvButton({ cvId }: { cvId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    if (!confirm("Delete this CV? This can't be undone.")) return;
    setDeleting(true);
    setError("");
    try {
      const res = await fetch(`/api/cv/${cvId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Server returned " + res.status);
      router.refresh();
    } catch {
      setError("Could not delete this CV. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleDelete}
        disabled={deleting}
        className="text-sm font-medium text-[#993C1D] hover:underline disabled:opacity-50"
      >
        {deleting ? "Deleting…" : "Delete"}
      </button>
      {error && <p className="mt-1 text-xs text-[#993C1D]">{error}</p>}
    </div>
  );
}
