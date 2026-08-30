export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
              Your CVs
            </p>
            <h1 className="text-2xl font-semibold text-[#202A3C]">My CVs</h1>
          </div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-[#D8D3C8] bg-white px-5 py-4"
            >
              <div className="h-4 w-1/3 rounded bg-[#E8E5DD]" />
              <div className="mt-2 h-3 w-1/4 rounded bg-[#E8E5DD]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
