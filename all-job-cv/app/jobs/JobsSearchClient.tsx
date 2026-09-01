"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { locationsByCountry } from "@/app/lib/locationsByCountry";
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
  matchScore: number | null;
};

export default function JobsSearchClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get("q") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [country, setCountry] = useState(searchParams.get("country") || "gb");
  const [sponsorship, setSponsorship] = useState(searchParams.get("sponsorship") === "1");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortByMatch, setSortByMatch] = useState(false);

  const fetchJobs = useCallback(async (q: string, loc: string, c: string, s: boolean) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (loc) params.set("location", loc);
      if (c) params.set("country", c);
      if (s) params.set("sponsorship", "1");
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
    fetchJobs(
      searchParams.get("q") || "",
      searchParams.get("location") || "",
      searchParams.get("country") || "gb",
      searchParams.get("sponsorship") === "1"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    if (country) params.set("country", country);
    if (sponsorship) params.set("sponsorship", "1");
    router.push(`/jobs?${params.toString()}`);
    fetchJobs(keyword, location, country, sponsorship);
  }

  const countryLabel = countries.find((c) => c.code === country)?.label || "";
  const hasScores = jobs.some((j) => j.matchScore !== null);
  const displayedJobs = sortByMatch && hasScores
    ? [...jobs].sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0))
    : jobs;

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Job search
        </p>
        <h1 className="mb-6 text-2xl font-semibold text-[#202A3C]">Find your next role</h1>

        <form onSubmit={handleSearch} className="mb-8 rounded-lg border border-[#D8D3C8] bg-white p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#8B8578]">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="input"
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#8B8578]">Job title or keyword</label>
              <input
                className="input"
                placeholder="e.g. Software developer"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-[#8B8578]">Location</label>
              <input
                className="input"
                placeholder="e.g. Manchester"
                list="uk-locations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <datalist id="uk-locations">
                {(locationsByCountry[country] || []).map((loc) => (
                  <option key={loc} value={loc} />
                ))}
              </datalist>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-lg bg-[#202A3C] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2C3B52] sm:w-auto"
              >
                Search
              </button>
            </div>
          </div>

          <label className="mt-4 flex items-center gap-2 text-sm text-[#202A3C]">
            <input
              type="checkbox"
              checked={sponsorship}
              onChange={(e) => setSponsorship(e.target.checked)}
              className="h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
            />
            Only show jobs that may offer visa sponsorship
          </label>
          <p className="mt-1 text-xs text-[#8B8578]">
            Based on search results from job boards. Always confirm sponsorship directly with the employer.
          </p>
        </form>

        {!loading && !hasScores && (
          <p className="mb-4 text-sm text-[#8B8578]">
            <Link href="/builder" className="font-medium text-[#3F6C51] hover:underline">
              Build a CV
            </Link>{" "}
            to see how well each job matches your skills.
          </p>
        )}

        {hasScores && (
          <label className="mb-4 flex items-center gap-2 text-sm text-[#202A3C]">
            <input
              type="checkbox"
              checked={sortByMatch}
              onChange={(e) => setSortByMatch(e.target.checked)}
              className="h-4 w-4 rounded border-[#D8D3C8] accent-[#3F6C51]"
            />
            Sort by best match
          </label>
        )}

        {loading && <p className="text-sm text-[#8B8578]">Loading jobs...</p>}
        {error && <p className="text-sm text-[#993C1D]">{error}</p>}

        {!loading && !error && jobs.length === 0 && (
          <div className="rounded-lg border border-dashed border-[#D8D3C8] bg-white px-6 py-16 text-center">
            <p className="text-[15px] text-[#5C5A52]">
              No jobs found in {countryLabel}. Try a different search.
            </p>
          </div>
        )}

        <div className="space-y-3">
          {displayedJobs.map((job) => (
            <div key={job.id} className="rounded-lg border border-[#D8D3C8] bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/jobs/${job.id}`} className="text-[15px] font-semibold text-[#202A3C] hover:underline">
                    {job.title}
                  </Link>
                  <p className="text-sm text-[#8B8578]">
                    {job.company}
                    {job.location ? ` - ${job.location}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  {job.matchScore !== null && (
                    <span
                      className={
                        job.matchScore >= 50
                          ? "rounded-full bg-[#EAF3DE] px-2.5 py-1 text-xs font-semibold text-[#3F6C51]"
                          : "rounded-full bg-[#F0EEE8] px-2.5 py-1 text-xs font-medium text-[#8B8578]"
                      }
                    >
                      {job.matchScore}% keyword match
                    </span>
                  )}
                  {job.sponsorsVisa && (
                    <span className="rounded-full bg-[#EAF3DE] px-2.5 py-1 text-xs font-medium text-[#3F6C51]">
                      May sponsor visa
                    </span>
                  )}
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
