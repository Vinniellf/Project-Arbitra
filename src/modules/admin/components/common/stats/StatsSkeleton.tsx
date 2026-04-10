export default function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm min-h-22"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-slate-200 animate-pulse" />
              <div className="h-6 w-14 rounded bg-slate-300 animate-pulse" />
            </div>

            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
