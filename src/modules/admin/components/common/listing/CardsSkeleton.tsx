export default function CardsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          {/* Header */}
          <div className="mb-4 flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-slate-200 animate-pulse" />

            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-slate-300 animate-pulse" />
              <div className="h-3 w-40 rounded bg-slate-200 animate-pulse" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
            <div className="h-10 rounded-xl bg-slate-100 animate-pulse" />
          </div>

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between">
            <div className="h-6 w-24 rounded-full bg-slate-200 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
