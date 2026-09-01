import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, company, location, description, url, country, sponsorsVisa } = body;

  if (!title || !company || !description) {
    return NextResponse.json(
      { error: "Title, company, and description are required" },
      { status: 400 }
    );
  }

  const job = await prisma.job.create({
    data: {
      title,
      company,
      location: location || null,
      description,
      url: url || null,
      country: country || "gb",
      sponsorsVisa: Boolean(sponsorsVisa),
    },
  });

  return NextResponse.json(job, { status: 201 });
}
