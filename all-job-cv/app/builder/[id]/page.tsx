import { redirect, notFound } from "next/navigation";
import { auth } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "../BuilderForm";

export default async function EditCvPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const { id } = await params;
  const cv = await prisma.cv.findUnique({ where: { id } });

  if (!cv || cv.userId !== session.user.id) notFound();

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <BuilderForm
      userId={session.user.id!}
      existingCv={{
        id: cv.id,
        title: cv.title,
        content: cv.content as any,
        template: cv.template,
        paidUnlocked: cv.paidUnlocked,
      }}
      isSubscribed={isSubscribed}
    />
  );
}
