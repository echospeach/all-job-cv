"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { countries } from "@/app/lib/countries";

export default function AddJobForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [country, setCountry] = useState("gb");
  const [sponsorsVisa, setSponsorsVisa] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/admin-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, location, description, url, country, sponsorsVisa }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Could not add job");
      }

      setSuccess(true);
      setTitle("");
      setCompany("");
      setLocation("");
      setDescription("");
      setUrl("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add job");
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#D8D3C8] bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Job title</label>
        <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Software Developer" />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Company</label>
        <input required className="input" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Northline Ltd" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#202A3C]">Location</label>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="London, UK" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-[#202A3C]">Country</label>
          <select className="input" value={country} onChange={(e) => setCountry(e.target.value)}>
            {countries.map((c) => (
              <option key={c.code} value={c.code}>{c.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Description</label>
        <textarea
          required
          className="input min-h-[140px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Full job description, including sponsorship details if applicable."
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Application URL (optional)</label>
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://company.com/careers/role" />
      </div>

      <label className="flex items-center gap-2 text-sm text-[#202A3C]">
        <input
          type="checkbox"
          checked={sponsorsVisa}
          onChange={(e) => setSponsorsVisa(e.target.checked)}
          className="h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
        />
        This role offers visa sponsorship
      </label>

      {error && <p className="text-sm text-[#993C1D]">{error}</p>}
      {success && <p className="text-sm text-[#3F6C51]">Job added successfully.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
      >
        {saving ? "Adding..." : "Add job"}
      </button>
    </form>
  );
}
