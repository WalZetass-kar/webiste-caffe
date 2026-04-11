"use client";

import { createContext, useContext, useMemo, useState } from "react";
import type { CafeSettingsRecord } from "@/lib/models";

type SettingsContextValue = {
  settings: CafeSettingsRecord;
  setSettings: (next: CafeSettingsRecord) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({
  initialSettings,
  children,
}: {
  initialSettings: CafeSettingsRecord;
  children: React.ReactNode;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const value = useMemo(
    () => ({
      settings,
      setSettings,
    }),
    [settings],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useCafeSettings() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("useCafeSettings harus digunakan di dalam SettingsProvider.");
  }

  return context;
}
