"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { useUserRole } from "@/components/providers/role-provider";
import { canAccessPath, roleLabels } from "@/lib/auth/roles";
import { sidebarMenu } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function DashboardSidebar() {
  const pathname = usePathname();
  const { settings } = useCafeSettings();
  const { role } = useUserRole();
  const isActive = useCallback(
    (href: string) => (href.includes("#") ? pathname === href.split("#")[0] : pathname === href),
    [pathname],
  );
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const visibleMenu = useMemo(
    () => sidebarMenu.filter((item) => canAccessPath(role, item.href.split("#")[0])),
    [role],
  );
  const autoOpenSections = useMemo(() => {
    const next: Record<string, boolean> = {};

    visibleMenu.forEach((item) => {
      const children = "children" in item ? item.children : undefined;

      if (!children) {
        return;
      }

      if (isActive(item.href) || children.some((child) => isActive(child.href))) {
        next[item.href] = true;
      }
    });

    return next;
  }, [isActive, visibleMenu]);

  return (
    <aside className="relative z-20 sticky top-6 hidden h-[calc(100vh-3rem)] w-[304px] rounded-xl border border-cafe-line bg-[#fcfaf7]/94 p-5 shadow-glass backdrop-blur-xl lg:flex lg:flex-col">
      <Link href="/" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cafe-secondary text-lg font-bold text-cafe-accent shadow-md">
          CF
        </div>
        <div>
          <h1 className="text-lg font-semibold text-cafe-text">{settings.cafeName}</h1>
          <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/70">{roleLabels[role]} workspace</p>
        </div>
      </Link>

      <nav className="overflow-y-auto pr-1">
        <ul className="space-y-2">
        {visibleMenu.map((item) => {
          const children = "children" in item ? item.children : undefined;
          const visibleChildren = children?.filter((child) => canAccessPath(role, child.href.split("#")[0]));
          const childActive = visibleChildren?.some((child) => isActive(child.href)) ?? false;
          const active = isActive(item.href) || childActive;
          const expanded =
            visibleChildren && visibleChildren.length > 0
              ? (openSections[item.href] ?? autoOpenSections[item.href] ?? active)
              : false;
          return (
            <li key={item.label} className="space-y-2">
              {visibleChildren && visibleChildren.length > 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    setOpenSections((current) => ({
                      ...current,
                      [item.href]: !(current[item.href] ?? active),
                    }))
                  }
                  className={cn(
                    "relative z-20 flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition duration-200",
                    active
                      ? "bg-cafe-secondary text-cafe-text shadow-md"
                      : "text-cafe-accent hover:bg-cafe-secondary/35 hover:text-cafe-text",
                  )}
                  aria-expanded={expanded}
                  aria-controls={`sidebar-section-${item.href.replace(/[^\w-]/g, "")}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn("h-3.5 w-3.5 transition-transform duration-200", expanded ? "rotate-180" : "")}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "relative z-20 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition duration-200",
                    active
                      ? "bg-cafe-secondary text-cafe-text shadow-md"
                      : "text-cafe-accent hover:bg-cafe-secondary/35 hover:text-cafe-text",
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )}
              {visibleChildren && expanded && (
                <ul id={`sidebar-section-${item.href.replace(/[^\w-]/g, "")}`} className="space-y-1 pl-5">
                  {visibleChildren.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          "relative z-20 block rounded-lg px-4 py-2 text-sm transition duration-200",
                          isActive(child.href)
                            ? "bg-cafe-secondary/55 text-cafe-text"
                            : "text-cafe-accent/80 hover:bg-cafe-surface hover:text-cafe-text",
                        )}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
        </ul>
      </nav>

      <div className="mt-6 rounded-xl border border-cafe-line bg-cafe-secondary/45 p-4">
        <p className="text-sm font-semibold text-cafe-text">Storefront Ready</p>
        <p className="mt-1 text-xs leading-5 text-cafe-accent/80">
          Brand, pengaturan pembayaran, dan akses per role kini mengikuti konfigurasi {settings.cafeName} secara terpusat.
        </p>
        <Link
          href="/order"
          className="mt-4 inline-flex rounded-lg bg-cafe-primary px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-cafe-text transition hover:bg-cafe-accent hover:text-[#fcfaf7]"
        >
          Open ordering
        </Link>
      </div>
    </aside>
  );
}
