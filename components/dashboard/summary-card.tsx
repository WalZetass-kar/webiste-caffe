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
    <Card className={cn("starbucks-card relative overflow-hidden", tone)}>
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#00704A]/5 blur-2xl" />
      <div className="relative space-y-3">
        <p className="text-sm font-medium text-[#6B5D52]">{title}</p>
        <h3 className="text-3xl font-bold text-[#1E3932] sm:text-4xl">{value}</h3>
        <p className="text-sm text-[#6B5D52] text-clamp-2">{change}</p>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-[#9B8B7E]">
          {detail ?? "Cafe analytics"}
        </p>
      </div>
    </Card>
  );
}
