export default function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mt-3 rounded-lg border border-[#D97757]/30 bg-[#FBEDE7] px-4 py-3 text-sm text-[#993C1D]">
      {message}
    </div>
  );
}
