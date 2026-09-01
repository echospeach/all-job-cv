"use client";

import { useState } from "react";

export default function EmailPreferenceToggle({
  initialOptOut,
}: {
  initialOptOut: boolean;
}) {
  const [optOut, setOptOut] = useState(initialOptOut);
  const [saving, setSaving] = useState(false);

  async function handleChange(checked: boolean) {
    setOptOut(checked);
    setSaving(true);
    await fetch("/api/email-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOptOut: checked }),
    });
    setSaving(false);
  }

  return (
    <label className="flex items-center gap-2 text-sm text-[#202A3C]">
      <input
        type="checkbox"
        checked={optOut}
        onChange={(e) => handleChange(e.target.checked)}
        disabled={saving}
        className="h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
      />
      Don&apos;t send me job alert emails
    </label>
  );
}
