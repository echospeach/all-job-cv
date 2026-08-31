import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import BuilderForm from "./BuilderForm";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  const { template } = await searchParams;

  return <BuilderForm userId={session.user.id!} initialTemplate={template} />;
}
