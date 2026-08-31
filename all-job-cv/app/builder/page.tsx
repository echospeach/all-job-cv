import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "./BuilderForm";

export default async function BuilderPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>;
}) {
  const sessionUser = await requireUser();

  const { template } = await searchParams;

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <BuilderForm
      userId={sessionUser.id}
      initialTemplate={template}
      isSubscribed={isSubscribed}
    />
  );
}
