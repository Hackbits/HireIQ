import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("skeleton", className)}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-3 w-1/3" />
      <div className="flex items-center justify-between pt-2">
        <Skeleton className="h-5 w-24 rounded-md" />
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  )
}

function SkeletonMetricCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-2">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-8 w-16" />
    </div>
  )
}

function SkeletonCandidateCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-[72px] h-[72px] rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-5 w-16 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SkeletonAuthCard() {
  return (
    <div className="bg-card border border-border rounded-xl w-full max-w-md p-8 space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-7 w-48 mx-auto" />
        <Skeleton className="h-4 w-56 mx-auto" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-1.5">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}

function SkeletonBillingCards() {
  return (
    <div className="grid md:grid-cols-2 gap-5">
      {[1, 2].map((i) => (
        <div key={i} className="bg-card border border-border rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-32" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((j) => (
              <div key={j} className="flex items-center gap-2">
                <Skeleton className="h-3.5 w-3.5 rounded-sm" />
                <Skeleton className="h-3.5 w-40" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      ))}
    </div>
  )
}

function SkeletonProfileCard() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-6">
      <Skeleton className="h-5 w-40" />
      <div className="flex items-center gap-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-4 w-40" />
          </div>
        ))}
      </div>
    </div>
  )
}

export {
  Skeleton,
  SkeletonCard,
  SkeletonMetricCard,
  SkeletonCandidateCard,
  SkeletonAuthCard,
  SkeletonBillingCards,
  SkeletonProfileCard,
}
