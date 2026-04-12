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
      tone: "from-white to-[#F7F5F2]",
    },
    {
      title: "Open Orders",
      value: String(openOrders),
      change: `${filteredOrders.filter((order) => order.status === "Dapur").length} order aktif di kitchen`,
      detail: "Perlu diproses",
      tone: "from-white to-[#E8DDD3]",
    },
    {
      title: "Low Stock",
      value: String(filteredLowStockItems.length),
      change:
        filteredLowStockItems.length > 0
          ? `${filteredLowStockItems[0].materialName} perlu restock`
          : "Semua bahan aman",
      detail: "Alert inventori",
      tone: "from-white to-[#F7F5F2]",
    },
    {
      title: "Present Today",
      value: String(presentCount),
      change: `${Math.max(filteredEmployees.length - presentCount, 0)} employee belum check in`,
      detail: "Attendance summary",
      tone: "from-white to-[#E8DDD3]",
    },
    {
      title: "Late Employees",
      value: String(lateCount),
      change: lateCount > 0 ? "Perlu follow up shift pagi" : "Kedisiplinan hadir stabil",
      detail: "Kehadiran cabang",
      tone: "from-white to-[#F7F5F2]",
    },
    {
      title: "Cafe Rating",
      value: `${avgRating}/5`,
      change:
        ratingsCount > 0
          ? `${ratingsCount} penilaian pelanggan untuk ${branchLabel}`
          : "Belum ada penilaian pelanggan",
      detail: "Average customer experience",
      tone: "from-white to-[#E8DDD3]",
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

        <Card className="starbucks-card">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">Branch analytics</p>
              <h2 className="mt-2 text-2xl font-bold text-[#1E3932]">
                Filter dashboard berdasarkan lokasi operasional
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#6B5D52]">
                Gunakan filter ini untuk melihat order, sales, inventory alert, staff, dan attendance summary per
                branch.
              </p>
            </div>
            <div className="w-full lg:w-72">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#6B5D52]">Branch filter</label>
              <select
                className="starbucks-input w-full"
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
