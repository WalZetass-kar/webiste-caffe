import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "glass";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function buttonStyles(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold transition-all duration-300",
    "focus:outline-none focus:ring-2 focus:ring-cafe-primary/35 focus:ring-offset-2 focus:ring-offset-transparent",
    "disabled:pointer-events-none disabled:opacity-60",
    variant === "primary" &&
      "border border-[#bb936d] bg-cafe-primary text-cafe-text shadow-md hover:bg-cafe-accent hover:text-[#fcfaf7] hover:shadow-lg",
    variant === "secondary" &&
      "border border-cafe-line bg-[#fcfaf7] text-cafe-text shadow-md hover:bg-cafe-secondary/55 hover:shadow-lg",
    variant === "ghost" &&
      "text-cafe-accent hover:bg-cafe-secondary/70 hover:text-cafe-text",
    variant === "glass" &&
      "glass-panel text-cafe-text hover:bg-[#fcfaf7]",
    className,
  );
}

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonStyles(variant, className)}
      {...props}
    />
  );
}
