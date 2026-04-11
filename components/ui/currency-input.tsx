"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";

type CurrencyInputProps = {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
};

export function CurrencyInput({ value, onChange, placeholder }: CurrencyInputProps) {
  const displayValue = value
    ? new Intl.NumberFormat("id-ID").format(value)
    : "";

  return (
    <Input
      inputMode="numeric"
      value={displayValue}
      placeholder={placeholder ?? "Masukkan nominal"}
      onChange={(event) => {
        const numeric = Number(event.target.value.replace(/\D/g, ""));
        onChange(Number.isNaN(numeric) ? 0 : numeric);
      }}
    />
  );
}
