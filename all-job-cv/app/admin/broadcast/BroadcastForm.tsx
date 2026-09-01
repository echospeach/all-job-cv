"use client";

import { useState } from "react";
import { countries } from "@/app/lib/countries";

type Job = { id: string; title: string; company: string };

export default function BroadcastForm({ jobs }: { jobs: Job[] }) {
  const [jobId, setJobId] = useState(jobs[0]?.id || "");
  const [target, setTarget] = useState<"all" | "individual">("all");
  const [targetCountry, setTargetCountry] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    setResult("");
    setError("");

    try {
      const res = await fetch("/api/admin-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          targetEmail: target === "individual" ? email : undefined,
          targetCountry: target === "all" && targetCountry ? targetCountry : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Broadcast failed");
      setResult(
        target === "individual"
          ? `Sent to ${email}.`
          : `Sent to ${data.sent} of ${data.total} users.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Broadcast failed");
    }

    setSending(false);
  }

  if (jobs.length === 0) {
    return (
      <p className="text-sm text-[#8B8578]">
        No jobs exist yet. Add one first from the dashboard.
      </p>
    );
  }

  return (
    <form onSubmit={handleSend} className="space-y-4 rounded-lg border border-[#D8D3C8] bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Job to broadcast</label>
        <select className="input" value={jobId} onChange={(e) => setJobId(e.target.value)}>
          {jobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title} - {job.company}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#202A3C]">Send to</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setTarget("all")}
            className={
              target === "all"
                ? "rounded-lg border border-[#202A3C] bg-[#202A3C] px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-[#D8D3C8] bg-white px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
            }
          >
            All users
          </button>
          <button
            type="button"
            onClick={() => setTarget("individual")}
            className={
              target === "individual"
                ? "rounded-lg border border-[#202A3C] bg-[#202A3C] px-4 py-2 text-sm font-medium text-white"
                : "rounded-lg border border-[#D8D3C8] bg-white px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-[#F0EEE8]"
            }
          >
            Individual
          </button>
        </div>
      </div>

      {target === "all" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-[#202A3C]">
            Filter by country (optional)
          </label>
          <select
            className="input max-w-xs"
            value={targetCountry}
            onChange={(e) => setTargetCountry(e.target.value)}
          >
            <option value="">All countries</option>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-[#8B8578]">
            Only sends to users who have set this country in their account preferences.
          </p>
        </div>
      )}

      {target === "individual" && (
        <div>
          <label className="mb-1 block text-sm font-medium text-[#202A3C]">Recipient email</label>
          <input
            type="email"
            required
            className="input"
            placeholder="someone@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      )}

      {error && <p className="text-sm text-[#993C1D]">{error}</p>}
      {result && <p className="text-sm text-[#3F6C51]">{result}</p>}

      <button
        type="submit"
        disabled={sending}
        className="w-full rounded-lg bg-[#3F6C51] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#345A44] disabled:opacity-60"
      >
        {sending ? "Sending..." : target === "all" ? "Send to all users" : "Send to individual"}
      </button>
    </form>
  );
}
