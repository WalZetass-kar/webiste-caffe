"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faChevronDown, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { useUserRole } from "@/components/providers/role-provider";
import { canAccessPath, roleLabels } from "@/lib/auth/roles";
import { sidebarMenu } from "@/lib/menu";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { settings } = useCafeSettings();
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const closeNav = () => setOpen(false);
  const visibleMenu = useMemo(
    () => sidebarMenu.filter((item) => canAccessPath(role, item.href.split("#")[0])),
    [role],
  );

  const isActive = useCallback(
    (href: string) => (href.includes("#") ? pathname === href.split("#")[0] : pathname === href),
    [pathname],
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
    <>
      <div className="lg:hidden">
        <button
          type="button"
          aria-label={open ? "Tutup menu" : "Buka menu"}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cafe-line bg-cafe-surface text-cafe-accent shadow-md transition hover:bg-cafe-secondary/35"
        >
          <FontAwesomeIcon icon={open ? faXmark : faBars} className="h-5 w-5" />
        </button>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-[#3A3A3A]/25 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setOpen(false)}
      />

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[86vw] max-w-[320px] flex-col rounded-r-xl border border-cafe-line border-l-0 bg-[#fcfaf7]/96 p-4 shadow-glass backdrop-blur-xl transition-transform duration-300 lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-6 flex items-center justify-between border-b border-[#efe1d1] pb-4">
          <div>
            <h2 className="text-xl text-cafe-text">{settings.cafeName}</h2>
            <p className="text-sm text-cafe-accent/80">{roleLabels[role]} navigation</p>
          </div>
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={() => setOpen(false)}
            className="rounded-lg border border-cafe-line bg-cafe-surface px-3 py-2 text-cafe-accent shadow-md"
          >
            <FontAwesomeIcon icon={faXmark} className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto pr-1">
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
                <li key={item.href} className="space-y-2">
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
                        "flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-medium transition duration-200",
                        active
                          ? "bg-cafe-secondary text-cafe-text shadow-md"
                          : "bg-cafe-surface text-cafe-accent hover:bg-cafe-secondary/35 hover:text-cafe-text",
                      )}
                      aria-expanded={expanded}
                      aria-controls={`mobile-sidebar-section-${item.href.replace(/[^\w-]/g, "")}`}
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
                      onClick={closeNav}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition duration-200",
                        active
                          ? "bg-cafe-secondary text-cafe-text shadow-md"
                          : "bg-cafe-surface text-cafe-accent hover:bg-cafe-secondary/35 hover:text-cafe-text",
                      )}
                    >
                      <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  )}
                  {visibleChildren && expanded ? (
                    <ul id={`mobile-sidebar-section-${item.href.replace(/[^\w-]/g, "")}`} className="space-y-1 pl-4">
                      {visibleChildren.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={closeNav}
                            className={cn(
                              "block rounded-lg px-4 py-2 text-sm transition duration-200",
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
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <Link
          href="/order"
          onClick={closeNav}
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-cafe-primary px-4 py-3 text-sm font-semibold text-cafe-text shadow-md transition hover:bg-cafe-accent hover:text-[#fcfaf7]"
        >
          Buka Mobile Ordering
        </Link>
      </aside>
    </>
  );
}
