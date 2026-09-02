"use client";

import { useState } from "react";

export default function FeedbackPage() {
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: "general", message }),
    });
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          We'd love to hear from you
        </p>
        <h1 className="mb-6 text-2xl font-semibold text-[#202A3C]">Send feedback</h1>

        {submitted ? (
          <div className="rounded-lg border border-[#3F6C51] bg-[#EAF3DE] p-6 text-sm text-[#202A3C]">
            Thanks for taking the time to share this - it genuinely helps shape what we build next.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-lg border border-[#D8D3C8] bg-white p-6">
            <label className="mb-1 block text-sm font-medium text-[#202A3C]">
              What's working, what's not, or what would help you?
            </label>
            <textarea
              required
              className="input min-h-[140px]"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us anything - bugs, ideas, confusing moments, whatever's on your mind."
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
            >
              {submitting ? "Sending..." : "Send feedback"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
