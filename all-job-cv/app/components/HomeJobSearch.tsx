"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { locationsByCountry } from "@/app/lib/locationsByCountry";
import { countries } from "@/app/lib/countries";

export default function HomeJobSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("gb");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    if (country) params.set("country", country);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto max-w-3xl rounded-lg border border-[#D8D3C8] bg-white p-4"
    >
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
            className="w-full rounded-lg bg-[#3F6C51] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#345A44] sm:w-auto"
          >
            Search jobs
          </button>
        </div>
      </div>
    </form>
  );
}
