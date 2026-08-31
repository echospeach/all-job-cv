import { redirect } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "./BuilderForm";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/signin");
  }

  const { template } = await searchParams;

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <BuilderForm
      userId={session.user.id!}
      initialTemplate={template}
      isSubscribed={isSubscribed}
    />
  );
}
