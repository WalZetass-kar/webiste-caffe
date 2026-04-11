"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/providers/toast-provider";
import type { RealtimeEventRecord } from "@/lib/models";
import { formatDateTime } from "@/lib/utils";

function isAdminPath(pathname: string) {
  return ["/dashboard", "/menu", "/pesanan", "/cabang", "/supply", "/aset", "/staff", "/laporan", "/identitas"].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { pushToast } = useToast();
  const [events, setEvents] = useState<RealtimeEventRecord[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const loadInitialEvents = async () => {
      try {
        const response = await fetch("/api/realtime-events", { cache: "no-store" });

        if (!response.ok) {
          throw new Error("Gagal memuat log realtime.");
        }

        const nextEvents = (await response.json()) as RealtimeEventRecord[];

        if (active) {
          setEvents(nextEvents);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadInitialEvents();

    const source = new EventSource("/api/realtime-events/stream");

    source.onmessage = (message) => {
      const event = JSON.parse(message.data) as RealtimeEventRecord;

      setEvents((current) => {
        if (current.some((item) => item.id === event.id)) {
          return current;
        }

        return [event, ...current].slice(0, 20);
      });

      pushToast({
        title: event.title,
        description: event.message,
        tone:
          event.tone === "error"
            ? "error"
            : event.tone === "warning"
              ? "warning"
              : event.tone === "success"
                ? "success"
                : "info",
      });
    };

    source.onerror = () => {
      source.close();
    };

    return () => {
      active = false;
      source.close();
    };
  }, [pushToast]);

  const shouldShowTray = useMemo(() => isAdminPath(pathname), [pathname]);

  return (
    <>
      {children}
      {shouldShowTray ? (
        <div className="fixed bottom-4 right-4 z-[70] flex max-w-sm flex-col items-end gap-3">
          {open ? (
            <Card className="w-[min(92vw,360px)] space-y-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/65">Realtime log</p>
                  <h3 className="mt-1 text-lg font-semibold text-cafe-text">Aktivitas terbaru</h3>
                </div>
                <Button variant="ghost" className="min-h-10 px-3 py-2 text-xs" onClick={() => setOpen(false)}>
                  Tutup
                </Button>
              </div>
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {events.length === 0 ? (
                  <div className="rounded-3xl border border-cafe-line bg-cafe-secondary/20 p-4 text-sm text-cafe-accent/75">
                    Belum ada notifikasi realtime.
                  </div>
                ) : (
                  events.map((event) => (
                    <article key={event.id} className="rounded-3xl border border-cafe-line bg-cafe-surface p-4">
                      <p className="text-sm font-semibold text-cafe-text">{event.title}</p>
                      <p className="mt-1 text-sm text-cafe-accent/80">{event.message}</p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <p className="text-xs text-cafe-accent/60">{formatDateTime(event.createdAt)}</p>
                        {event.href ? (
                          <Link href={event.href} className="text-xs font-semibold text-cafe-accent transition hover:text-cafe-text">
                            Buka
                          </Link>
                        ) : null}
                      </div>
                    </article>
                  ))
                )}
              </div>
            </Card>
          ) : null}
          <Button className="shadow-lg" onClick={() => setOpen((current) => !current)}>
            {open ? "Sembunyikan Log" : `Realtime Log (${events.length})`}
          </Button>
        </div>
      ) : null}
    </>
  );
}
