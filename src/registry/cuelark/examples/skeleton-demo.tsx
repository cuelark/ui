import { Skeleton, SkeletonText } from "@/registry/cuelark/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="flex w-full max-w-sm gap-4 rounded-xl border border-border bg-card p-4">
      <Skeleton className="size-12 shrink-0 rounded-full" />
      <div className="grid flex-1 gap-3">
        <Skeleton className="h-4 w-2/5" />
        <SkeletonText lines={3} />
      </div>
    </div>
  );
}
