"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteUserButton({ userId, userEmail }: { userId: string; userEmail: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin-users/${userId}`, { method: "DELETE" });
    router.push("/admin/users");
    router.refresh();
  }

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm font-medium text-[#993C1D] hover:underline"
      >
        Delete account and all data
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-[#993C1D]/30 bg-[#FBEDE7] p-4">
      <p className="mb-2 text-sm text-[#993C1D]">
        This permanently deletes this user, their CVs, applications, and purchase records. This
        cannot be undone. Type the user&apos;s email to confirm.
      </p>
      <input
        className="input mb-2"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={userEmail}
      />
      <div className="flex gap-2">
        <button
          onClick={handleDelete}
          disabled={confirmText !== userEmail || deleting}
          className="rounded-lg bg-[#993C1D] px-4 py-2 text-sm font-medium text-white hover:bg-[#7A2F16] disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Confirm delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-2 text-sm font-medium text-[#202A3C]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
