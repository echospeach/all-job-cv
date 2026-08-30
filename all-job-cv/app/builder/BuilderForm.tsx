"use client";

import Link from "next/link";
import { useState } from "react";
import { Source_Serif_4 } from "next/font/google";

const serif = Source_Serif_4({ subsets: ["latin"], weight: ["400", "600"] });

type Experience = {
  role: string;
  company: string;
  dates: string;
  description: string;
};

type CvContent = {
  name?: string;
  title?: string;
  email?: string;
  summary?: string;
  skills?: string;
  experience?: Experience[];
};

type ExistingCv = {
  id: string;
  title: string;
  content: CvContent;
};

export default function BuilderForm({
  userId,
  existingCv,
}: {
  userId: string;
  existingCv?: ExistingCv;
}) {
  const c = existingCv?.content;

  const [name, setName] = useState(c?.name ?? "");
  const [title, setTitle] = useState(c?.title ?? "");
  const [email, setEmail] = useState(c?.email ?? "");
  const [summary, setSummary] = useState(c?.summary ?? "");
  const [skills, setSkills] = useState(c?.skills ?? "");
  const [experience, setExperience] = useState<Experience[]>(
    c?.experience?.length
      ? c.experience
      : [{ role: "", company: "", dates: "", description: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateExperience(index: number, field: keyof Experience, value: string) {
    setExperience((prev) =>
      prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp))
    );
  }

  function addExperience() {
    setExperience((prev) => [...prev, { role: "", company: "", dates: "", description: "" }]);
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const content = { name, title, email, summary, skills, experience };

    try {
      if (existingCv) {
        const res = await fetch(`/api/cv/${existingCv.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title || "Untitled CV", content }),
        });
        console.log("PATCH status:", res.status);
        setSaving(false);
        setSaved(true);
      } else {
        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title: title || "Untitled CV", content }),
        });
        console.log("POST status:", res.status);
        const created = await res.json();
        console.log("Created CV id:", created.id);
        setSaving(false);
        setSaved(true);
        window.location.href = `/builder/${created.id}`;
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
            CV builder
          </p>
          <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">
            {existingCv ? "Edit your CV" : "Build your CV"}
          </h1>
          {existingCv && (
            <Link href={`/builder/${existingCv.id}/matches`} className="mb-6 inline-block text-sm font-medium text-[#3F6C51] hover:underline">
              See job matches →
            </Link>
          )}

          <div className="space-y-5">
            <Field label="Full name">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </Field>

            <Field label="Job title">
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Designer" />
            </Field>

            <Field label="Email">
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </Field>

            <Field label="Summary">
              <textarea className="input min-h-[90px]" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="A short summary of your experience and goals." />
            </Field>

            <Field label="Skills (comma separated)">
              <input className="input" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="Figma, TypeScript, User research" />
            </Field>

            <div>
              <p className="mb-2 text-sm font-medium text-[#202A3C]">Experience</p>
              <div className="space-y-4">
                {experience.map((exp, i) => (
                  <div key={i} className="rounded-lg border border-[#D8D3C8] p-4">
                    <input className="input mb-2" value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Role" />
                    <input className="input mb-2" value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" />
                    <input className="input mb-2" value={exp.dates} onChange={(e) => updateExperience(i, "dates", e.target.value)} placeholder="2022 — Present" />
                    <textarea className="input min-h-[70px]" value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="What did you do?" />
                  </div>
                ))}
              </div>
              <button onClick={addExperience} className="mt-3 text-sm font-medium text-[#3F6C51] hover:underline">
                + Add another role
              </button>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full rounded-lg bg-[#202A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2C3B52] disabled:opacity-60"
            >
              {saving ? "Saving…" : saved ? "Saved" : "Save CV"}
            </button>
          </div>
        </div>

        <div className="lg:sticky lg:top-12 lg:self-start">
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

            {experience.some((e) => e.role || e.company) && (
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
                        {exp.description && <p className="mt-1 text-[15px] leading-relaxed text-[#202A3C]">{exp.description}</p>}
                      </div>
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#202A3C]">{label}</label>
      {children}
    </div>
  );
}
