import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

type SummaryCardProps = {
  title: string;
  value: string;
  change: string;
  tone: string;
};

export function SummaryCard({ title, value, change, tone }: SummaryCardProps) {
  return (
    <Card className={cn("starbucks-card relative overflow-hidden", tone)}>
      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-[#5a4a3a]/5 blur-2xl" />
      <div className="relative space-y-2">
        <p className="text-sm font-medium text-[#6B5D52]">{title}</p>
        <h3 className="text-3xl font-bold text-[#3d3027]">{value}</h3>
        <p className="text-sm text-[#6B5D52]">{change}</p>
      </div>
    </Card>
  );
}
