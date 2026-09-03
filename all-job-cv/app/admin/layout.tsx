import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/app/lib/adminAuth";
import AdminSidebar from "./AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();
  if (!authenticated) redirect("/admin-login");

  return (
    <div className="flex min-h-screen bg-[#F0EEE8]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
