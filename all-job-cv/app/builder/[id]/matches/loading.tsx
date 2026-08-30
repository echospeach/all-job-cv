export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F0EEE8]">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#3F6C51]">
          Job matches
        </p>
        <h1 className="mb-1 text-2xl font-semibold text-[#202A3C]">
          Finding your matches...
        </h1>
        <p className="text-sm text-[#8B8578]">
          Comparing your CV against open roles. This takes a few seconds.
        </p>

        <div className="mt-8 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-[#D8D3C8] bg-white p-5"
            >
              <div className="flex items-start justify-between">
                <div className="w-2/3">
                  <div className="h-4 w-3/4 rounded bg-[#E8E5DD]" />
                  <div className="mt-2 h-3 w-1/2 rounded bg-[#E8E5DD]" />
                </div>
                <div className="h-6 w-20 rounded-full bg-[#E8E5DD]" />
              </div>
              <div className="mt-4 h-3 w-full rounded bg-[#E8E5DD]" />
              <div className="mt-2 h-3 w-4/5 rounded bg-[#E8E5DD]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
