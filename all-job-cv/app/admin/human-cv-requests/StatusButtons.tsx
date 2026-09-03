"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["new", "in_progress", "done"];

export default function StatusButtons({
  requestId,
  currentStatus,
}: {
  requestId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function setStatus(status: string) {
    setSaving(true);
    await fetch(`/api/admin-human-cv-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {statuses.map((s) => (
        <button
          key={s}
          onClick={() => setStatus(s)}
          disabled={saving || currentStatus === s}
          className={
            currentStatus === s
              ? "rounded-lg border border-[#3F6C51] bg-[#EAF3DE] px-3 py-1 text-xs font-medium text-[#3F6C51]"
              : "rounded-lg border border-[#D8D3C8] bg-white px-3 py-1 text-xs font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
          }
        >
          {s.replace("_", " ")}
        </button>
      ))}
    </div>
  );
}
