import "server-only";

import * as XLSX from "xlsx";
import Papa from "papaparse";
import type {
  MenuRecord,
  SupplyRecord,
  EmployeeRecord,
  AssetRecord,
  OrderRecord,
  RatingRecord,
  StockHistoryRecord,
  AttendanceRecord,
  AuditLogRecord,
} from "@/lib/models";

export type ExportFormat = "csv" | "xlsx";
export type ExportEntity =
  | "menus"
  | "supplies"
  | "employees"
  | "assets"
  | "orders"
  | "ratings"
  | "stockHistory"
  | "attendance"
  | "auditLogs";

// Flatten nested objects for export
function flattenMenuRecord(menu: MenuRecord) {
  return {
    ID: menu.id,
    Slug: menu.slug,
    Nama: menu.name,
    Kategori: menu.category,
    Harga: menu.price,
    Deskripsi: menu.description,
    Gambar: menu.image,
    Stok: menu.stock,
    Status: menu.status,
    Rating: menu.rating,
    "Waktu Persiapan": menu.prepTime,
    Featured: menu.featured ? "Ya" : "Tidak",
    "Dibuat Pada": menu.createdAt,
    "Diperbarui Pada": menu.updatedAt,
  };
}

function flattenSupplyRecord(supply: SupplyRecord) {
  return {
    ID: supply.id,
    "ID Cabang": supply.branchId,
    "Nama Cabang": supply.branchName,
    "Nama Bahan": supply.materialName,
    Supplier: supply.supplier,
    "Jumlah Stok": supply.stockQuantity,
    Satuan: supply.unit,
    "Harga Beli": supply.purchasePrice,
    "Tanggal Restock Terakhir": supply.lastRestockDate,
    "Ambang Stok Rendah": supply.lowStockThreshold,
    "Dibuat Pada": supply.createdAt,
    "Diperbarui Pada": supply.updatedAt,
  };
}

function flattenEmployeeRecord(employee: EmployeeRecord) {
  return {
    ID: employee.id,
    "ID Cabang": employee.branchId,
    "Nama Cabang": employee.branchName,
    "Nama Karyawan": employee.employeeName,
    Posisi: employee.position,
    "Nomor Telepon": employee.phoneNumber,
    Email: employee.email,
    Foto: employee.photo,
    "Dibuat Pada": employee.createdAt,
    "Diperbarui Pada": employee.updatedAt,
  };
}

function flattenAssetRecord(asset: AssetRecord) {
  return {
    ID: asset.id,
    "Nama Aset": asset.assetName,
    Kategori: asset.category,
    "Tanggal Pembelian": asset.purchaseDate,
    "Harga Pembelian": asset.purchasePrice,
    Kondisi: asset.condition,
    Foto: asset.photo,
    "Dibuat Pada": asset.createdAt,
    "Diperbarui Pada": asset.updatedAt,
  };
}

function flattenOrderRecord(order: OrderRecord) {
  return {
    ID: order.id,
    "ID Cabang": order.branchId,
    "Nama Cabang": order.branchName,
    "Kode Order": order.orderCode,
    "Nama Pelanggan": order.customerName,
    "Nomor Meja": order.tableNumber,
    Status: order.status,
    "Metode Pembayaran": order.paymentMethod,
    "Jumlah Item": order.items.length,
    Subtotal: order.subtotal,
    "Biaya Layanan": order.serviceFee,
    Total: order.total,
    Catatan: order.notes,
    "Dibuat Pada": order.createdAt,
    "Diperbarui Pada": order.updatedAt,
  };
}

function flattenRatingRecord(rating: RatingRecord) {
  return {
    ID: rating.id,
    "Nama Pelanggan": rating.customerName,
    "Rating Layanan": rating.serviceRating,
    "Rating Makanan": rating.foodRating,
    Komentar: rating.comment,
    "ID Order": rating.orderId || "",
    "Nomor Meja": rating.tableNumber || "",
    "Dibuat Pada": rating.createdAt,
    "Diperbarui Pada": rating.updatedAt,
  };
}

function flattenStockHistoryRecord(history: StockHistoryRecord) {
  return {
    ID: history.id,
    "ID Cabang": history.branchId,
    "Nama Cabang": history.branchName,
    "ID Supply": history.supplyId,
    "Nama Bahan": history.materialName,
    "Tipe Perubahan": history.changeType,
    "Jumlah Perubahan": history.quantityChanged,
    Satuan: history.unit,
    "Stok Hasil": history.resultingStock,
    "Satuan Supply": history.supplyUnit,
    Tanggal: history.date,
    Referensi: history.reference,
  };
}

function flattenAttendanceRecord(attendance: AttendanceRecord) {
  return {
    ID: attendance.id,
    "ID Karyawan": attendance.employeeId,
    "Nama Karyawan": attendance.employeeName,
    Posisi: attendance.position,
    "ID Cabang": attendance.branchId,
    "Nama Cabang": attendance.branchName,
    Tanggal: attendance.date,
    "Check In": attendance.checkIn,
    "Check Out": attendance.checkOut || "",
    "Total Jam Kerja": attendance.totalWorkingHours,
    Metode: attendance.method,
    Terlambat: attendance.isLate ? "Ya" : "Tidak",
    "Dibuat Pada": attendance.createdAt,
    "Diperbarui Pada": attendance.updatedAt,
  };
}

function flattenAuditLogRecord(log: AuditLogRecord) {
  return {
    ID: log.id,
    "ID User": log.userId,
    "Nama User": log.userName,
    "Role User": log.userRole,
    Aksi: log.action,
    Entitas: log.entity,
    "ID Entitas": log.entityId || "",
    "Nama Entitas": log.entityName || "",
    "IP Address": log.ipAddress || "",
    "User Agent": log.userAgent || "",
    Timestamp: log.timestamp,
  };
}

export function exportToCSV<T>(data: T[], flattenFn: (item: T) => Record<string, unknown>): string {
  const flattenedData = data.map(flattenFn);
  return Papa.unparse(flattenedData, {
    header: true,
    delimiter: ",",
  });
}

export function exportToExcel<T>(
  data: T[],
  flattenFn: (item: T) => Record<string, unknown>,
  sheetName: string,
): Buffer {
  const flattenedData = data.map(flattenFn);
  const worksheet = XLSX.utils.json_to_sheet(flattenedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  return buffer;
}

export function getExportFlattenFunction(entity: ExportEntity) {
  switch (entity) {
    case "menus":
      return flattenMenuRecord;
    case "supplies":
      return flattenSupplyRecord;
    case "employees":
      return flattenEmployeeRecord;
    case "assets":
      return flattenAssetRecord;
    case "orders":
      return flattenOrderRecord;
    case "ratings":
      return flattenRatingRecord;
    case "stockHistory":
      return flattenStockHistoryRecord;
    case "attendance":
      return flattenAttendanceRecord;
    case "auditLogs":
      return flattenAuditLogRecord;
    default:
      throw new Error(`Unknown entity: ${entity}`);
  }
}

export function getExportSheetName(entity: ExportEntity): string {
  const names: Record<ExportEntity, string> = {
    menus: "Menu",
    supplies: "Bahan Baku",
    employees: "Karyawan",
    assets: "Aset",
    orders: "Pesanan",
    ratings: "Penilaian",
    stockHistory: "Riwayat Stok",
    attendance: "Absensi",
    auditLogs: "Log Audit",
  };

  return names[entity];
}

export function getExportFileName(entity: ExportEntity, format: ExportFormat): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
  const sheetName = getExportSheetName(entity);
  return `${sheetName}_${timestamp}.${format}`;
}
