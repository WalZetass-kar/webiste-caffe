"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button, buttonStyles } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { useGlobalSearch } from "@/components/providers/global-search-provider";
import { useToast } from "@/components/providers/toast-provider";
import { useUserRole } from "@/components/providers/role-provider";
import { getDefaultRouteForRole, roleLabels, userRoleOptions, type UserRole } from "@/lib/auth/roles";
import { requestJson } from "@/lib/client-api";
import { selectFieldClassName } from "@/lib/design-system";

type SyncSummary = {
  menus: number;
  employees: number;
  orders: number;
  batchLabel: string;
};

export function Topbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchRef = useRef<HTMLDivElement | null>(null);
  const { settings } = useCafeSettings();
  const { role, setRole } = useUserRole();
  const { pushToast } = useToast();
  const { query, setQuery, results, loading, open, setOpen, clear } = useGlobalSearch();
  const [syncModalOpen, setSyncModalOpen] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  // Only show full topbar on dashboard
  const isDashboard = pathname === "/dashboard";

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleScroll = () => {
      setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [setOpen]);

  const groupedResults = useMemo(
    () => ({
      menu: results.filter((item) => item.type === "menu"),
      order: results.filter((item) => item.type === "order"),
      staff: results.filter((item) => item.type === "staff"),
    }),
    [results],
  );

  const updateRole = (nextRole: UserRole) => {
    setRole(nextRole);
    pushToast({
      title: `Mode ${roleLabels[nextRole]} aktif`,
      description: "Navigasi dan akses halaman langsung menyesuaikan permission role ini.",
      tone: "info",
    });

    const target = getDefaultRouteForRole(nextRole);

    if (pathname !== target) {
      router.push(target);
    } else {
      router.refresh();
    }
  };

  const runDummySync = async () => {
    setSyncing(true);

    try {
      const summary = await requestJson<SyncSummary>("/api/sync-dummy-data", {
        method: "POST",
      });

      pushToast({
        title: "Dummy data berhasil ditambahkan",
        description: `${summary.menus} menu, ${summary.employees} staff, dan ${summary.orders} order batch ${summary.batchLabel}.`,
        tone: "success",
      });
      setSyncModalOpen(false);
      router.refresh();
    } catch (error) {
      pushToast({
        title: "Sync dummy data gagal",
        description: error instanceof Error ? error.message : "Server belum berhasil memproses seeder.",
        tone: "error",
      });
    } finally {
      setSyncing(false);
    }
  };

  const selectSearchResult = (href: string) => {
    clear();
    router.push(href);
  };

  return (
    <>
      {isDashboard ? (
        <header className="relative rounded-xl border border-cafe-line bg-[#fcfaf7]/92 shadow-glass backdrop-blur-xl overflow-hidden">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cafe-secondary/55 blur-3xl pointer-events-none" />
          
          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="p-4 flex items-center justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-cafe-accent/70">Dashboard</p>
                <h2 className="text-sm font-semibold text-cafe-text truncate mt-0.5">
                  {settings.cafeName}
                </h2>
              </div>
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex-shrink-0 p-2 rounded-lg hover:bg-cafe-secondary/30 transition-colors"
                aria-label="Toggle menu"
              >
                <svg 
                  className={`w-5 h-5 text-cafe-accent transition-transform ${expanded ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

          {expanded && (
            <div className="border-t border-cafe-line bg-cafe-surface/50 p-4 space-y-4">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-wider text-cafe-accent/60">Role</label>
                <select 
                  className={`${selectFieldClassName} text-sm w-full`} 
                  value={role} 
                  onChange={(event) => updateRole(event.target.value as UserRole)}
                >
                  {userRoleOptions.map((item) => (
                    <option key={item} value={item}>
                      {roleLabels[item]}
                    </option>
                  ))}
                </select>
              </div>

              <div ref={searchRef} className="relative">
                <Input
                  placeholder="Cari menu, order, staff..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  className="w-full text-sm"
                  autoComplete="off"
                />
                {open && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[250px] overflow-y-auto rounded-xl border border-cafe-line bg-cafe-surface p-3 shadow-glass">
                      {loading ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-3 text-xs text-cafe-accent/75">
                          Mencari...
                        </div>
                      ) : query.trim().length < 2 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-3 text-xs text-cafe-accent/75">
                          Ketik minimal 2 huruf
                        </div>
                      ) : results.length === 0 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-3 text-xs text-cafe-accent/75">
                          Tidak ada hasil
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {(["menu", "order", "staff"] as const).map((group) =>
                            groupedResults[group].length > 0 ? (
                              <div key={group} className="space-y-1.5">
                                <p className="px-2 text-[10px] uppercase tracking-wider text-cafe-accent/60">
                                  {group === "menu" ? "Menu" : group === "order" ? "Order" : "Staff"}
                                </p>
                                {groupedResults[group].map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => selectSearchResult(item.href)}
                                    className="flex w-full items-start justify-between gap-3 rounded-lg border border-cafe-line/70 bg-cafe-surface px-3 py-2 text-left transition hover:bg-cafe-secondary/35"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-semibold text-cafe-text truncate">{item.title}</p>
                                      <p className="mt-0.5 text-xs text-cafe-accent/78 truncate">{item.subtitle}</p>
                                    </div>
                                    <span className="rounded-full bg-cafe-secondary/55 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cafe-accent flex-shrink-0">
                                      {item.meta}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Link href="/" className={`${buttonStyles("secondary")} text-xs py-2 justify-center`}>
                  Website
                </Link>
                <Button variant="glass" className="text-xs py-2" onClick={() => setSyncModalOpen(true)}>
                  Sync
                </Button>
                <Link href="/logout" className={`${buttonStyles("ghost")} text-xs py-2 justify-center`}>
                  Logout
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block relative p-6">
          <div className="space-y-5">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <p className="text-xs uppercase tracking-wider text-cafe-accent/70">Cafe Operations</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">
                  Sistem Manajemen {settings.cafeName}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-cafe-accent/75 leading-relaxed">
                  Dashboard untuk operasional, menu, supply, dan tim
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="rounded-xl border border-cafe-line bg-cafe-surface/75 px-4 py-2.5 shadow-sm">
                  <p className="text-[10px] uppercase tracking-wider text-cafe-accent/60">Role</p>
                  <p className="mt-1 text-sm font-semibold text-cafe-text">{roleLabels[role]}</p>
                </div>
                <select 
                  className={`${selectFieldClassName} min-w-[140px]`} 
                  value={role} 
                  onChange={(event) => updateRole(event.target.value as UserRole)}
                >
                  {userRoleOptions.map((item) => (
                    <option key={item} value={item}>
                      {roleLabels[item]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div ref={searchRef} className="relative flex-1 max-w-md">
                <Input
                  placeholder="Cari menu, order, staff..."
                  value={query}
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setOpen(true);
                  }}
                  onFocus={() => setOpen(true)}
                  className="w-full"
                  autoComplete="off"
                />
                {open && (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[300px] overflow-y-auto rounded-xl border border-cafe-line bg-cafe-surface p-3 shadow-glass">
                      {loading ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-4 py-3 text-sm text-cafe-accent/75">
                          Mencari data...
                        </div>
                      ) : query.trim().length < 2 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-4 py-3 text-sm text-cafe-accent/75">
                          Ketik minimal 2 huruf
                        </div>
                      ) : results.length === 0 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-4 py-3 text-sm text-cafe-accent/75">
                          Tidak ada hasil
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(["menu", "order", "staff"] as const).map((group) =>
                            groupedResults[group].length > 0 ? (
                              <div key={group} className="space-y-2">
                                <p className="px-2 text-[11px] uppercase tracking-wider text-cafe-accent/60">
                                  {group === "menu" ? "Menu" : group === "order" ? "Order" : "Staff"}
                                </p>
                                {groupedResults[group].map((item) => (
                                  <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => selectSearchResult(item.href)}
                                    className="flex w-full items-start justify-between gap-4 rounded-xl border border-cafe-line/70 bg-cafe-surface px-4 py-3 text-left transition hover:bg-cafe-secondary/35"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-semibold text-cafe-text">{item.title}</p>
                                      <p className="mt-1 text-sm text-cafe-accent/78">{item.subtitle}</p>
                                    </div>
                                    <span className="rounded-full bg-cafe-secondary/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cafe-accent flex-shrink-0">
                                      {item.meta}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            ) : null
                          )}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
              <Link href="/" className={buttonStyles("secondary")}>
                Lihat Website
              </Link>
              <Button variant="glass" onClick={() => setSyncModalOpen(true)}>
                Sync Dummy Data
              </Button>
            </div>
          </div>
        </div>
      </header>
      ) : (
        <div className="relative z-10 flex items-center justify-end p-4 rounded-xl border border-cafe-line bg-[#fcfaf7]/92 shadow-sm">
          <div>
            <p className="text-xs font-medium text-cafe-accent/70">{roleLabels[role]}</p>
          </div>
        </div>
      )}

      <Modal
        open={syncModalOpen}
        title="Sinkron Dummy Data"
        onClose={() => {
          if (!syncing) {
            setSyncModalOpen(false);
          }
        }}
        className="sm:max-w-lg"
      >
        <div className="space-y-5">
          <div className="rounded-3xl border border-cafe-line bg-cafe-secondary/20 p-4 text-sm leading-7 text-cafe-accent/80">
            Seeder ini akan menambahkan menu, staff, dan order dummy baru untuk kebutuhan demo tanpa menghapus data asli
            yang sudah ada.
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button variant="ghost" className="sm:w-auto" onClick={() => setSyncModalOpen(false)} disabled={syncing}>
              Batal
            </Button>
            <Button className="sm:w-auto" onClick={() => void runDummySync()} disabled={syncing}>
              {syncing ? "Menyinkronkan..." : "Lanjut Sync"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
