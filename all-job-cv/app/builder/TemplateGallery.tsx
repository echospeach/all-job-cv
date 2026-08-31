"use client";

import ClassicTemplate from "@/app/lib/templates/ClassicTemplate";
import ModernTemplate from "@/app/lib/templates/ModernTemplate";
import MinimalTemplate from "@/app/lib/templates/MinimalTemplate";
import ProfileTemplate from "@/app/lib/templates/ProfileTemplate";
import CompactTemplate from "@/app/lib/templates/CompactTemplate";
import SidebarTemplate from "@/app/lib/templates/SidebarTemplate";
import { sampleCv } from "@/app/lib/sampleCv";

const options = [
  { id: "classic", label: "Classic", blurb: "Traditional and serif. Best for law, academia, finance.", Component: ClassicTemplate },
  { id: "modern", label: "Modern", blurb: "Sans-serif sidebar. Best for design and product roles.", Component: ModernTemplate },
  { id: "minimal", label: "Minimal (ATS-safe)", blurb: "No color or graphics. Built to survive automated CV parsing.", Component: MinimalTemplate },
  { id: "profile", label: "Profile", blurb: "Photo, personal profile, and bulleted experience.", Component: ProfileTemplate },
  { id: "compact", label: "Compact", blurb: "Photo with a two-column skills layout.", Component: CompactTemplate },
  { id: "sidebar", label: "Sidebar", blurb: "Color block sidebar with contact, skills, and certificates.", Component: SidebarTemplate },
];

const PAGE_W = 794;
const SCALE = 0.34;

export default function TemplateGallery({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap justify-center gap-10 sm:justify-start">
      {options.map(({ id, label, blurb, Component }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className="group block text-left"
        >
          <div
            className={
              selected === id
                ? "overflow-hidden rounded-lg border-2 border-[#3F6C51] shadow-sm"
                : "overflow-hidden rounded-lg border border-[#D8D3C8] shadow-sm transition group-hover:border-[#3F6C51]"
            }
            style={{ width: PAGE_W * SCALE }}
          >
            <div style={{ width: PAGE_W, zoom: SCALE } as React.CSSProperties}>
              <Component content={sampleCv} />
            </div>
          </div>
          <p className="mt-3 text-sm font-semibold text-[#202A3C] group-hover:underline">{label}</p>
          <p className="mt-0.5 max-w-[254px] text-xs text-[#8B8578]">{blurb}</p>
        </button>
      ))}
    </div>
  );
}
