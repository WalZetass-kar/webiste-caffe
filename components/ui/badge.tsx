import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: "blue" | "green" | "cream" | "rose" | "slate";
};

export function Badge({ className, tone = "blue", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-lg border px-3 py-1 text-xs font-semibold shadow-sm",
        tone === "blue" && "border-[#d7c6b3] bg-[#f3e6d8] text-[#7b6141]",
        tone === "green" && "border-[#ddd1c2] bg-[#f6efe7] text-[#6b5947]",
        tone === "cream" && "border-[#dbc3a7] bg-[#f5e7d7] text-cafe-accent",
        tone === "rose" && "border-[#e2cfc0] bg-[#f4ebe4] text-[#8a6d58]",
        tone === "slate" && "border-[#e1d7cc] bg-[#f8f3ed] text-[#756656]",
        className,
      )}
      {...props}
    />
  );
}
