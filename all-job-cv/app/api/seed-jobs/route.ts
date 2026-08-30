import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

const sampleJobs = [
  {
    title: "Product Designer",
    company: "Northline",
    location: "Remote",
    description:
      "We're looking for a product designer to lead end-to-end design for our core web app. You'll work closely with engineering and product to ship user-facing features, run user research, and maintain our design system in Figma.",
  },
  {
    title: "Senior Frontend Engineer",
    company: "Beacon Labs",
    location: "London, UK",
    description:
      "Build and maintain our React/TypeScript frontend. Experience with Next.js, component architecture, and performance optimization required. You'll collaborate with designers and backend engineers to ship features end to end.",
  },
  {
    title: "Backend Engineer (Node.js)",
    company: "Fieldstone",
    location: "Remote",
    description:
      "Design and build scalable APIs using Node.js and PostgreSQL. Experience with Prisma or similar ORMs, database design, and cloud infrastructure (AWS or GCP) preferred. You'll own services from design through deployment.",
  },
  {
    title: "UX Researcher",
    company: "Harbor & Co",
    location: "Manchester, UK",
    description:
      "Plan and conduct qualitative and quantitative research to inform product decisions. Strong communication skills and experience translating research into actionable design recommendations required.",
  },
  {
    title: "Data Analyst",
    company: "Northline",
    location: "Remote",
    description:
      "Analyze product and business data to inform strategy. SQL proficiency required, Python a plus. You'll build dashboards, run ad hoc analysis, and partner with product teams on key metrics.",
  },
  {
    title: "Full Stack Developer",
    company: "Ridgeline Software",
    location: "Birmingham, UK",
    description:
      "Work across our stack (React, Node.js, PostgreSQL) to build features for our SaaS platform. Comfortable owning a feature from database schema to UI. Startup experience a plus.",
  },
  {
    title: "Marketing Manager",
    company: "Fieldstone",
    location: "Remote",
    description:
      "Own our marketing strategy across content, email, and paid channels. Experience with B2B SaaS marketing and campaign analytics required.",
  },
  {
    title: "DevOps Engineer",
    company: "Beacon Labs",
    location: "Remote",
    description:
      "Manage our cloud infrastructure and CI/CD pipelines. Experience with Docker, Kubernetes, and AWS required. You'll improve deployment reliability and observability across our services.",
  },
];

export async function POST() {
  const created = await prisma.job.createMany({
    data: sampleJobs,
  });

  return NextResponse.json({ message: "Jobs seeded", count: created.count });
}
