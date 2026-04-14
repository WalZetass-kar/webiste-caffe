import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { EmployeeRecord, OrderRecord, StockHistoryRecord, SupplyRecord } from "@/lib/models";
import { formatDateTime, formatQuantity, getReceiptLink } from "@/lib/utils";

type SectionGridProps = {
  lowStockItems: SupplyRecord[];
  stockHistory: StockHistoryRecord[];
  employees: EmployeeRecord[];
  orders: OrderRecord[];
};

function getHistoryTone(changeType: StockHistoryRecord["changeType"]): "green" | "cream" | "slate" {
  if (changeType === "Restock") {
    return "green";
  }

  if (changeType === "Order") {
    return "cream";
  }

  return "slate";
}

export function SectionGrid({ lowStockItems, stockHistory, employees, orders }: SectionGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <Card className="space-y-4 starbucks-card animate-fade-in animate-delay-100">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a4a3a]">Panel Notifikasi</p>
          <h3 className="mt-1 text-lg font-semibold text-[#3d3027]">Peringatan Restock Otomatis</h3>
        </div>
        <div className="space-y-3">
          {lowStockItems.length === 0 ? (
            <div className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 text-sm text-[#3d3027]/70">
              Semua stok aman. Belum ada peringatan aktif.
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-[#3d3027] truncate">{item.materialName}</p>
                  <Badge tone="rose">{formatQuantity(item.stockQuantity, item.unit)}</Badge>
                </div>
                <p className="mt-1 text-xs text-[#5a4a3a]/80 truncate">
                  {item.branchName} | {item.supplier}
                </p>
                <p className="mt-2 text-xs text-[#3d3027]/60">
                  Minimum aman {formatQuantity(item.lowStockThreshold, item.unit)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 starbucks-card animate-fade-in animate-delay-200">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a4a3a]">Riwayat Persediaan</p>
          <h3 className="mt-1 text-lg font-semibold text-[#3d3027]">Perubahan stok terbaru</h3>
        </div>
        <div className="space-y-3">
          {stockHistory.length === 0 ? (
            <div className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 text-sm text-[#3d3027]/70">
              Belum ada riwayat stok yang tercatat.
            </div>
          ) : (
            stockHistory.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3d3027] truncate">{item.materialName}</p>
                    <p className="mt-1 text-xs text-[#5a4a3a]/80 truncate">
                      {item.branchName} | {formatDateTime(item.date)}
                    </p>
                  </div>
                  <Badge tone={getHistoryTone(item.changeType)}>{item.changeType}</Badge>
                </div>
                <p className="mt-2 text-xs text-[#3d3027]/60 truncate">
                  {item.reference} | {formatQuantity(item.quantityChanged, item.unit)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 starbucks-card animate-fade-in animate-delay-300">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a4a3a]">Struk Digital</p>
          <h3 className="mt-1 text-lg font-semibold text-[#3d3027]">Struk terbaru dari pesanan masuk</h3>
        </div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 text-sm text-[#3d3027]/70">
              Belum ada struk yang bisa ditampilkan.
            </div>
          ) : (
            orders.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={getReceiptLink(item.orderCode)}
                className="block rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 shadow-sm transition-all duration-300 hover:bg-[#E8DDD3] hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#3d3027] truncate">{item.orderCode}</p>
                    <p className="mt-1 text-xs text-[#5a4a3a]/80 truncate">
                      {item.branchName} | {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <Badge tone="cream">{item.paymentMethod}</Badge>
                </div>
                <p className="mt-2 text-xs text-[#3d3027]/60 truncate">
                  {item.customerName} - {item.tableNumber}
                </p>
              </Link>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 starbucks-card animate-fade-in animate-delay-400">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#5a4a3a]">Karyawan</p>
          <h3 className="mt-1 text-lg font-semibold text-[#3d3027]">Tim yang Sedang Aktif</h3>
        </div>
        <div className="space-y-3">
          {employees.slice(0, 4).map((item, index) => (
            <div key={item.id} className="rounded-xl border border-[#D4C5B9]/30 bg-[#F7F5F2] p-3 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#3d3027] truncate">{item.employeeName}</p>
                  <p className="text-xs text-[#5a4a3a]/80 truncate">
                    {item.position} | {item.branchName}
                  </p>
                </div>
                <Badge tone="blue">0{index + 1}</Badge>
              </div>
              <p className="mt-2 text-xs text-[#3d3027]/60 truncate">{item.email}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
