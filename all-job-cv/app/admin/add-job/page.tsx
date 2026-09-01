import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import AddJobForm from "./AddJobForm";

export default async function AddJobPage() {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Link href="/admin" className="text-sm text-[#8B8578] hover:underline">
          Back to dashboard
        </Link>
        <p className="mb-1 mt-3 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Internal
        </p>
        <h1 className="mb-8 text-2xl font-semibold text-[#202A3C]">Add a sponsor job</h1>
        <AddJobForm />
      </div>
    </div>
  );
}
