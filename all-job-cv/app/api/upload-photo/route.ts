import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { supabaseAdmin } from "@/app/lib/supabaseAdmin";
import { checkRateLimit } from "@/app/lib/rateLimit";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { allowed } = await checkRateLimit(`upload-photo:${session.user.id}`, 10, 60 * 60);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many uploads. Please try again later." },
      { status: 429 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: "File must be a JPEG, PNG, WEBP, or GIF image" }, { status: 400 });
  }

  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Image must be under 5MB" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = new Uint8Array(bytes);
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${session.user.id}/${Date.now()}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from("cv-photos")
    .upload(path, buffer, { contentType: file.type, upsert: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from("cv-photos").getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
