import type { CvContent } from "@/app/lib/cvTypes";

export default function ModernTemplate({ content }: { content: CvContent }) {
  const { name, title, email, summary, skills, experience } = content;
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="flex overflow-hidden rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_rgba(32,42,60,0.12)]">
      <div className="w-[34%] bg-[#1B2438] p-6 text-white">
        <h2 className="text-lg font-semibold leading-tight">{name || "Your name"}</h2>
        <p className="mt-1 text-sm text-[#C08A3E]">{title || "Your job title"}</p>
        <p className="mt-4 text-xs text-white/70">{email || "you@example.com"}</p>

        {skillList.length > 0 && (
          <div className="mt-8">
            <p className="text-[11px] font-medium uppercase tracking-wide text-white/50">Skills</p>
            <div className="mt-2 space-y-1.5">
              {skillList.map((skill, i) => (
                <p key={i} className="text-sm text-white/90">{skill}</p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[66%] bg-white p-7">
        {summary && (
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8B8578]">Profile</p>
            <p className="mt-2 text-sm leading-relaxed text-[#202A3C]">{summary}</p>
          </div>
        )}

        {experience && experience.some((e) => e.role || e.company) && (
          <div className="mt-7">
            <p className="text-[11px] font-medium uppercase tracking-wide text-[#8B8578]">Experience</p>
            <div className="mt-2 space-y-4">
              {experience.map((exp, i) =>
                exp.role || exp.company ? (
                  <div key={i}>
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-[#202A3C]">
                        {exp.role || "Role"} {exp.company && `· ${exp.company}`}
                      </p>
                      {exp.dates && <p className="text-xs text-[#8B8578]">{exp.dates}</p>}
                    </div>
                    {exp.description && (
                      <p className="mt-1 text-sm leading-relaxed text-[#5C5A52]">{exp.description}</p>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
