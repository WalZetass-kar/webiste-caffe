"use client";

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CustomerReviews } from "@/components/dashboard/customer-reviews";
import { OrderKanban } from "@/components/dashboard/order-kanban";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { SectionGrid } from "@/components/dashboard/section-grid";
import { SummaryCard } from "@/components/dashboard/summary-card";
import { Carousel } from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import type {
  AttendanceRecord,
  BranchRecord,
  EmployeeRecord,
  OrderRecord,
  RatingRecord,
  StockHistoryRecord,
  SupplyRecord,
} from "@/lib/models";
import { formatCurrency } from "@/lib/utils";

type DashboardPageViewProps = {
  branches: BranchRecord[];
  orders: OrderRecord[];
  lowStockItems: SupplyRecord[];
  stockHistory: StockHistoryRecord[];
  employees: EmployeeRecord[];
  ratings: RatingRecord[];
  attendance: AttendanceRecord[];
};

const selectClassName =
  "min-h-12 w-full rounded-lg border border-cafe-line bg-cafe-surface px-4 py-3 text-sm text-cafe-text outline-none shadow-sm focus:border-cafe-primary/80 focus:ring-2 focus:ring-cafe-primary/25";

export function DashboardPageView({
  branches,
  orders,
  lowStockItems,
  stockHistory,
  employees,
  ratings,
  attendance,
}: DashboardPageViewProps) {
  const [selectedBranchId, setSelectedBranchId] = useState("all");
  const today = new Date().toISOString().slice(0, 10);

  const filteredOrders = useMemo(
    () => orders.filter((order) => selectedBranchId === "all" || order.branchId === selectedBranchId),
    [orders, selectedBranchId],
  );
  const filteredLowStockItems = useMemo(
    () => lowStockItems.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [lowStockItems, selectedBranchId],
  );
  const filteredStockHistory = useMemo(
    () => stockHistory.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [stockHistory, selectedBranchId],
  );
  const filteredEmployees = useMemo(
    () => employees.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [employees, selectedBranchId],
  );
  const filteredAttendance = useMemo(
    () => attendance.filter((item) => selectedBranchId === "all" || item.branchId === selectedBranchId),
    [attendance, selectedBranchId],
  );

  const orderBranchById = useMemo(
    () => new Map(orders.map((order) => [order.id, order.branchId])),
    [orders],
  );
  const filteredRatings = useMemo(() => {
    if (selectedBranchId === "all") {
      return ratings;
    }

    return ratings.filter((rating) => rating.orderId && orderBranchById.get(rating.orderId) === selectedBranchId);
  }, [orderBranchById, ratings, selectedBranchId]);

  const selectedBranch =
    selectedBranchId === "all" ? null : branches.find((branch) => branch.id === selectedBranchId) ?? null;
  const branchLabel = selectedBranch?.name ?? "Semua Branch";

  const grossSales = filteredOrders.reduce((sum, order) => sum + order.total, 0);
  const openOrders = filteredOrders.filter((order) => order.status !== "Selesai").length;
  const attendanceToday = filteredAttendance.filter((record) => record.date === today);
  const presentCount = new Set(attendanceToday.map((record) => record.employeeId)).size;
  const lateCount = attendanceToday.filter((record) => record.isLate).length;
  const ratingsCount = filteredRatings.length;
  const avgRating =
    ratingsCount > 0
      ? (
          filteredRatings.reduce((sum, rating) => sum + (rating.serviceRating + rating.foodRating) / 2, 0) /
          ratingsCount
        ).toFixed(1)
      : "0.0";

  const summaryCards = [
    {
      title: "Gross Sales",
      value: formatCurrency(grossSales),
      change: `${filteredOrders.length} order tercatat untuk ${branchLabel}`,
      detail: "Data order live",
      tone: "from-[#fcfaf7] via-[#f4ece3] to-[#e8d8c4]",
    },
    {
      title: "Open Orders",
      value: String(openOrders),
      change: `${filteredOrders.filter((order) => order.status === "Dapur").length} order aktif di kitchen`,
      detail: "Perlu diproses",
      tone: "from-[#faf6f1] via-[#f2e8dc] to-[#e5d2bc]",
    },
    {
      title: "Low Stock",
      value: String(filteredLowStockItems.length),
      change:
        filteredLowStockItems.length > 0
          ? `${filteredLowStockItems[0].materialName} perlu restock`
          : "Semua bahan aman",
      detail: "Alert inventori",
      tone: "from-[#fcf8f3] via-[#f3e6da] to-[#ead6c4]",
    },
    {
      title: "Present Today",
      value: String(presentCount),
      change: `${Math.max(filteredEmployees.length - presentCount, 0)} employee belum check in`,
      detail: "Attendance summary",
      tone: "from-[#fbf8f4] via-[#f1e7da] to-[#dfccb6]",
    },
    {
      title: "Late Employees",
      value: String(lateCount),
      change: lateCount > 0 ? "Perlu follow up shift pagi" : "Kedisiplinan hadir stabil",
      detail: "Kehadiran cabang",
      tone: "from-[#fcfaf6] via-[#f4ebdf] to-[#ead8c7]",
    },
    {
      title: "Cafe Rating",
      value: `${avgRating}/5`,
      change:
        ratingsCount > 0
          ? `${ratingsCount} penilaian pelanggan untuk ${branchLabel}`
          : "Belum ada penilaian pelanggan",
      detail: "Average customer experience",
      tone: "from-[#fcfaf7] via-[#f5ede4] to-[#e9dccd]",
    },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <Carousel
          slides={[
            {
              title: `${branchLabel} kini punya monitoring penjualan, stok, dan absensi dalam satu dashboard.`,
              subtitle:
                "Branch filter membantu owner membaca performa cafe per lokasi tanpa kehilangan konteks operasional harian.",
            },
            {
              title: "Order, inventory, employee, dan attendance sekarang saling terhubung.",
              subtitle:
                "Begitu branch dipilih, angka penjualan, low-stock alert, antrian order, dan staff attendance langsung menyesuaikan.",
            },
          ]}
        />

        <Card className="bg-cafe-surface/95">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Branch analytics</p>
              <h2 className="mt-2 text-2xl font-semibold text-cafe-text">
                Filter dashboard berdasarkan lokasi operasional
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-cafe-accent/78">
                Gunakan filter ini untuk melihat order, sales, inventory alert, staff, dan attendance summary per
                branch.
              </p>
            </div>
            <div className="w-full lg:w-72">
              <label className="mb-2 block text-xs uppercase tracking-[0.22em] text-cafe-accent/60">Branch filter</label>
              <select
                className={selectClassName}
                value={selectedBranchId}
                onChange={(event) => setSelectedBranchId(event.target.value)}
              >
                <option value="all">Semua Branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map((item) => (
            <SummaryCard key={item.title} {...item} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <SalesChart orders={filteredOrders} branchLabel={branchLabel} />
          <OrderKanban orders={filteredOrders} />
        </section>

        <CustomerReviews ratings={filteredRatings} />
        <SectionGrid
          lowStockItems={filteredLowStockItems}
          stockHistory={filteredStockHistory}
          employees={filteredEmployees}
          orders={filteredOrders}
        />
      </div>
    </AppShell>
  );
}
