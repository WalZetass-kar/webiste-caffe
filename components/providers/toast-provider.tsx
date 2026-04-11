"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type ToastTone = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: string;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastContextValue = {
  pushToast: (input: Omit<ToastItem, "id">) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const toneClassName: Record<ToastTone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  error: "border-rose-200 bg-rose-50 text-rose-900",
  info: "border-cafe-line bg-cafe-surface text-cafe-text",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const value = useMemo(
    () => ({
      pushToast(input: Omit<ToastItem, "id">) {
        const id = crypto.randomUUID();
        const item = { id, ...input };

        setItems((current) => [item, ...current].slice(0, 5));
        window.setTimeout(() => {
          setItems((current) => current.filter((entry) => entry.id !== id));
        }, 4500);
      },
    }),
    [],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 top-4 z-[80] flex flex-col gap-3 sm:left-auto sm:right-4 sm:w-full sm:max-w-sm">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "pointer-events-auto rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm",
              toneClassName[item.tone],
            )}
          >
            <p className="text-sm font-semibold">{item.title}</p>
            {item.description ? <p className="mt-1 text-sm opacity-90">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast harus digunakan di dalam ToastProvider.");
  }

  return context;
}
