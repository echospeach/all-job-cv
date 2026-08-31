import type { CvContent } from "@/app/lib/cvTypes";

export const sampleCv: CvContent = {
  name: "Jordan Blake",
  title: "Product Designer",
  email: "jordan.blake@example.com",
  phone: "+44 7700 900123",
  location: "Manchester, UK",
  linkedin: "linkedin.com/in/jordanblake",
  tagline: "Product Design - UX Research - Design Systems",
  languages: "English, Spanish",
  summary:
    "Product designer with 5 years of experience shipping web and mobile products. Focused on research-driven design and building scalable design systems for growing teams.",
  skills: "Figma, User research, Design systems, Prototyping, HTML/CSS",
  photoUrl: "",
  experience: [
    {
      role: "Senior Product Designer",
      company: "Northline",
      dates: "2022 - Present",
      description:
        "Led end-to-end design for the core web app\nRan weekly user research sessions to guide the roadmap\nBuilt and maintained the company design system",
    },
    {
      role: "Product Designer",
      company: "Fieldstone",
      dates: "2019 - 2022",
      description:
        "Designed onboarding flows that improved activation by 18%\nPartnered with engineering to ship features end to end",
    },
  ],
  education: [
    { qualification: "BA Graphic Design", institution: "University of Leeds", date: "2019" },
  ],
  certificates: [{ name: "Certified UX Professional", issuer: "Nielsen Norman Group" }],
  hobbies: "Ceramics, cycling, and coffee brewing.",
};
