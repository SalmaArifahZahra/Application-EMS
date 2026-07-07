import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
}

export function TableSkeleton({
  rows = 8,
}: TableSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({
        length: rows,
      }).map((_, index) => (
        <Skeleton
          key={index}
          className="h-12 w-full rounded-lg"
        />
      ))}
    </div>
  );
}