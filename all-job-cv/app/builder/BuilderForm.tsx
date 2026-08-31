"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { CvContent, Experience, Education, Certificate } from "@/app/lib/cvTypes";
import ClassicTemplate from "@/app/lib/templates/ClassicTemplate";
import ModernTemplate from "@/app/lib/templates/ModernTemplate";
import MinimalTemplate from "@/app/lib/templates/MinimalTemplate";
import ProfileTemplate from "@/app/lib/templates/ProfileTemplate";
import CompactTemplate from "@/app/lib/templates/CompactTemplate";
import SidebarTemplate from "@/app/lib/templates/SidebarTemplate";
import TemplatePicker from "./TemplatePicker";
import TemplateGallery from "./TemplateGallery";
import BulletEditor from "./BulletEditor";
import PaywallModal from "./[id]/PaywallModal";

type ExistingCv = {
  id: string;
  title: string;
  content: CvContent;
  template?: string;
  paidUnlocked?: boolean;
};

const templates = [
  { id: "classic", label: "Classic" },
  { id: "modern", label: "Modern" },
  { id: "minimal", label: "Minimal (ATS-safe)" },
  { id: "profile", label: "Profile (with photo)" },
  { id: "compact", label: "Compact (photo + 2-col skills)" },
  { id: "sidebar", label: "Sidebar (color block)" },
];

const needsPhoto = ["profile", "compact", "sidebar"];
const premiumTemplates = ["modern", "profile", "compact", "sidebar"];
const needsTagline = ["profile", "compact"];
const needsExtendedContact = ["sidebar"];

