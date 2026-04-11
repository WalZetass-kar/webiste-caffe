import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type SummaryCardProps = {
  title: string;
  value: string;
  change: string;
  detail?: string;
  tone: string;
};

export function SummaryCard({ title, value, change, detail, tone }: SummaryCardProps) {
  return (
    <Card className={cn("relative overflow-hidden border-cafe-line/80 bg-gradient-to-br hover-lift animate-scale-in", tone)}>
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-white/45 blur-2xl" />
      <div className="relative">
        <p className="text-sm text-cafe-accent/72">{title}</p>
        <h3 className="mt-4 text-3xl font-semibold text-cafe-text sm:text-4xl">{value}</h3>
        <p className="mt-2 text-sm text-cafe-text/88">{change}</p>
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-cafe-accent/65">
          {detail ?? "Cafe analytics"}
        </p>
      </div>
    </Card>
  );
}
