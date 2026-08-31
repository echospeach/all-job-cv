"use client";

import { useState } from "react";

export default function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubscribe() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout/subscription", { method: "POST" });
      if (!res.ok) throw new Error("Checkout failed");
      const data = await res.json();
      window.location.href = data.url;
    } catch {
      setError("Could not start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="rounded-lg bg-[#202A3C] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
      >
        {loading ? "Redirecting..." : "Upgrade to Premium"}
      </button>
      {error && <p className="mt-2 text-sm text-[#993C1D]">{error}</p>}
    </div>
  );
}
