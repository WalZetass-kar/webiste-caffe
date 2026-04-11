import {
  faBellConcierge,
  faBoxOpen,
  faBuilding,
  faChartLine,
  faClipboardCheck,
  faFileInvoice,
  faMugHot,
  faPercent,
  faUsers,
  faWarehouse,
} from "@fortawesome/free-solid-svg-icons";

export const sidebarMenu = [
  {
    icon: faChartLine,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: faMugHot,
    label: "Manajemen Menu",
    href: "/menu",
    children: [
      { label: "Daftar Menu", href: "/menu#daftar-menu" },
      { label: "Diskon", href: "/menu#diskon" },
      { label: "Menu Spesial", href: "/menu#spesial" },
    ],
  },
  {
    icon: faBellConcierge,
    label: "Pesanan",
    href: "/pesanan",
  },
  {
    icon: faBuilding,
    label: "Cabang Cafe",
    href: "/cabang",
  },
  {
    icon: faWarehouse,
    label: "Supply Bahan",
    href: "/supply",
  },
  {
    icon: faBoxOpen,
    label: "Aset Cafe",
    href: "/aset",
  },
  {
    icon: faUsers,
    label: "Staff",
    href: "/staff",
    children: [
      { label: "Data Staff", href: "/staff" },
      { label: "Absensi", href: "/staff/attendance" },
      { label: "Cuti", href: "/staff#cuti" },
      { label: "Penggajian", href: "/staff#gaji" },
      { label: "Rekrutmen", href: "/staff#rekrutmen" },
      { label: "Bonus Bulanan", href: "/staff#bonus" },
    ],
  },
  {
    icon: faClipboardCheck,
    label: "Penilaian",
    href: "/penilaian",
  },
  {
    icon: faPercent,
    label: "Laporan Penjualan",
    href: "/laporan",
  },
  {
    icon: faFileInvoice,
    label: "Identitas Cafe",
    href: "/identitas",
  },
] as const;
