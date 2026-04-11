import { DashboardPageView } from "@/components/pages/dashboard-page";
import { getAttendanceRecords } from "@/lib/server/attendance-store";
import { getBranchItems } from "@/lib/server/branch-store";
import {
  getEmployeeItems,
  getLowStockSupplies,
  getOrders,
  getRatings,
  getStockHistory,
} from "@/lib/server/data-store";

export const dynamic = "force-dynamic";

export default async function DashboardRoutePage() {
  const [branches, orders, lowStockItems, stockHistory, employees, ratings, attendance] = await Promise.all([
    getBranchItems(),
    getOrders(),
    getLowStockSupplies(),
    getStockHistory(8),
    getEmployeeItems(),
    getRatings(),
    getAttendanceRecords(),
  ]);

  return (
    <DashboardPageView
      branches={branches}
      orders={orders}
      lowStockItems={lowStockItems}
      stockHistory={stockHistory}
      employees={employees}
      ratings={ratings}
      attendance={attendance}
    />
  );
}