export default function BuilderForm({
  userId,
  existingCv,
  initialTemplate,
  isSubscribed = false,
  openPaywallOnLoad = false,
}: {
  userId: string;
  existingCv?: ExistingCv;
  initialTemplate?: string;
  isSubscribed?: boolean;
  openPaywallOnLoad?: boolean;
}) {
  const c = existingCv?.content;

  const [name, setName] = useState(c?.name ?? "");
  const [title, setTitle] = useState(c?.title ?? "");
  const [email, setEmail] = useState(c?.email ?? "");
  const [phone, setPhone] = useState(c?.phone ?? "");
  const [location, setLocation] = useState(c?.location ?? "");
  const [postcode, setPostcode] = useState(c?.postcode ?? "");
  const [linkedin, setLinkedin] = useState(c?.linkedin ?? "");
  const [summary, setSummary] = useState(c?.summary ?? "");
  const [skills, setSkills] = useState(c?.skills ?? "");
  const [photoUrl, setPhotoUrl] = useState(c?.photoUrl ?? "");
  const [hobbies, setHobbies] = useState(c?.hobbies ?? "");
  const [tagline, setTagline] = useState(c?.tagline ?? "");
  const [languages, setLanguages] = useState(c?.languages ?? "");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");

  const [experience, setExperience] = useState<Experience[]>(
    c?.experience?.length
      ? c.experience
      : [{ role: "", company: "", dates: "", description: "" }]
  );
  const [education, setEducation] = useState<Education[]>(
    c?.education?.length
      ? c.education
      : [{ qualification: "", institution: "", date: "" }]
  );
  const [certificates, setCertificates] = useState<Certificate[]>(
    c?.certificates?.length ? c.certificates : [{ name: "", issuer: "" }]
  );

  const [template, setTemplate] = useState(existingCv?.template ?? initialTemplate ?? "classic");
  const [templateChosen, setTemplateChosen] = useState(Boolean(existingCv || initialTemplate));
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    if (openPaywallOnLoad) {
      setShowPaywall(true);
    }
  }, [openPaywallOnLoad]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    setPhotoError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload-photo", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setPhotoUrl(data.url);
    } catch {
      setPhotoError("Could not upload photo. Please try again.");
    }
    setUploadingPhoto(false);
  }

  function updateExperience(index: number, field: keyof Experience, value: string) {
    setExperience((prev) => prev.map((exp, i) => (i === index ? { ...exp, [field]: value } : exp)));
  }
  function addExperience() {
    setExperience((prev) => [...prev, { role: "", company: "", dates: "", description: "" }]);
  }

  function updateEducation(index: number, field: keyof Education, value: string) {
    setEducation((prev) => prev.map((ed, i) => (i === index ? { ...ed, [field]: value } : ed)));
  }
  function addEducation() {
    setEducation((prev) => [...prev, { qualification: "", institution: "", date: "" }]);
  }

  function updateCertificate(index: number, field: keyof Certificate, value: string) {
    setCertificates((prev) => prev.map((c, i) => (i === index ? { ...c, [field]: value } : c)));
  }
  function addCertificate() {
    setCertificates((prev) => [...prev, { name: "", issuer: "" }]);
  }

  async function handleSave() {
    const isPremiumTemplate = premiumTemplates.includes(template);
    const alreadyUnlocked = isSubscribed || existingCv?.paidUnlocked;

    if (isPremiumTemplate && !alreadyUnlocked && existingCv) {
      setShowPaywall(true);
      return;
    }

    setSaving(true);
    setSaved(false);
    setError("");
    const content: CvContent = {
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
      photoUrl,
      hobbies,
      education,
      tagline,
      languages,
      certificates,
    };

    try {
      if (existingCv) {
        const res = await fetch(`/api/cv/${existingCv.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title: title || "Untitled CV", content, template }),
        });
        if (!res.ok) throw new Error("Server returned " + res.status);
        setSaving(false);
        setSaved(true);
      } else {
        const res = await fetch("/api/cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, title: title || "Untitled CV", content, template }),
        });
        if (!res.ok) throw new Error("Server returned " + res.status);
        const created = await res.json();
        setSaving(false);
        setSaved(true);
        const isPrem = premiumTemplates.includes(template);
        window.location.href = isPrem ? `/builder/${created.id}?premium=1` : `/builder/${created.id}`;
      }
    } catch {
      setError("Could not save your CV. Please check your connection and try again.");
      setSaving(false);
    }
  }

  const previewContent: CvContent = {
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
    photoUrl,
    hobbies,
    education,
    tagline,
    languages,
    certificates,
  };

  const showPhoto = needsPhoto.includes(template);
  const showTagline = needsTagline.includes(template);
  const showExtendedContact = needsExtendedContact.includes(template);
  const showEducationBlock = ["profile", "compact", "sidebar"].includes(template);
  const showCertificates = template === "sidebar";
  const showHobbies = ["profile", "compact"].includes(template);

  if (!templateChosen) {
    return (
      <div className="min-h-screen bg-[#F0EEE8]">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">Step 1 of 2</p>
          <h1 className="mb-2 text-2xl font-semibold text-[#202A3C]">Choose a template</h1>
          <p className="mb-10 max-w-xl text-sm text-[#5C5A52]">Pick a starting look for your CV. You can change this anytime while editing.</p>
          <TemplateGallery selected={template} onSelect={(id) => { setTemplate(id); setTemplateChosen(true); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      {showPaywall && existingCv && (
        <PaywallModal
          cvId={existingCv.id}
          onClose={() => setShowPaywall(false)}
          onUseFree={() => {
            setTemplate("classic");
            setShowPaywall(false);
          }}
        />
      )}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">CV builder</p>
          <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">
            {existingCv ? "Edit your CV" : "Build your CV"}
          </h1>
          {existingCv && (
            <div className="mb-6 flex gap-4">
              <Link href={`/builder/${existingCv.id}/preview`} className="text-sm font-medium text-[#3F6C51] hover:underline">
                Full preview
              </Link>
              <Link href={`/builder/${existingCv.id}/matches`} className="text-sm font-medium text-[#3F6C51] hover:underline">
                See job matches
              </Link>
            </div>
          )}

          <div className="space-y-5">
            <TemplatePicker value={template} onChange={setTemplate} />

            <Field label="Full name">
              <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
            </Field>

            <Field label="Job title">
              <input className="input" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Product Designer" />
            </Field>

            <Field label="Email">
              <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@example.com" />
            </Field>

            <Field label="Phone">
              <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+44 7700 900000" />
            </Field>
            <Field label="Location">
              <input className="input" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Manchester, UK" />
            </Field>
            <Field label="Postcode">
              <input className="input" value={postcode} onChange={(e) => setPostcode(e.target.value)} placeholder="M11 1HL" />
            </Field>
            {showExtendedContact && (
              <Field label="LinkedIn (optional)">
                <input className="input" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="linkedin.com/in/janedoe" />
              </Field>
            )}

            {showTagline && (
              <>
                <Field label="Tagline (optional)">
                  <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g. Warehouse - Hospitality - Manual Roles" />
                </Field>
                <Field label="Languages (optional)">
                  <input className="input" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English, Arabic, German" />
                </Field>
              </>
            )}

            {showPhoto && (
              <Field label="Photo (optional)">
                <div className="flex items-center gap-3">
                  {photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photoUrl} alt="" className="h-12 w-12 rounded object-cover" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="text-sm text-[#5C5A52] file:mr-3 file:rounded-lg file:border file:border-[#D8D3C8] file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#202A3C] hover:file:bg-[#F0EEE8]"
                  />
                </div>
                {uploadingPhoto && <p className="mt-1 text-xs text-[#8B8578]">Uploading...</p>}
                {photoError && <p className="mt-1 text-xs text-[#993C1D]">{photoError}</p>}
              </Field>
            )}

            {template === "sidebar" && (
              <Field label="Languages (comma separated, optional)">
                <input className="input" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="English (Fluent), Hindi (Native)" />
              </Field>
            )}

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
                    <input className="input mb-2" value={exp.dates} onChange={(e) => updateExperience(i, "dates", e.target.value)} placeholder="2022 - Present" />
                    <BulletEditor
                      value={exp.description}
                      onChange={(val) => updateExperience(i, "description", val)}
                    />
                  </div>
                ))}
              </div>
              <button onClick={addExperience} className="mt-3 text-sm font-medium text-[#3F6C51] hover:underline">
                + Add another role
              </button>
            </div>

            {showEducationBlock && (
              <div>
                <p className="mb-2 text-sm font-medium text-[#202A3C]">Education & Training</p>
                <div className="space-y-3">
                  {education.map((ed, i) => (
                    <div key={i} className="rounded-lg border border-[#D8D3C8] p-4">
                      <input className="input mb-2" value={ed.qualification} onChange={(e) => updateEducation(i, "qualification", e.target.value)} placeholder="Qualification" />
                      <input className="input mb-2" value={ed.institution} onChange={(e) => updateEducation(i, "institution", e.target.value)} placeholder="Institution" />
                      <input className="input" value={ed.date} onChange={(e) => updateEducation(i, "date", e.target.value)} placeholder="Date" />
                    </div>
                  ))}
                </div>
                <button onClick={addEducation} className="mt-3 text-sm font-medium text-[#3F6C51] hover:underline">
                  + Add another qualification
                </button>
              </div>
            )}

            {showCertificates && (
              <div>
                <p className="mb-2 text-sm font-medium text-[#202A3C]">Certificates</p>
                <div className="space-y-3">
                  {certificates.map((cert, i) => (
                    <div key={i} className="rounded-lg border border-[#D8D3C8] p-4">
                      <input className="input mb-2" value={cert.name} onChange={(e) => updateCertificate(i, "name", e.target.value)} placeholder="Certificate name" />
                      <input className="input" value={cert.issuer} onChange={(e) => updateCertificate(i, "issuer", e.target.value)} placeholder="Issuer" />
                    </div>
                  ))}
                </div>
                <button onClick={addCertificate} className="mt-3 text-sm font-medium text-[#3F6C51] hover:underline">
                  + Add another certificate
                </button>
              </div>
            )}

            {showHobbies && (
              <Field label="Hobbies & Interests">
                <textarea className="input min-h-[70px]" value={hobbies} onChange={(e) => setHobbies(e.target.value)} placeholder="What do you enjoy outside work?" />
              </Field>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-4 w-full rounded-lg bg-[#202A3C] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#2C3B52] disabled:opacity-60"
            >
              {saving ? "Saving..." : saved ? "Saved" : "Save CV"}
            </button>
            {error && (
              <div className="mt-3 rounded-lg border border-[#D97757]/30 bg-[#FBEDE7] px-4 py-3 text-sm text-[#993C1D]">
                {error}
              </div>
            )}
          </div>
        </div>

        <div className="lg:sticky lg:top-12 lg:self-start">
          {template === "modern" ? (
            <ModernTemplate content={previewContent} />
          ) : template === "minimal" ? (
            <MinimalTemplate content={previewContent} />
          ) : template === "profile" ? (
            <ProfileTemplate content={previewContent} />
          ) : template === "compact" ? (
            <CompactTemplate content={previewContent} />
          ) : template === "sidebar" ? (
            <SidebarTemplate content={previewContent} />
          ) : (
            <ClassicTemplate content={previewContent} />
          )}
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
