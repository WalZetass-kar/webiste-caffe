import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
        <input
          ref={ref}
          className={cn(
          "min-h-12 w-full rounded-lg border border-cafe-line bg-cafe-surface px-4 py-3 text-sm text-cafe-text outline-none shadow-sm",
          "placeholder:text-cafe-accent/55 focus:border-cafe-primary/80 focus:ring-2 focus:ring-cafe-primary/25",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
