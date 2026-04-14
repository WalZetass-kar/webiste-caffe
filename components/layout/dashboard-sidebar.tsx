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
    <aside className="fixed left-0 top-0 z-20 hidden h-screen w-[240px] bg-[#3d3027] lg:flex lg:flex-col rounded-r-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-6 border-b border-[#4d4037]">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#5a4a3a] text-sm font-bold text-[#d4c5b9]">
          <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H4V5h16v14zM6 10h2v7H6zm4-3h2v10h-2zm4 6h2v4h-2zm4-8h2v11h-2z"/>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-semibold text-[#f5f0e8]">{settings.cafeName}</h1>
          <p className="text-xs text-[#a89885]">Management Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="space-y-1">
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
            <li key={item.label} className="space-y-1">
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
                    "relative flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[#5a4a3a] text-[#f5f0e8] shadow-sm"
                      : "text-[#c4b5a3] hover:bg-[#4d4037] hover:text-[#f5f0e8]",
                  )}
                  aria-expanded={expanded}
                  aria-controls={`sidebar-section-${item.href.replace(/[^\w-]/g, "")}`}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span className="flex-1">{item.label}</span>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className={cn("h-3 w-3 transition-transform duration-200", expanded ? "rotate-180" : "")}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                    active
                      ? "bg-[#5a4a3a] text-[#f5f0e8] shadow-sm"
                      : "text-[#c4b5a3] hover:bg-[#4d4037] hover:text-[#f5f0e8]",
                  )}
                >
                  <FontAwesomeIcon icon={item.icon} className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              )}
              {visibleChildren && expanded && (
                <ul id={`sidebar-section-${item.href.replace(/[^\w-]/g, "")}`} className="space-y-0.5 pl-11 mt-1">
                  {visibleChildren.map((child) => (
                    <li key={child.href}>
                      <Link
                        href={child.href}
                        className={cn(
                          "relative block rounded-lg px-3 py-2 text-sm transition-all duration-200",
                          isActive(child.href)
                            ? "bg-[#4d4037] text-[#f5f0e8] font-medium"
                            : "text-[#b5a693] hover:bg-[#4d4037]/50 hover:text-[#f5f0e8]",
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

      {/* Footer */}
      <div className="border-t border-[#4d4037] p-4">
        <div className="flex items-center gap-3 rounded-xl bg-[#4d4037] p-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5a4a3a]">
            <svg className="h-4 w-4 text-[#d4c5b9]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[#f5f0e8] truncate">Powered by Coffee</p>
            <p className="text-xs text-[#a89885] truncate">v1.0.0</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
