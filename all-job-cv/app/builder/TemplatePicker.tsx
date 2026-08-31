"use client";

import ClassicTemplate from "@/app/lib/templates/ClassicTemplate";
import ModernTemplate from "@/app/lib/templates/ModernTemplate";
import MinimalTemplate from "@/app/lib/templates/MinimalTemplate";
import ProfileTemplate from "@/app/lib/templates/ProfileTemplate";
import CompactTemplate from "@/app/lib/templates/CompactTemplate";
import SidebarTemplate from "@/app/lib/templates/SidebarTemplate";
import { sampleCv } from "@/app/lib/sampleCv";

const options = [
  { id: "classic", label: "Classic", Component: ClassicTemplate },
  { id: "modern", label: "Modern", Component: ModernTemplate },
  { id: "minimal", label: "Minimal", Component: MinimalTemplate },
  { id: "profile", label: "Profile", Component: ProfileTemplate },
  { id: "compact", label: "Compact", Component: CompactTemplate },
  { id: "sidebar", label: "Sidebar", Component: SidebarTemplate },
];

const PAGE_W = 794;
const SCALE = 0.16;

export default function TemplatePicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div id="template">
      <label className="mb-2 block text-sm font-medium text-[#202A3C]">Template</label>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {options.map(({ id, label, Component }) => (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            className={
              value === id
                ? "overflow-hidden rounded-lg border-2 border-[#3F6C51]"
                : "overflow-hidden rounded-lg border border-[#D8D3C8] hover:border-[#8B8578]"
            }
          >
            <div
              className="pointer-events-none overflow-hidden bg-[#DDD9CE]"
              style={{ height: PAGE_W * SCALE * 1.15 }}
            >
              <div style={{ width: PAGE_W, zoom: SCALE } as React.CSSProperties}>
                <Component content={sampleCv} />
              </div>
            </div>
            <p className="border-t border-[#D8D3C8] bg-white px-1.5 py-1 text-center text-[11px] font-medium text-[#202A3C]">
              {label}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
