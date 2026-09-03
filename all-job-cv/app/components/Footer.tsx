import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[#D8D3C8] bg-[#FAF9F6] py-6">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 text-xs text-[#8B8578] sm:flex-row sm:justify-between">
        <p>&copy; {new Date().getFullYear()} ALL JOB CV</p>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/feedback" className="hover:underline">Feedback</Link>
          <Link href="/human-cv-request" className="hover:underline">Get help from a human</Link>
        </div>
      </div>
    </footer>
  );
}
