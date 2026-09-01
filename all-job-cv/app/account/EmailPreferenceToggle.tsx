"use client";

import { useState } from "react";
import { countries } from "@/app/lib/countries";

export default function EmailPreferenceToggle({
  initialOptOut,
  initialCountry,
}: {
  initialOptOut: boolean;
  initialCountry: string | null;
}) {
  const [optOut, setOptOut] = useState(initialOptOut);
  const [country, setCountry] = useState(initialCountry || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleOptOutChange(checked: boolean) {
    setOptOut(checked);
    setSaving(true);
    await fetch("/api/email-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailOptOut: checked }),
    });
    setSaving(false);
  }

  async function handleCountryChange(value: string) {
    setCountry(value);
    setSaving(true);
    setSaved(false);
    await fetch("/api/email-preferences", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: value }),
    });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="space-y-4">
      <label className="flex items-center gap-2 text-sm text-[#202A3C]">
        <input
          type="checkbox"
          checked={optOut}
          onChange={(e) => handleOptOutChange(e.target.checked)}
          disabled={saving}
          className="h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
        />
        Don&apos;t send me job alert emails
      </label>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">
          Your country (used to send you relevant job alerts)
        </label>
        <select
          className="input max-w-xs"
          value={country}
          onChange={(e) => handleCountryChange(e.target.value)}
        >
          <option value="">Not set</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.label}
            </option>
          ))}
        </select>
        {saved && <p className="mt-1 text-xs text-[#3F6C51]">Saved.</p>}
      </div>
    </div>
  );
}
