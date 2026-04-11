"use client";

import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

type RadioGroupProps = {
  name: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
};

export function RadioGroup({ name, options, value, onChange }: RadioGroupProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <label
            key={option.value}
            className={cn(
              "cursor-pointer rounded-lg border px-4 py-2 text-sm transition",
              active
                ? "border-cafe-primary/60 bg-cafe-secondary text-cafe-text shadow-md"
                : "border-cafe-line bg-cafe-surface text-cafe-accent hover:bg-cafe-secondary/35",
            )}
          >
            <input
              className="sr-only"
              type="radio"
              name={name}
              value={option.value}
              checked={active}
              onChange={() => onChange(option.value)}
            />
            {option.label}
          </label>
        );
      })}
    </div>
  );
}
