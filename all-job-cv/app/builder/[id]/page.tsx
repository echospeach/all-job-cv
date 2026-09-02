import { notFound } from "next/navigation";
import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";
import BuilderForm from "../BuilderForm";
import PaymentSuccessModal from "@/app/components/PaymentSuccessModal";

export default async function EditCvPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ premium?: string; unlocked?: string }>;
}) {
  const sessionUser = await requireUser();
  const { id } = await params;
  const { premium, unlocked } = await searchParams;
  const cv = await prisma.cv.findUnique({ where: { id } });
  if (!cv || cv.userId !== sessionUser.id) notFound();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  const isSubscribed = user?.subscriptionStatus === "active";

  return (
    <>
      {unlocked === "1" && (
        <PaymentSuccessModal
          title="CV unlocked!"
          message="Your payment was successful. This CV's premium template is now unlocked - save and download it whenever you're ready."
          ctaHref={`/builder/${cv.id}`}
          ctaLabel="View your CV"
        />
      )}
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
    </>
  );
}
