"use client";

import { useState } from "react";

export default function HumanCvRequestPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/human-cv-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, message }),
      });
      if (!res.ok) throw new Error("Could not send request");
      setSubmitted(true);
    } catch {
      setError("Could not send your request. Please try again.");
    }

    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Human CV writing
        </p>
        <h1 className="mb-2 text-2xl font-semibold text-[#202A3C]">
          Get your CV written by a real person
        </h1>
        <p className="mb-6 text-sm text-[#5C5A52]">
          Tell us a bit about what you need, and we'll get back to you with next steps and pricing.
        </p>

        {submitted ? (
          <div className="rounded-lg border border-[#3F6C51] bg-[#EAF3DE] p-6 text-sm text-[#202A3C]">
            Thanks - we've received your request and will get back to you by email soon.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#D8D3C8] bg-white p-6">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#202A3C]">Full name</label>
              <input required className="input" value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#202A3C]">Email</label>
              <input type="email" required className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#202A3C]">Phone (optional)</label>
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#202A3C]">
                What kind of role are you targeting, and what would you like help with?
              </label>
              <textarea
                required
                className="input min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="E.g. I'm applying for software developer roles in the UK and want my experience rewritten to stand out."
              />
            </div>

            {error && <p className="text-sm text-[#993C1D]">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send request"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
