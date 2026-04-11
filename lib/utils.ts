import type { MenuCategory, PaymentMethod, SupplyUnit, UsageUnit } from "@/lib/models";

const paymentMethodNotePatterns = [
  /Payment\s*:\s*(?:Cash|QRIS|Transfer(?:\s+Bank)?)(?:\s*[-|,:;]\s*)?/gi,
  /Metode\s*Pembayaran\s*:\s*(?:Cash|QRIS|Transfer(?:\s+Bank)?)(?:\s*[-|,:;]\s*)?/gi,
];

const publicMenuImageByCategory: Record<MenuCategory, string> = {
  Coffee: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1400&q=80",
  Food: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=1200&q=80",
  Dessert: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=1400&q=80",
  Drink: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?auto=format&fit=crop&w=1400&q=80",
};

const brokenPublicImageMap: Record<string, string> = {
  "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=1200&q=80":
    publicMenuImageByCategory.Dessert,
};

export function cn(...classes: (string | undefined | null | boolean | 0 | false)[]) {
  return classes.filter(Boolean).join(" ");
}

function parseDateInput(value: string): Date | null {
  if (!value) {
    return null;
  }

  const localDateMatch = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (localDateMatch) {
    const [, year, month, day] = localDateMatch;
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  const parsed = new Date(value);

  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateValue(value: string, options: Intl.DateTimeFormatOptions) {
  const parsed = parseDateInput(value);

  if (!parsed) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", options).format(parsed);
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export function resolvePublicMenuImage(image: string | null | undefined, category: MenuCategory) {
  const normalized = image?.trim();

  if (!normalized) {
    return publicMenuImageByCategory[category];
  }

  return brokenPublicImageMap[normalized] ?? normalized;
}

export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("id-ID", {
    notation: "compact",
    compactDisplay: "short",
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatDate(dateStr: string): string {
  return formatDateValue(dateStr, {
    dateStyle: "medium",
  });
}

export function formatDateTime(dateStr: string): string {
  return formatDateValue(dateStr, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatQuantity(value: number, unit: string): string {
  const formatted = new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 2,
  }).format(value);

  return `${formatted} ${unit}`;
}

export function formatWorkingHours(value: number): string {
  const totalMinutes = Math.round(value * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} menit`;
  }

  if (minutes === 0) {
    return `${hours} jam`;
  }

  return `${hours} jam ${minutes} menit`;
}

export function getReceiptLink(orderCode: string) {
  return `/receipt/${orderCode}`;
}

export function formatRatingLabel(value: number): string {
  if (value >= 5) return "Istimewa 5/5";
  if (value >= 4) return "Sangat Baik 4/5";
  if (value >= 3) return "Baik 3/5";
  if (value >= 2) return "Cukup 2/5";
  return "Perlu Perbaikan 1/5";
}

export function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function parsePaymentMethodFromNotes(notes: string | null | undefined): PaymentMethod {
  if (!notes) {
    return "Cash";
  }

  if (/\b(?:qris|qr)\b/i.test(notes)) {
    return "QRIS";
  }

  if (/\b(?:transfer|rekening|rek)\b/i.test(notes)) {
    return "Transfer";
  }

  return "Cash";
}

export function stripPaymentMethodFromNotes(notes: string | null | undefined): string {
  if (!notes) return "";

  return paymentMethodNotePatterns
    .reduce((cleaned, pattern) => cleaned.replace(pattern, ""), notes)
    .replace(/^\s*[-|,:;]+\s*/g, "")
    .replace(/\s*[-|,:;]+\s*$/g, "")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\s*\n\s*/g, "\n")
    .trim();
}

export function getUsageUnitsForSupplyUnit(unit: SupplyUnit): UsageUnit[] {
  switch (unit) {
    case "kg":
      return ["g"];
    case "liter":
      return ["ml"];
    case "pcs":
      return ["pcs"];
    default:
      return ["pcs"];
  }
}

export function convertUsageToSupplyUnit(quantity: number, usageUnit: UsageUnit, supplyUnit: SupplyUnit) {
  if (supplyUnit === "kg" && usageUnit === "g") {
    return quantity / 1000;
  }

  if (supplyUnit === "liter" && usageUnit === "ml") {
    return quantity / 1000;
  }

  if (supplyUnit === "pcs" && usageUnit === "pcs") {
    return quantity;
  }

  throw new Error(`Tidak dapat mengonversi ${usageUnit} ke ${supplyUnit}`);
}

export function getDefaultLowStockThreshold(unit: SupplyUnit) {
  switch (unit) {
    case "kg":
      return 1;
    case "liter":
      return 1;
    case "pcs":
      return 5;
    default:
      return 1;
  }
}

export function isLowStock(item: { stockQuantity: number; lowStockThreshold: number }) {
  return item.stockQuantity <= item.lowStockThreshold;
}
