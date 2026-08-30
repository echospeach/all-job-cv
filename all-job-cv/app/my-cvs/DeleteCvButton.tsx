"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteCvButton({ cvId }: { cvId: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this CV? This can't be undone.")) return;
    setDeleting(true);
    await fetch(`/api/cv/${cvId}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm font-medium text-[#993C1D] hover:underline disabled:opacity-50"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
