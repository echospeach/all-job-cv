"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { countries } from "@/app/lib/countries";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  url: string | null;
  country: string;
  sponsorsVisa: boolean;
};

export default function EditJobForm({ job }: { job: Job }) {
  const router = useRouter();
  const [title, setTitle] = useState(job.title);
  const [company, setCompany] = useState(job.company);
  const [location, setLocation] = useState(job.location || "");
  const [description, setDescription] = useState(job.description);
  const [url, setUrl] = useState(job.url || "");
  const [country, setCountry] = useState(job.country);
  const [sponsorsVisa, setSponsorsVisa] = useState(job.sponsorsVisa);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch(`/api/admin-jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, company, location, description, url, country, sponsorsVisa }),
      });
      if (!res.ok) throw new Error("Could not save changes");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save changes");
    }

    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-[#D8D3C8] bg-white p-6">
      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Job title</label>
        <input required className="input" value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Company</label>
        <input required className="input" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-[#202A3C]">Location</label>
          <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} />
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
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-[#202A3C]">Application URL</label>
        <input className="input" value={url} onChange={(e) => setUrl(e.target.value)} />
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
      {saved && <p className="text-sm text-[#3F6C51]">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-[#202A3C] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] disabled:opacity-60"
      >
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
