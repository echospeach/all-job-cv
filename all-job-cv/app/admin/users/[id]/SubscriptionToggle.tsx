"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SubscriptionToggle({
  userId,
  currentStatus,
}: {
  userId: string;
  currentStatus: string | null;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function setStatus(status: string) {
    setSaving(true);
    await fetch(`/api/admin-users/${userId}/subscription`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setStatus("active")}
        disabled={saving || currentStatus === "active"}
        className="rounded-lg bg-[#3F6C51] px-4 py-2 text-sm font-medium text-white hover:bg-[#345A44] disabled:opacity-50"
      >
        Grant Premium
      </button>
      <button
        onClick={() => setStatus("canceled")}
        disabled={saving || currentStatus !== "active"}
        className="rounded-lg border border-[#D8D3C8] bg-white px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8] disabled:opacity-50"
      >
        Revoke Premium
      </button>
    </div>
  );
}
