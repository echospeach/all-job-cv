"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AdminLogoutButton from "./AdminLogoutButton";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: HomeIcon },
  { href: "/admin/jobs", label: "Manage jobs", icon: BriefcaseIcon },
  { href: "/admin/add-job", label: "Add sponsor job", icon: PlusIcon },
  { href: "/admin/users", label: "Manage users", icon: UsersIcon },
  { href: "/admin/insights", label: "Insights", icon: ChartIcon },
  { href: "/admin/feedback", label: "Feedback", icon: MessageIcon },
  { href: "/admin/human-cv-requests", label: "Human CV requests", icon: DocIcon },
  { href: "/admin/broadcast", label: "Broadcast", icon: MegaphoneIcon },
  { href: "/admin/broadcast-history", label: "Broadcast history", icon: ClockIcon },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col bg-[#202A3C] text-white">
      <div className="px-5 py-6">
        <p className="text-sm font-semibold tracking-tight">ALL JOB CV</p>
        <p className="text-xs text-white/50">Admin</p>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                active
                  ? "flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white"
                  : "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white"
              }
            >
              <Icon />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3">
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 7L8 2L14 7V13.5C14 13.78 13.78 14 13.5 14H10V10H6V14H2.5C2.22 14 2 13.78 2 13.5V7Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function BriefcaseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect x="2" y="5" width="12" height="8" rx="1" stroke="currentColor" strokeWidth="1.3" />
      <path d="M5.5 5V3.5C5.5 3.22 5.72 3 6 3H10C10.28 3 10.5 3.22 10.5 3.5V5" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="6" cy="5.5" r="2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 13C2 10.79 3.79 9 6 9C8.21 9 10 10.79 10 13" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.5" cy="5" r="1.6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10.5 9.2C12.3 9.5 13.6 11 13.6 12.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 13.5V2.5M2 13.5H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <rect x="4" y="9" width="2" height="4" fill="currentColor" />
      <rect x="7.5" y="6" width="2" height="7" fill="currentColor" />
      <rect x="11" y="4" width="2" height="9" fill="currentColor" />
    </svg>
  );
}
function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 3.5C2 3.22 2.22 3 2.5 3H13.5C13.78 3 14 3.22 14 3.5V10.5C14 10.78 13.78 11 13.5 11H6L3 13.5V11H2.5C2.22 11 2 10.78 2 10.5V3.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 2H9L12 5V13.5C12 13.78 11.78 14 11.5 14H4.5C4.22 14 4 13.78 4 13.5V2.5C4 2.22 4.22 2 4.5 2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M6 7H10M6 9.5H10" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}
function MegaphoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M2 6.5V9.5L9 12V4L2 6.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M9 4L13.5 2.5V13.5L9 12" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      <path d="M4 9.5L5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 5V8L10 9.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
