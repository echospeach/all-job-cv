import Link from "next/link";
import { Source_Serif_4 } from "next/font/google";
import HomeJobSearch from "@/app/components/HomeJobSearch";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"] });

export default function Home() {
  return (
    <main className="bg-[#F0EEE8]">
      {/* Hero */}
      <section className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
            All job CV
          </p>
          <h1 className="text-4xl font-semibold leading-tight text-[#202A3C] sm:text-5xl">
            Build a CV that actually gets you the job.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-[#5C5A52]">
            Write your CV once. We match it against real job openings and show
            you exactly where you fit — no guesswork, no generic templates.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link
              href="/builder"
              className="rounded-lg bg-[#202A3C] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#2C3B52]"
            >
              Build your CV
            </Link>
            <span className="text-sm text-[#8B8578]">Free to start</span>
          </div>
        </div>

        {/* Sample CV card */}
        <div className="relative">
          <div
            className={`${serif.className} mx-auto max-w-sm -rotate-2 rounded-sm bg-[#FAF9F6] p-8 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_20px_40px_rgba(32,42,60,0.16)]`}
          >
            <h2 className="text-xl font-semibold text-[#202A3C]">Amara Okafor</h2>
            <p className="mt-1 text-[14px] text-[#3F6C51]">Product designer</p>
            <div className="mt-5">
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
              <p className="mt-1 text-[14px] text-[#202A3C]">
                Figma, user research, design systems
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Job search */}
      <section className="border-t border-[#D8D3C8] bg-[#F0EEE8] py-14">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-2 text-center text-sm font-medium text-[#202A3C]">
            Or search thousands of live UK job listings right now
          </p>
          <HomeJobSearch />
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[#D8D3C8] bg-[#FAF9F6]">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 sm:grid-cols-3">
          <Feature
            title="Write it once"
            body="Fill in your experience, skills, and education in a clean editor with a live preview."
          />
          <Feature
            title="Get matched"
            body="Your CV is compared against real listings so you see the roles you're actually suited for."
          />
          <Feature
            title="Apply with confidence"
            body="Export a polished PDF or apply straight from a match, tailored to each posting."
          />
        </div>
      </section>
    </main>
  );
}

function Feature({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold text-[#202A3C]">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-[#5C5A52]">{body}</p>
    </div>
  );
}
