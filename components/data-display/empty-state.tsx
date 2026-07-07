import { Inbox } from "lucide-react";

interface EmptyStateProps {
  title: string;

  description?: string;
}

export function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
      <Inbox
        size={48}
        className="mb-4 text-slate-400"
      />

      <h2 className="text-lg font-semibold">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-md text-sm text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}