import "server-only";

import type {
  AssetRecord,
  AuditLogRecord,
  EmployeeRecord,
  MenuRecord,
  OrderRecord,
  RatingRecord,
  StockHistoryRecord,
  SupplyRecord,
} from "@/lib/models";

type ExportFormat = "csv" | "excel";

function escapeCSV(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  const str = String(value);

  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

function arrayToCSV(headers: string[], rows: unknown[][]): string {
  const headerRow = headers.map(escapeCSV).join(",");
  const dataRows = rows.map((row) => row.map(escapeCSV).join(","));

  return [headerRow, ...dataRows].join("\n");
}

export function exportMenusToCSV(menus: MenuRecord[]): string {
  const headers = [
    "ID",
    "Nama",
    "Kategori",
    "Harga",
    "Deskripsi",
    "Stok",
    "Status",
    "Rating",
    "Waktu Persiapan",
    "Featured",
    "Dibuat",
    "Diupdate",
  ];

  const rows = menus.map((menu) => [
    menu.id,
    menu.name,
    menu.category,
    menu.price,
    menu.description,
    menu.stock,
    menu.status,
    menu.rating,
    menu.prepTime,
    menu.featured ? "Ya" : "Tidak",
    menu.createdAt,
    menu.updatedAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportSuppliesToCSV(supplies: SupplyRecord[]): string {
  const headers = [
    "ID",
    "Cabang",
    "Nama Bahan",
    "Supplier",
    "Stok",
    "Satuan",
    "Harga Beli",
    "Tanggal Restock Terakhir",
    "Ambang Batas Stok",
    "Dibuat",
    "Diupdate",
  ];

  const rows = supplies.map((supply) => [
    supply.id,
    supply.branchName,
    supply.materialName,
    supply.supplier,
    supply.stockQuantity,
    supply.unit,
    supply.purchasePrice,
    supply.lastRestockDate,
    supply.lowStockThreshold,
    supply.createdAt,
    supply.updatedAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportEmployeesToCSV(employees: EmployeeRecord[]): string {
  const headers = [
    "ID",
    "Cabang",
    "Nama Karyawan",
    "Posisi",
    "Nomor Telepon",
    "Email",
    "Dibuat",
    "Diupdate",
  ];

  const rows = employees.map((employee) => [
    employee.id,
    employee.branchName,
    employee.employeeName,
    employee.position,
    employee.phoneNumber,
    employee.email,
    employee.createdAt,
    employee.updatedAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportAssetsToCSV(assets: AssetRecord[]): string {
  const headers = [
    "ID",
    "Nama Aset",
    "Kategori",
    "Tanggal Pembelian",
    "Harga Pembelian",
    "Kondisi",
    "Dibuat",
    "Diupdate",
  ];

  const rows = assets.map((asset) => [
    asset.id,
    asset.assetName,
    asset.category,
    asset.purchaseDate,
    asset.purchasePrice,
    asset.condition,
    asset.createdAt,
    asset.updatedAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportOrdersToCSV(orders: OrderRecord[]): string {
  const headers = [
    "ID",
    "Kode Order",
    "Cabang",
    "Nama Pelanggan",
    "Nomor Meja",
    "Status",
    "Metode Pembayaran",
    "Subtotal",
    "Biaya Layanan",
    "Total",
    "Catatan",
    "Dibuat",
    "Diupdate",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.orderCode,
    order.branchName,
    order.customerName,
    order.tableNumber,
    order.status,
    order.paymentMethod,
    order.subtotal,
    order.serviceFee,
    order.total,
    order.notes,
    order.createdAt,
    order.updatedAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportRatingsToCSV(ratings: RatingRecord[]): string {
  const headers = [
    "ID",
    "Nama Pelanggan",
    "Rating Layanan",
    "Rating Makanan",
    "Komentar",
    "Order ID",
    "Nomor Meja",
    "Dibuat",
  ];

  const rows = ratings.map((rating) => [
    rating.id,
    rating.customerName,
    rating.serviceRating,
    rating.foodRating,
    rating.comment,
    rating.orderId || "",
    rating.tableNumber || "",
    rating.createdAt,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportStockHistoryToCSV(history: StockHistoryRecord[]): string {
  const headers = [
    "ID",
    "Cabang",
    "Nama Bahan",
    "Tipe Perubahan",
    "Jumlah Perubahan",
    "Satuan",
    "Stok Hasil",
    "Satuan Stok",
    "Referensi",
    "Tanggal",
  ];

  const rows = history.map((record) => [
    record.id,
    record.branchName,
    record.materialName,
    record.changeType,
    record.quantityChanged,
    record.unit,
    record.resultingStock,
    record.supplyUnit,
    record.reference,
    record.date,
  ]);

  return arrayToCSV(headers, rows);
}

export function exportAuditLogsToCSV(logs: AuditLogRecord[]): string {
  const headers = [
    "ID",
    "User ID",
    "Nama User",
    "Role User",
    "Aksi",
    "Entitas",
    "ID Entitas",
    "Nama Entitas",
    "Perubahan",
    "IP Address",
    "User Agent",
    "Timestamp",
  ];

  const rows = logs.map((log) => [
    log.id,
    log.userId,
    log.userName,
    log.userRole,
    log.action,
    log.entity,
    log.entityId || "",
    log.entityName || "",
    log.changes ? JSON.stringify(log.changes) : "",
    log.ipAddress || "",
    log.userAgent || "",
    log.timestamp,
  ]);

  return arrayToCSV(headers, rows);
}

// Helper untuk generate filename dengan timestamp
export function generateExportFilename(entity: string, format: ExportFormat = "csv"): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  return `cafeflow-${entity}-${timestamp}.${format}`;
}
