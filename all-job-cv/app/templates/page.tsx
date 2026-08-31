import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/app/lib/auth";
import { sampleCv } from "@/app/lib/sampleCv";
import ClassicTemplate from "@/app/lib/templates/ClassicTemplate";
import ModernTemplate from "@/app/lib/templates/ModernTemplate";
import MinimalTemplate from "@/app/lib/templates/MinimalTemplate";
import ProfileTemplate from "@/app/lib/templates/ProfileTemplate";
import CompactTemplate from "@/app/lib/templates/CompactTemplate";
import SidebarTemplate from "@/app/lib/templates/SidebarTemplate";

const templateList = [
  { id: "classic", label: "Classic", blurb: "Traditional and serif. Best for law, academia, finance.", Component: ClassicTemplate },
  { id: "modern", label: "Modern", blurb: "Sans-serif sidebar. Best for design and product roles.", Component: ModernTemplate },
  { id: "minimal", label: "Minimal (ATS-safe)", blurb: "No color or graphics. Built to survive automated CV parsing.", Component: MinimalTemplate },
  { id: "profile", label: "Profile", blurb: "Photo, personal profile, and bulleted experience.", Component: ProfileTemplate },
  { id: "compact", label: "Compact", blurb: "Photo with a two-column skills layout.", Component: CompactTemplate },
  { id: "sidebar", label: "Sidebar", blurb: "Color block sidebar with contact, skills, and certificates.", Component: SidebarTemplate },
];

const PAGE_W = 794;
const SCALE = 0.34;

export default async function TemplatesPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Choose a starting point
        </p>
        <h1 className="mb-2 text-2xl font-semibold text-[#202A3C]">Templates</h1>
        <p className="mb-10 max-w-xl text-sm text-[#5C5A52]">
          Pick a template to see how your CV could look. You can switch templates anytime while editing.
        </p>

        <div className="flex flex-wrap justify-center gap-10 sm:justify-start">
          {templateList.map(({ id, label, blurb, Component }) => (
            <Link key={id} href={`/builder?template=${id}`} className="group block">
              <div
                className="overflow-hidden rounded-lg border border-[#D8D3C8] shadow-sm transition group-hover:border-[#3F6C51]"
                style={{ width: PAGE_W * SCALE }}
              >
                <div style={{ width: PAGE_W, zoom: SCALE } as React.CSSProperties}>
                  <Component content={sampleCv} />
                </div>
              </div>
              <p className="mt-3 text-sm font-semibold text-[#202A3C] group-hover:underline">{label}</p>
              <p className="mt-0.5 max-w-[254px] text-xs text-[#8B8578]">{blurb}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
