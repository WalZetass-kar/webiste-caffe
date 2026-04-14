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
      <header className="relative rounded-xl border border-cafe-line bg-[#fcfaf7]/92 shadow-glass backdrop-blur-xl">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cafe-secondary/55 blur-3xl pointer-events-none" />
        
        {/* Collapsed Header - Mobile */}
        <div className="lg:hidden p-3 flex items-center justify-between gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="relative flex items-center gap-3 flex-1"
          >
            <svg className="w-6 h-6 text-cafe-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <div className="text-left flex-1 min-w-0">
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/70">Cafe Operations</p>
              <h2 className="text-base font-semibold text-cafe-text truncate">
                Sistem Manajemen {settings.cafeName}
              </h2>
            </div>
            <svg 
              className={`w-5 h-5 text-cafe-accent transition-transform flex-shrink-0 ${expanded ? 'rotate-180' : ''}`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Expanded Content - Mobile */}
        <div className={`lg:hidden ${expanded ? 'block' : 'hidden'} border-t border-cafe-line`}>
          <div className="p-3 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="rounded-lg border border-cafe-line bg-cafe-surface/75 px-2 py-2 shadow-sm">
                <p className="text-[9px] uppercase tracking-[0.24em] text-cafe-accent/60">Role aktif</p>
                <p className="mt-0.5 text-xs font-semibold text-cafe-text">{roleLabels[role]}</p>
              </div>
              <div className="relative">
                <label className="mb-1 block text-[9px] uppercase tracking-[0.24em] text-cafe-accent/60">Ganti role</label>
                <select className={`${selectFieldClassName} text-xs`} value={role} onChange={(event) => updateRole(event.target.value as UserRole)}>
                  {userRoleOptions.map((item) => (
                    <option key={item} value={item}>
                      {roleLabels[item]}
                    </option>
                  ))}
                </select>
              </div>
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
              {open ? (
                <>
                  <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[250px] overflow-y-auto rounded-xl border border-cafe-line bg-cafe-surface p-3 shadow-glass">
                    {loading ? (
                      <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-xs text-cafe-accent/75">
                        Mencari data di menu, order, dan staff...
                      </div>
                    ) : query.trim().length < 2 ? (
                      <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-xs text-cafe-accent/75">
                        Ketik minimal 2 huruf untuk mulai mencari.
                      </div>
                    ) : results.length === 0 ? (
                      <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-xs text-cafe-accent/75">
                        Tidak ada hasil untuk kata kunci ini.
                      </div>
                    ) : (
                    <div className="space-y-3">
                      {(["menu", "order", "staff"] as const).map((group) =>
                        groupedResults[group].length > 0 ? (
                          <div key={group} className="space-y-2">
                            <p className="px-2 text-[11px] uppercase tracking-[0.22em] text-cafe-accent/60">
                              {group === "menu" ? "Menu" : group === "order" ? "Order" : "Staff"}
                            </p>
                            <div className="space-y-2">
                              {groupedResults[group].map((item) => (
                                <button
                                  key={item.id}
                                  type="button"
                                  onClick={() => selectSearchResult(item.href)}
                                  className="flex w-full items-start justify-between gap-4 rounded-xl border border-cafe-line/70 bg-cafe-surface px-4 py-3 text-left transition hover:bg-cafe-secondary/35"
                                >
                                  <div>
                                    <p className="text-sm font-semibold text-cafe-text">{item.title}</p>
                                    <p className="mt-1 text-sm text-cafe-accent/78">{item.subtitle}</p>
                                  </div>
                                  <span className="rounded-full bg-cafe-secondary/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cafe-accent">
                                    {item.meta}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ) : null,
                      )}
                    </div>
                  )}
                </div>
                </>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <Link href="/" className={`${buttonStyles("secondary", "w-full")} text-xs py-2`}>
                Lihat Website
              </Link>
              <Button variant="glass" className="w-full text-xs py-2" onClick={() => setSyncModalOpen(true)}>
                Sync Dummy Data
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop View - Always Visible */}
        <div className="hidden lg:block relative p-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/70">Cafe Operations</p>
                <h2 className="mt-1 text-2xl font-semibold text-cafe-text lg:text-3xl">
                  Sistem Manajemen {settings.cafeName}
                </h2>
                <p className="mt-2 max-w-2xl text-sm text-cafe-accent/75">
                  Satu tempat untuk memantau operasional, menu, supply, pelanggan, dan pengalaman tim di seluruh cabang.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 xl:w-[320px]">
                <div className="rounded-xl border border-cafe-line bg-cafe-surface/75 px-3 py-2 shadow-sm">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-cafe-accent/60">Role aktif</p>
                  <p className="mt-1 text-sm font-semibold text-cafe-text">{roleLabels[role]}</p>
                </div>
                <div className="relative">
                  <label className="mb-1 block text-[10px] uppercase tracking-[0.24em] text-cafe-accent/60">Ganti role</label>
                  <select className={selectFieldClassName} value={role} onChange={(event) => updateRole(event.target.value as UserRole)}>
                    {userRoleOptions.map((item) => (
                      <option key={item} value={item}>
                        {roleLabels[item]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-start">
              <div ref={searchRef} className="relative flex-1">
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
                {open ? (
                  <>
                    <div className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} />
                    <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-[70] max-h-[250px] overflow-y-auto rounded-xl border border-cafe-line bg-cafe-surface p-3 shadow-glass">
                      {loading ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-sm text-cafe-accent/75">
                          Mencari data di menu, order, dan staff...
                        </div>
                      ) : query.trim().length < 2 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-sm text-cafe-accent/75">
                          Ketik minimal 2 huruf untuk mulai mencari.
                        </div>
                      ) : results.length === 0 ? (
                        <div className="rounded-xl bg-cafe-secondary/20 px-3 py-4 text-sm text-cafe-accent/75">
                          Tidak ada hasil untuk kata kunci ini.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(["menu", "order", "staff"] as const).map((group) =>
                            groupedResults[group].length > 0 ? (
                              <div key={group} className="space-y-2">
                                <p className="px-2 text-[11px] uppercase tracking-[0.22em] text-cafe-accent/60">
                                  {group === "menu" ? "Menu" : group === "order" ? "Order" : "Staff"}
                                </p>
                                <div className="space-y-2">
                                  {groupedResults[group].map((item) => (
                                    <button
                                      key={item.id}
                                      type="button"
                                      onClick={() => selectSearchResult(item.href)}
                                      className="flex w-full items-start justify-between gap-4 rounded-xl border border-cafe-line/70 bg-cafe-surface px-4 py-3 text-left transition hover:bg-cafe-secondary/35"
                                    >
                                      <div>
                                        <p className="text-sm font-semibold text-cafe-text">{item.title}</p>
                                        <p className="mt-1 text-sm text-cafe-accent/78">{item.subtitle}</p>
                                      </div>
                                      <span className="rounded-full bg-cafe-secondary/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cafe-accent">
                                        {item.meta}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : null,
                          )}
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
              <div className="flex flex-col gap-3 lg:flex-row">
                <Link href="/" className={buttonStyles("secondary")}>
                  Lihat Website
                </Link>
                <Button variant="glass" onClick={() => setSyncModalOpen(true)}>
                  Sync Dummy Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

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
