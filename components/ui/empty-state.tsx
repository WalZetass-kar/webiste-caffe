import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
};

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center rounded-xl border border-[#9F8B6C]/20 bg-white p-8 text-center", className)}>
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5EFE7]">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-[#3D3428]">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-[#6B5D4F]">{description}</p>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}
