"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ukLocations } from "@/app/lib/ukLocations";

export default function HomeJobSearch() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("q", keyword);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex max-w-2xl flex-col gap-3 rounded-lg border border-[#D8D3C8] bg-white p-3 sm:flex-row"
    >
      <input
        className="input flex-1 border-none focus:shadow-none"
        placeholder="Job title or keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <input
        className="input flex-1 border-none focus:shadow-none sm:border-l sm:border-[#D8D3C8] sm:pl-4"
        placeholder="Location"
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
        className="rounded-lg bg-[#3F6C51] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#345A44]"
      >
        Search jobs
      </button>
    </form>
  );
}
