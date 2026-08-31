import { notFound } from "next/navigation";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "../BuilderForm";

export default async function EditCvPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ premium?: string }>;
}) {
  const sessionUser = await requireUser();

  const { id } = await params;
  const { premium } = await searchParams;
  const cv = await prisma.cv.findUnique({ where: { id } });

  if (!cv || cv.userId !== sessionUser.id) notFound();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <BuilderForm
      userId={sessionUser.id}
      existingCv={{
        id: cv.id,
        title: cv.title,
        content: cv.content as any,
        template: cv.template,
        paidUnlocked: cv.paidUnlocked,
      }}
      isSubscribed={isSubscribed}
      openPaywallOnLoad={premium === "1"}
    />
  );
}
