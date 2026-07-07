import type { ReactNode } from "react";

interface PageToolbarProps {
  search: ReactNode;
  action?: ReactNode;
}

export function PageToolbar({
  search,
  action,
}: PageToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div className="w-full md:max-w-sm">
        {search}
      </div>

      {action && (
        <div className="flex justify-end">
          {action}
        </div>
      )}
    </div>
  );
}