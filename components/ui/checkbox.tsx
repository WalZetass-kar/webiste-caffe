"use client";

import { cn } from "@/lib/utils";

type CheckboxProps = {
  checked?: boolean;
  label: string;
  onChange?: (checked: boolean) => void;
};

export function Checkbox({ checked = false, label, onChange }: CheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-cafe-line bg-cafe-surface px-4 py-3 text-sm text-cafe-text shadow-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className={cn(
          "h-5 w-5 rounded border-[#d8c3ab] bg-cafe-surface text-cafe-accent",
          "focus:ring-cafe-primary/30",
        )}
      />
      <span>{label}</span>
    </label>
  );
}
