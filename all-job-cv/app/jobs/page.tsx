"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ukLocations } from "@/app/lib/ukLocations";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string | null;
  description: string;
  url: string | null;
};

export default function JobsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchJobs = useCallback(async (q: string, loc: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (loc) params.set("location", loc);
      const res = await fetch(`/api/jobs/search?${params.toString()}`);
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setJobs(data);
    } catch {
      setError("Could not load jobs. Please try again.");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchJobs(searchParams.get("q") || "", searchParams.get("location") || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
    fetchJobs(keyword, location);
  }

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Job search
        </p>
        <h1 className="mb-6 text-2xl font-semibold text-[#202A3C]">Find your next role</h1>

        <form onSubmit={handleSearch} className="mb-8 flex flex-col gap-3 sm:flex-row">
          <input
            className="input flex-1"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <input
            className="input flex-1"
            placeholder="Location, e.g. Manchester"
            list="uk-locations"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <datalist id="uk-locations">
            {ukLocations.map((loc) => (
              <option key={loc} value={loc} />
            ))}
          </datalist>
          <button
            type="submit"
            className="rounded-lg bg-[#202A3C] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52]"
          >
            Search
          </button>
        </form>

        {loading && <p className="text-sm text-[#8B8578]">Loading jobs...</p>}
        {error && <p className="text-sm text-[#993C1D]">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#D8D3C8] bg-white px-6 py-16 text-center">
            <p className="text-[15px] text-[#5C5A52]">No jobs found. Try a different search.</p>
          </div>
        )}

        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[15px] font-semibold text-[#202A3C]">{job.title}</p>
                  <p className="text-sm text-[#8B8578]">
                    {job.company}
                    {job.location ? ` - ${job.location}` : ""}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#5C5A52] line-clamp-3">
                {job.description}
              </p>
              {job.url && (
                <a href={job.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block rounded-lg bg-[#3F6C51] px-4 py-2 text-sm font-medium text-white hover:bg-[#345A44]">
                  View and apply
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
