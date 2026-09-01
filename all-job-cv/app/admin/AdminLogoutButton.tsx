"use client";

import { useRouter } from "next/navigation";

export default function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-logout", { method: "POST" });
    router.push("/admin-login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="rounded-lg border border-[#D8D3C8] px-4 py-2 text-sm font-medium text-[#202A3C] hover:bg-white"
    >
      Sign out
    </button>
  );
}
