import type { CvContent } from "@/app/lib/cvTypes";

function bulletsFrom(text: string): string[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function ProfileTemplate({ content }: { content: CvContent }) {
  const { name, email, summary, skills, experience, photoUrl, hobbies, education } = content;
  const skillList = skills ? skills.split(",").map((s) => s.trim()).filter(Boolean) : [];

  return (
    <div className="bg-white p-9 shadow-[0_1px_2px_rgba(0,0,0,0.06),0_12px_28px_rgba(32,42,60,0.12)]">
      <div className="flex items-start justify-between border-b border-black/15 pb-4">
        <div>
          <h2 className="text-lg font-bold uppercase tracking-wide text-black">
            {name || "Your name"}
          </h2>
          <p className="mt-1 text-sm text-black/70">{email || "you@example.com"}</p>
        </div>
        {photoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            className="h-16 w-16 rounded object-cover"
          />
        )}
      </div>

      {summary && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-black">Personal Profile</p>
          <p className="mt-2 text-sm leading-relaxed text-black/90">{summary}</p>
        </div>
      )}

      {skillList.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-black">Key Skills</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {skillList.map((skill, i) => (
              <li key={i} className="text-sm text-black/90">{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {experience && experience.some((e) => e.role || e.company) && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-black">Work Experience</p>
          <div className="mt-2 space-y-4">
            {experience.map((exp, i) =>
              exp.role || exp.company ? (
                <div key={i}>
                  <p className="text-sm font-semibold text-black">
                    {exp.role || "Role"}
                    {exp.company && <span className="font-normal italic"> - {exp.company}</span>}
                    {exp.dates && <span className="font-normal text-black/60"> {exp.dates}</span>}
                  </p>
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
          <p className="text-xs font-bold uppercase tracking-wide text-black">Education & Training</p>
          <div className="mt-2 space-y-1">
            {education.map((ed, i) =>
              ed.qualification || ed.institution ? (
                <p key={i} className="text-sm text-black/90">
                  <span className="font-semibold">{ed.qualification}</span>
                  {ed.institution && ` - ${ed.institution}`}
                  {ed.date && ` (${ed.date})`}
                </p>
              ) : null
            )}
          </div>
        </div>
      )}

      {hobbies && (
        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-black">Hobbies & Interests</p>
          <p className="mt-2 text-sm leading-relaxed text-black/90">{hobbies}</p>
        </div>
      )}

      <p className="mt-5 text-xs italic text-black/60">References available on request.</p>
    </div>
  );
}
