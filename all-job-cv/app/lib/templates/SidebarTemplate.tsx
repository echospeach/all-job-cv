import type { CvContent } from "@/app/lib/cvTypes";

function initials(name?: string): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}

function bulletsFrom(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function SidebarTemplate({ content }: { content: CvContent }) {
  const {
    name,
    title,
    email,
    phone,
    location,
    postcode,
    linkedin,
    summary,
    skills,
    experience,
    education,
    languages,
    certificates,
  } = content;
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];
  const languageList = languages ? languages.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="flex overflow-hidden rounded-sm shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_rgba(32,42,60,0.12)]">
      <div className="w-[38%] bg-[#2E5A9C] p-6 text-white">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded bg-white text-lg font-bold text-[#2E5A9C]">
          {initials(name)}
        </div>

        <p className="text-xs font-bold uppercase tracking-wide text-white/80">Contact</p>
        <div className="mt-2 space-y-1 text-sm">
          {email && <p>{email}</p>}
          {phone && <p>{phone}</p>}
          {(location || postcode) && <p>{[location, postcode].filter(Boolean).join(" ")}</p>}
          {linkedin && <p>{linkedin}</p>}
        </div>

        {skillList.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">Skills</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {skillList.map((skill, i) => (
                <li key={i}>{skill}</li>
              ))}
            </ul>
          </div>
        )}

        {languageList.length > 0 && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">Languages</p>
            <div className="mt-2 space-y-1 text-sm">
              {languageList.map((lang, i) => (
                <p key={i}>{lang}</p>
              ))}
            </div>
          </div>
        )}

        {certificates && certificates.some((c) => c.name) && (
          <div className="mt-6">
            <p className="text-xs font-bold uppercase tracking-wide text-white/80">Certificates</p>
            <ul className="mt-2 list-disc space-y-1 pl-4 text-sm">
              {certificates.map((c, i) =>
                c.name ? (
                  <li key={i}>
                    {c.name}
                    {c.issuer && <span className="text-white/80"> - {c.issuer}</span>}
                  </li>
                ) : null
              )}
            </ul>
          </div>
        )}
      </div>

      <div className="w-[62%] bg-white p-7">
        <h2 className="text-xl font-bold text-black">{name || "Your name"}</h2>
        {title && <p className="mt-0.5 text-sm text-black/70">{title}</p>}
        <div className="mt-2 border-b border-black/15" />

        {summary && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-black">Summary</p>
            <p className="mt-2 text-sm leading-relaxed text-black/90">{summary}</p>
          </div>
        )}

        {experience && experience.some((e) => e.role || e.company) && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-black">Experience</p>
            <div className="mt-2 space-y-4">
              {experience.map((exp, i) =>
                exp.role || exp.company ? (
                  <div key={i}>
                    <p className="text-sm font-semibold text-black">
                      {exp.company || "Company"}
                      {exp.role && <span> | {exp.role}</span>}
                    </p>
                    {exp.dates && <p className="text-xs text-black/60">{exp.dates}</p>}
                    {exp.description && (
                      <ul className="mt-1 list-disc space-y-0.5 pl-5">
                        {bulletsFrom(exp.description).map((line, j) => (
                          <li key={j} className="text-sm text-black/90">{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        {education && education.some((e) => e.qualification || e.institution) && (
          <div className="mt-5">
            <p className="text-xs font-bold uppercase tracking-wide text-black">Education</p>
            <div className="mt-2 space-y-1.5">
              {education.map((ed, i) =>
                ed.qualification || ed.institution ? (
                  <div key={i}>
                    <p className="text-sm font-semibold text-black">{ed.qualification}</p>
                    <p className="text-sm italic text-black/70">
                      {ed.institution}
                      {ed.date && ` - ${ed.date}`}
                    </p>
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
