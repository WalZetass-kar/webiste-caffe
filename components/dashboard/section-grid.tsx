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
      <Card className="space-y-4 bg-cafe-surface/95 animate-fade-in animate-delay-100">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Notification Panel</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">Auto Restock Alert</h3>
        </div>
        <div className="space-y-3">
          {lowStockItems.length === 0 ? (
            <div className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 text-sm text-cafe-accent/75">
              Semua stok aman. Belum ada alert aktif.
            </div>
          ) : (
            lowStockItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-cafe-text">{item.materialName}</p>
                  <Badge tone="rose">{formatQuantity(item.stockQuantity, item.unit)}</Badge>
                </div>
                <p className="mt-1 text-xs text-cafe-accent/65">
                  {item.branchName} | {item.supplier}
                </p>
                <p className="mt-2 text-xs text-cafe-accent/72">
                  Minimum aman {formatQuantity(item.lowStockThreshold, item.unit)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 bg-cafe-surface/95 animate-fade-in animate-delay-200">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Supply History</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">Perubahan stok terbaru</h3>
        </div>
        <div className="space-y-3">
          {stockHistory.length === 0 ? (
            <div className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 text-sm text-cafe-accent/75">
              Belum ada histori stok yang tercatat.
            </div>
          ) : (
            stockHistory.slice(0, 4).map((item) => (
              <div key={item.id} className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-cafe-text">{item.materialName}</p>
                    <p className="mt-1 text-xs text-cafe-accent/65">
                      {item.branchName} | {formatDateTime(item.date)}
                    </p>
                  </div>
                  <Badge tone={getHistoryTone(item.changeType)}>{item.changeType}</Badge>
                </div>
                <p className="mt-2 text-xs text-cafe-accent/72">
                  {item.reference} | {formatQuantity(item.quantityChanged, item.unit)}
                </p>
              </div>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 bg-cafe-surface/95 animate-fade-in animate-delay-300">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Digital Receipt</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">Receipt terbaru dari order masuk</h3>
        </div>
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 text-sm text-cafe-accent/75">
              Belum ada receipt yang bisa ditampilkan.
            </div>
          ) : (
            orders.slice(0, 4).map((item) => (
              <Link
                key={item.id}
                href={getReceiptLink(item.orderCode)}
                className="block rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 shadow-sm transition-all duration-300 hover:bg-[#f7eee4] hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-cafe-text">{item.orderCode}</p>
                    <p className="mt-1 text-xs text-cafe-accent/65">
                      {item.branchName} | {formatDateTime(item.createdAt)}
                    </p>
                  </div>
                  <Badge tone="cream">{item.paymentMethod}</Badge>
                </div>
                <p className="mt-2 text-xs text-cafe-accent/75">
                  {item.customerName} - {item.tableNumber}
                </p>
              </Link>
            ))
          )}
        </div>
      </Card>

      <Card className="space-y-4 bg-cafe-surface/95 animate-fade-in animate-delay-400">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Staff</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">Tim yang Sedang Aktif</h3>
        </div>
        <div className="space-y-3">
          {employees.slice(0, 4).map((item, index) => (
            <div key={item.id} className="rounded-xl border border-cafe-line bg-cafe-secondary/24 p-3 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-cafe-text">{item.employeeName}</p>
                  <p className="text-xs text-cafe-accent/65">
                    {item.position} | {item.branchName}
                  </p>
                </div>
                <Badge tone="blue">0{index + 1}</Badge>
              </div>
              <p className="mt-2 text-xs text-cafe-accent/65">{item.email}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
