import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import BuilderForm from "./BuilderForm";

export default async function BuilderPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin");
  }

  return <BuilderForm userId={session.user.id!} />;
}
