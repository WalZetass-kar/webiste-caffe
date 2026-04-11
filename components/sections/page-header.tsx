import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  actionLabel?: string;
};

export function PageHeader({ eyebrow, title, description, actionLabel }: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-cafe-line bg-coffee-glow p-5 shadow-glass sm:p-6 lg:p-8">
      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cafe-secondary/50 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-cafe-accent/70">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold text-cafe-text sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-cafe-accent/80 sm:text-base">{description}</p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <div className="rounded-lg border border-cafe-line bg-cafe-surface/80 px-4 py-2 text-xs uppercase tracking-[0.24em] text-cafe-accent/80 shadow-md">
            CafeFlow Ops
          </div>
          {actionLabel ? <Button className="w-full sm:w-auto">{actionLabel}</Button> : null}
        </div>
      </div>
    </div>
  );
}
