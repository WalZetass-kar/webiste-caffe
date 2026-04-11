import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-lg border border-cafe-line bg-cafe-surface px-4 py-3 text-sm text-cafe-text outline-none shadow-sm",
        "placeholder:text-cafe-accent/55 focus:border-cafe-primary/80 focus:ring-2 focus:ring-cafe-primary/25",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
