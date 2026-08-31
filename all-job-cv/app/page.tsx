import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";
import HomeJobSearch from "@/app/components/HomeJobSearch";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"] });

function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("");
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#EAF3DE] text-sm font-semibold text-[#3F6C51]">
      {initials}
    </div>
  );
}

export default function Home() {
  return (
    <main className="bg-[#F0EEE8]">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(700px circle at 78% 25%, rgba(63,108,81,0.08), transparent)",
          }}
        />
        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
              Job-matched CVs
            </p>
            <h1 className="text-4xl font-semibold leading-tight text-[#202A3C] sm:text-5xl">
              Build a CV that actually gets you the job.
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#5C5A52]">
              Write your CV once. We score it against live openings and show
              you exactly where you fit — no guesswork, no generic templates.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/builder"
                className="rounded-lg bg-[#202A3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2C3B52]"
              >
                Build your CV
              </Link>
              <Link
                href="/jobs"
                className="rounded-lg border border-[#D8D3C8] bg-white px-6 py-3 text-sm font-medium text-[#202A3C] transition hover:border-[#8B8578]"
              >
                See matched jobs
              </Link>
            </div>
            <p className="mt-4 text-sm text-[#8B8578]">Free to start · ATS-ready PDF</p>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-[#D8D3C8] pt-6">
              <div>
                <p className="text-xl font-semibold text-[#202A3C]">6</p>
                <p className="mt-0.5 text-xs text-[#8B8578]">CV templates</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-[#202A3C]">4</p>
                <p className="mt-0.5 text-xs text-[#8B8578]">Countries covered</p>
              </div>
              <div>
                <p className="text-xl font-semibold text-[#202A3C]">Live</p>
                <p className="mt-0.5 text-xs text-[#8B8578]">Jobs, updated daily</p>
              </div>
            </div>
          </div>

          {/* Overlapping cards */}
          <div className="relative mx-auto w-full max-w-md pb-16 pr-10 sm:pb-20 sm:pr-16">
            <div
              className={`${serif.className} rounded-sm bg-[#FAF9F6] p-7 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_rgba(32,42,60,0.16)]`}
            >
              <div className="flex items-center gap-3">
                <Initials name="Amara Okafor" />
                <div>
                  <h2 className="text-lg font-semibold text-[#202A3C]">Amara Okafor</h2>
                  <p className="text-[13px] text-[#3F6C51]">Product designer</p>
                </div>
              </div>

              <div className="mt-5 border-t border-[#D8D3C8] pt-4">
                <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B8578]">
                  Experience
                </p>
                <p className="mt-2 text-[14px] font-semibold text-[#202A3C]">
                  Senior designer · Northline
                </p>
                <p className="text-[13px] text-[#8B8578]">2022 — Present</p>
              </div>

              <div className="mt-4">
                <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B8578]">
                  Skills
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[12px] font-medium text-[#3F6C51]">
                    Figma
                  </span>
                  <span className="rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[12px] font-medium text-[#3F6C51]">
                    User research
                  </span>
                  <span className="rounded-full bg-[#EAF3DE] px-2.5 py-1 text-[12px] font-medium text-[#3F6C51]">
                    Design systems
                  </span>
                </div>
              </div>
            </div>

            {/* Floating match card */}
            <div className="relative mt-4 w-full rounded-lg bg-[#202A3C] p-5 text-white shadow-[0_1px_2px_rgba(0,0,0,0.06),0_16px_32px_rgba(32,42,60,0.28)] sm:absolute sm:-bottom-6 sm:-right-6 sm:mt-0 sm:w-72">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#3F6C51]">
                  <StarIcon />
                </span>
                <span className="text-sm font-semibold text-[#A8D08D]">92% match</span>
              </div>
              <p className="mt-3 text-base font-semibold">Senior Product Designer</p>
              <p className="text-sm text-white/70">Northline</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/15 pt-3">
                <span className="flex items-center gap-1.5 text-xs text-white/70">
                  <BuildingIcon />
                  London, UK · Full-time
                </span>
                <Link
                  href="/jobs"
                  className="flex items-center gap-1 rounded-lg bg-[#A8D08D] px-3 py-1.5 text-xs font-semibold text-[#1B3324] hover:bg-[#98C27A]"
                >
                  Apply
                  <ArrowIcon />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Job search */}
      <section className="border-t border-[#D8D3C8] bg-[#F0EEE8] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-center text-sm font-medium text-[#202A3C]">
            Or search thousands of live job listings right now
          </p>
          <HomeJobSearch />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#D8D3C8] bg-[#FAF9F6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
          <Feature
            icon={<PenIcon />}
            title="Write it once"
            body="Fill in your experience, skills, and education in a clean editor with a live preview."
          />
          <Feature
            icon={<TargetIcon />}
            title="Get matched"
            body="Your CV is compared against real listings so you see the roles you're actually suited for."
          />
          <Feature
            icon={<CheckIcon />}
            title="Apply with confidence"
            body="Export a polished PDF or apply straight from a match, tailored to each posting."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#EAF3DE] text-[#3F6C51]">
        {icon}
      </div>
      <h3 className="text-[15px] font-semibold text-[#202A3C]">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[#5C5A52]">{body}</p>
    </div>
  );
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
      <path d="M6 0.5L7.4 4.2L11.3 4.6L8.3 7.1L9.3 11L6 8.8L2.7 11L3.7 7.1L0.7 4.6L4.6 4.2L6 0.5Z" />
    </svg>
  );
}

function BuildingIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <rect x="2" y="2" width="10" height="11" stroke="currentColor" strokeWidth="1.2" />
      <rect x="4" y="4.5" width="1.5" height="1.5" fill="currentColor" />
      <rect x="8.5" y="4.5" width="1.5" height="1.5" fill="currentColor" />
      <rect x="4" y="8" width="1.5" height="1.5" fill="currentColor" />
      <rect x="8.5" y="8" width="1.5" height="1.5" fill="currentColor" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M2.5 6H9.5M9.5 6L6.5 3M9.5 6L6.5 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PenIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M11.5 2.5L15.5 6.5L6 16H2V12L11.5 2.5Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

function TargetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="3.5" stroke="currentColor" strokeWidth="1.4" />
      <circle cx="9" cy="9" r="0.8" fill="currentColor" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 9.5L7 13.5L15 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
