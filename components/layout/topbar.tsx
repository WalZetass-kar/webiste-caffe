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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => document.removeEventListener("mousedown", handlePointerDown);
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
      <header className="relative overflow-visible rounded-xl border border-cafe-line bg-[#fcfaf7]/92 p-5 shadow-glass backdrop-blur-xl md:p-6">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-cafe-secondary/55 blur-3xl" />
        <div className="relative flex flex-col gap-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/70">Cafe Operations</p>
              <h2 className="mt-1 text-2xl font-semibold text-cafe-text sm:text-3xl">
                Sistem Manajemen {settings.cafeName}
              </h2>
              <p className="mt-2 max-w-2xl text-sm text-cafe-accent/75">
                Satu tempat untuk memantau operasional, menu, supply, pelanggan, dan pengalaman tim di seluruh cabang.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 xl:w-[320px]">
              <div className="rounded-xl border border-cafe-line bg-cafe-surface/75 px-4 py-3 shadow-sm">
                <p className="text-[11px] uppercase tracking-[0.24em] text-cafe-accent/60">Role aktif</p>
                <p className="mt-1 text-sm font-semibold text-cafe-text">{roleLabels[role]}</p>
              </div>
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-[0.24em] text-cafe-accent/60">Ganti role</label>
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
                className="w-full"
                autoComplete="off"
              />
              {open ? (
                <div className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-50 rounded-xl border border-cafe-line bg-cafe-surface p-3 shadow-glass">
                  {loading ? (
                    <div className="rounded-xl bg-cafe-secondary/20 px-4 py-5 text-sm text-cafe-accent/75">
                      Mencari data di menu, order, dan staff...
                    </div>
                  ) : query.trim().length < 2 ? (
                    <div className="rounded-xl bg-cafe-secondary/20 px-4 py-5 text-sm text-cafe-accent/75">
                      Ketik minimal 2 huruf untuk mulai mencari.
                    </div>
                  ) : results.length === 0 ? (
                    <div className="rounded-xl bg-cafe-secondary/20 px-4 py-5 text-sm text-cafe-accent/75">
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
              ) : null}
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link href="/" className={buttonStyles("secondary", "w-full sm:w-auto")}>
                Lihat Website
              </Link>
              <Button variant="glass" className="w-full sm:w-auto" onClick={() => setSyncModalOpen(true)}>
                Sync Dummy Data
              </Button>
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
