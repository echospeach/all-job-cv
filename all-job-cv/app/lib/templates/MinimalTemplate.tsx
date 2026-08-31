import type { CvContent } from "@/app/lib/cvTypes";

export default function MinimalTemplate({ content }: { content: CvContent }) {
  const { name, title, email, phone, location, summary, skills, experience } = content;

  return (
    <div className="bg-white p-10 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_rgba(32,42,60,0.12)]">
      <h2 className="text-xl font-semibold text-black">{name || "Your name"}</h2>
      <p className="mt-0.5 text-sm text-black/70">{title || "Your job title"}</p>
      <p className="mt-0.5 text-sm text-black/70">
        {[email || "you@example.com", phone, location].filter(Boolean).join(" - ")}
      </p>

      {summary && (
        <div className="mt-6 border-t border-black/15 pt-4">
          <p className="text-sm leading-relaxed text-black">{summary}</p>
        </div>
      )}

      {skills && (
        <div className="mt-6 border-t border-black/15 pt-4">
          <p className="text-xs font-semibold uppercase text-black/60">Skills</p>
          <p className="mt-1.5 text-sm text-black">{skills}</p>
        </div>
      )}

      {experience && experience.some((e) => e.role || e.company) && (
        <div className="mt-6 border-t border-black/15 pt-4">
          <p className="text-xs font-semibold uppercase text-black/60">Experience</p>
          <div className="mt-2 space-y-4">
            {experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i}>
                  <div className="flex items-baseline justify-between">
                    <p className="text-sm font-semibold text-black">
                      {exp.role || "Role"} {exp.company && `- ${exp.company}`}
                    </p>
                    {exp.dates && <p className="text-xs text-black/60">{exp.dates}</p>}
                  </div>
                  {exp.description && (
                    <p className="mt-1 text-sm leading-relaxed text-black/80">{exp.description}</p>
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
