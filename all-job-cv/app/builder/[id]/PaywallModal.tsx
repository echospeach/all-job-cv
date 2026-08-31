"use client";

import { useState } from "react";

export default function PaywallModal({
  cvId,
  onClose,
  onUseFree,
}: {
  cvId: string;
  onClose: () => void;
  onUseFree: () => void;
}) {
  const [loadingUnlock, setLoadingUnlock] = useState(false);
  const [loadingSub, setLoadingSub] = useState(false);
  const [error, setError] = useState("");

  async function handleUnlock() {
    setLoadingUnlock(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvId }),
      });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoadingUnlock(false);
    }
  }

  async function handleSubscribe() {
    setLoadingSub(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/subscription", { method: "POST" });
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoadingSub(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
      <div className="w-full max-w-sm rounded-lg bg-white p-6">
        <h2 className="text-lg font-semibold text-[#202A3C]">This is a premium template</h2>
        <p className="mt-2 text-sm text-[#5C5A52]">
          Unlock this CV to save and download it with this template, or subscribe for unlimited access.
        </p>

        <button
          onClick={handleUnlock}
          disabled={loadingUnlock}
          className="mt-5 w-full rounded-lg bg-[#3F6C51] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#345A44] disabled:opacity-60"
        >
          {loadingUnlock ? "Redirecting..." : "Unlock this CV - £2.99"}
        </button>

        <button
          onClick={handleSubscribe}
          disabled={loadingSub}
          className="mt-2 w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
        >
          {loadingSub ? "Redirecting..." : "Subscribe - £18/month"}
        </button>

        {error && <p className="mt-2 text-sm text-[#993C1D]">{error}</p>}

        <button
          onClick={onUseFree}
          className="mt-4 w-full text-center text-sm font-medium text-[#3F6C51] hover:underline"
        >
          Use a free template instead
        </button>
        <button
          onClick={onClose}
          className="mt-2 w-full text-center text-sm text-[#8B8578] hover:underline"
        >
          Keep editing
        </button>
      </div>
    </div>
  );
}
