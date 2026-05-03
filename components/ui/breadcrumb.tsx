"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const pathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  menu: "Menu",
  pesanan: "Pesanan",
  cabang: "Cabang",
  supply: "Supply",
  aset: "Aset",
  staff: "Staff",
  attendance: "Kehadiran",
  penilaian: "Penilaian",
  laporan: "Laporan",
  identitas: "Identitas",
  audit: "Audit",
  order: "Order",
};

export function Breadcrumb() {
  const pathname = usePathname();
  const paths = pathname.split("/").filter(Boolean);

  if (paths.length === 0) return null;

  return (
    <nav className="mb-6 flex items-center gap-2 text-sm">
      <Link href="/" className="text-cafe-accent/70 hover:text-cafe-accent transition">
        Home
      </Link>
      {paths.map((path, index) => {
        const href = "/" + paths.slice(0, index + 1).join("/");
        const label = pathLabels[path] || path;
        const isLast = index === paths.length - 1;

        return (
          <div key={href} className="flex items-center gap-2">
            <span className="text-cafe-accent/50">/</span>
            {isLast ? (
              <span className="font-medium text-cafe-text">{label}</span>
            ) : (
              <Link href={href} className="text-cafe-accent/70 hover:text-cafe-accent transition">
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
