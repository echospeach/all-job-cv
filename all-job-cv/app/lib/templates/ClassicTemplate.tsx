import { Source_Serif_4 } from "next/font/google";
import type { CvContent } from "@/app/lib/cvTypes";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"] });

export default function ClassicTemplate({ content }: { content: CvContent }) {
  const { name, title, email, summary, skills, experience } = content;

  return (
    <div className={`${serif.className} rounded-sm bg-[#FAF9F6] p-10 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_rgba(32,42,60,0.12)]`}>
      <h2 className="text-2xl font-semibold text-[#202A3C]">{name || "Your name"}</h2>
      <p className="mt-1 text-[15px] text-[#3F6C51]">{title || "Your job title"}</p>
      <p className="mt-1 text-sm text-[#8B8578]">{email || "you@example.com"}</p>

      {summary && <p className="mt-6 text-[15px] leading-relaxed text-[#202A3C]">{summary}</p>}

      {skills && (
        <div className="mt-6">
          <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B8578]">Skills</p>
          <p className="mt-1 text-[15px] text-[#202A3C]">{skills}</p>
        </div>
      )}

      {experience && experience.some((e) => e.role || e.company) && (
        <div className="mt-6">
          <p className="text-xs font-sans font-medium uppercase tracking-widest text-[#8B8578]">Experience</p>
          <div className="mt-2 space-y-4">
            {experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i}>
                  <p className="text-[15px] font-semibold text-[#202A3C]">
                    {exp.role || "Role"} {exp.company && `· ${exp.company}`}
                  </p>
                  {exp.dates && <p className="text-sm text-[#8B8578]">{exp.dates}</p>}
                  {exp.description && (
                    <p className="mt-1 text-[15px] leading-relaxed text-[#202A3C]">{exp.description}</p>
                  )}
                </div>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
