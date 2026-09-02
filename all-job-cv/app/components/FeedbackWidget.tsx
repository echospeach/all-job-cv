"use client";

import { useState } from "react";

export default function FeedbackWidget({
  context,
  prompt = "Was this helpful?",
}: {
  context: string;
  prompt?: string;
}) {
  const [rating, setRating] = useState<"up" | "down" | null>(null);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleRating(value: "up" | "down") {
    setRating(value);
    if (value === "up") {
      // Positive feedback needs no follow-up - submit immediately
      await submit(value, "");
    }
  }

  async function submit(ratingValue: "up" | "down", messageValue: string) {
    setSubmitting(true);
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context, rating: ratingValue, message: messageValue || undefined }),
      });
      setSubmitted(true);
    } catch {
      // Fail silently - feedback is non-critical
      setSubmitted(true);
    }
    setSubmitting(false);
  }

  if (submitted) {
    return (
      <p className="text-sm text-[#3F6C51]">Thanks for the feedback.</p>
    );
  }

  return (
    <div className="rounded-lg border border-[#D8D3C8] bg-white p-4">
      <p className="mb-2 text-sm font-medium text-[#202A3C]">{prompt}</p>
      <div className="flex gap-2">
        <button
          onClick={() => handleRating("up")}
          disabled={submitting}
          className={
            rating === "up"
              ? "rounded-lg border border-[#3F6C51] bg-[#EAF3DE] px-3 py-1.5 text-sm"
              : "rounded-lg border border-[#D8D3C8] bg-white px-3 py-1.5 text-sm hover:bg-[#F0EEE8]"
          }
        >
          👍 Yes
        </button>
        <button
          onClick={() => setRating("down")}
          disabled={submitting}
          className={
            rating === "down"
              ? "rounded-lg border border-[#993C1D] bg-[#FBEDE7] px-3 py-1.5 text-sm"
              : "rounded-lg border border-[#D8D3C8] bg-white px-3 py-1.5 text-sm hover:bg-[#F0EEE8]"
          }
        >
          👎 No
        </button>
      </div>

      {rating === "down" && (
        <div className="mt-3">
          <textarea
            className="input min-h-[60px]"
            placeholder="What went wrong, or what would help? (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            onClick={() => submit("down", message)}
            disabled={submitting}
            className="mt-2 rounded-lg bg-[#202A3C] px-4 py-1.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send feedback"}
          </button>
        </div>
      )}
    </div>
  );
}
