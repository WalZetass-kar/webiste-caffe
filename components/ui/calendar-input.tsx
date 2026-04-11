"use client";

import Flatpickr from "react-flatpickr";
import { Indonesian } from "flatpickr/dist/l10n/id.js";
import { cn } from "@/lib/utils";

type CalendarInputProps = {
  value?: Date[];
  onChange?: (dates: Date[]) => void;
  placeholder?: string;
};

export function CalendarInput({ value, onChange, placeholder }: CalendarInputProps) {
  return (
    <Flatpickr
      value={value}
      options={{
        locale: Indonesian,
        dateFormat: "d M Y",
      }}
      className={cn(
        "w-full rounded-lg border border-cafe-line bg-cafe-surface px-4 py-3 text-sm text-cafe-text outline-none shadow-sm focus:border-cafe-primary/80 focus:ring-2 focus:ring-cafe-primary/25",
      )}
      onChange={(selectedDates) => onChange?.(selectedDates)}
      placeholder={placeholder ?? "Pilih tanggal"}
    />
  );
}
