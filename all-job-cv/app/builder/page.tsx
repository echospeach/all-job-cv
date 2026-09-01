import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "./BuilderForm";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const session = await auth();
  const { template } = await searchParams;

  let isSubscribed = false;
  if (session?.user?.id) {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    isSubscribed = user?.subscriptionStatus === "active";
  }

  return (
    <BuilderForm
      userId={session?.user?.id ?? null}
      initialTemplate={template}
      isSubscribed={isSubscribed}
    />
  );
}
