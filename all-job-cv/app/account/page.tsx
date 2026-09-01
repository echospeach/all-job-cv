import { requireUser } from "@/app/lib/getSessionUser";
import { prisma } from "@/app/lib/prisma";
import SubscribeButton from "./SubscribeButton";
import EmailPreferenceToggle from "./EmailPreferenceToggle";

export default async function AccountPage() {
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  const isActive = user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Account
        </p>
        <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Billing</h1>

        <div className="rounded-lg border border-[#D8D3C8] bg-white p-6">
          <p className="text-sm font-semibold text-[#202A3C]">
            {isActive ? "Premium - Active" : "Free plan"}
          </p>
          <p className="mt-1 text-sm text-[#5C5A52]">
            {isActive
              ? "You have access to every template, unlimited downloads, and unlimited job matching."
              : "You have access to Classic and Minimal templates with unlimited downloads."}
          </p>
          {!isActive && (
            <div className="mt-5">
              <p className="mb-3 text-sm font-medium text-[#202A3C]">
                Upgrade to Premium - £18/month
              </p>
              <ul className="mb-4 space-y-1 text-sm text-[#5C5A52]">
                <li>- All 6 CV templates, including photo layouts</li>
                <li>- Unlimited AI job matching refreshes</li>
                <li>- Priority support</li>
              </ul>
              <SubscribeButton />
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-[#D8D3C8] bg-white p-6">
          <p className="mb-3 text-sm font-semibold text-[#202A3C]">Email preferences</p>
          <EmailPreferenceToggle initialOptOut={user?.emailOptOut ?? false} />
        </div>
      </div>
    </div>
  );
}
