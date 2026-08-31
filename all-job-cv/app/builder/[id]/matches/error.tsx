"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0EEE8] px-6">
      <div className="max-w-sm text-center">
        <p className="text-[15px] font-semibold text-[#202A3C]">
          Couldn&apos;t find matches right now.
        </p>
        <p className="mt-2 text-sm text-[#8B8578]">
          This can happen if the matching service is temporarily unavailable.
        </p>
        <button
          onClick={reset}
          className="mt-4 rounded-lg bg-[#202A3C] px-4 py-2 text-sm font-medium text-white hover:bg-[#2C3B52]"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
