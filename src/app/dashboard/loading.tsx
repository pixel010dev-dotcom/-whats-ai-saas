export default function DashboardLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header Skeleton */}
      <div className="animate-pulse">
        <div className="h-8 w-48 bg-zinc-800 rounded-lg" />
        <div className="h-4 w-72 bg-zinc-800/50 rounded-lg mt-2" />
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
            <div className="h-4 w-24 bg-zinc-800 rounded-lg" />
            <div className="h-8 w-16 bg-zinc-800 rounded-lg mt-3" />
            <div className="h-3 w-32 bg-zinc-800/50 rounded-lg mt-2" />
          </div>
        ))}
      </div>

      {/* Chart Skeleton */}
      <div className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <div className="h-5 w-32 bg-zinc-800 rounded-lg mb-4" />
        <div className="h-48 bg-zinc-800/30 rounded-xl" />
      </div>

      {/* List Skeleton */}
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="animate-pulse bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-zinc-800 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-zinc-800 rounded-lg" />
              <div className="h-3 w-48 bg-zinc-800/50 rounded-lg mt-2" />
            </div>
            <div className="h-6 w-20 bg-zinc-800 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  )
}
