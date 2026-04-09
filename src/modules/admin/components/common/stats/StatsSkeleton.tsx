export default function StatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            {/* Texto */}
            <div className="space-y-2">
              <div className="h-3 w-24 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-7 w-16 rounded-md bg-slate-300 animate-pulse" />
            </div>

            {/* Icono fake */}
            <div className="h-12 w-12 rounded-2xl bg-slate-200 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}
