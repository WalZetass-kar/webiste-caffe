"use client";

import { startTransition, createContext, useContext, useEffect, useMemo, useState } from "react";

export type GlobalSearchResult = {
  id: string;
  type: "menu" | "order" | "staff";
  title: string;
  subtitle: string;
  meta: string;
  href: string;
};

type GlobalSearchContextValue = {
  query: string;
  setQuery: (value: string) => void;
  results: GlobalSearchResult[];
  loading: boolean;
  open: boolean;
  setOpen: (value: boolean) => void;
  clear: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);

      try {
        const response = await fetch(`/api/global-search?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Gagal memuat hasil pencarian.");
        }

        const nextResults = (await response.json()) as GlobalSearchResult[];
        startTransition(() => {
          setResults(nextResults);
        });
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error);
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 220);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  const value = useMemo(
    () => ({
      query,
      setQuery,
      results,
      loading,
      open,
      setOpen,
      clear() {
        setQuery("");
        setResults([]);
        setOpen(false);
      },
    }),
    [loading, open, query, results],
  );

  return <GlobalSearchContext.Provider value={value}>{children}</GlobalSearchContext.Provider>;
}

export function useGlobalSearch() {
  const context = useContext(GlobalSearchContext);

  if (!context) {
    throw new Error("useGlobalSearch harus digunakan di dalam GlobalSearchProvider.");
  }

  return context;
}
