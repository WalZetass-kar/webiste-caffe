"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { OrderRecord, StockHistoryRecord, AttendanceRecord } from "@/lib/models";

type RecentActivitiesProps = {
  orders: OrderRecord[];
  stockHistory: StockHistoryRecord[];
  attendance: AttendanceRecord[];
};

type Activity = {
  id: string;
  type: "order" | "stock" | "attendance";
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
  color: string;
};

export function RecentActivities({ orders, stockHistory, attendance }: RecentActivitiesProps) {
  const activities = useMemo(() => {
    const result: Activity[] = [];

    // Add recent orders
    orders.slice(0, 3).forEach((order) => {
      result.push({
        id: `order-${order.id}`,
        type: "order",
        title: "Pesanan Baru",
        description: `${order.tableNumber} - ${order.customerName} (${order.items.length} items)`,
        timestamp: order.createdAt,
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        ),
        color: "from-[#00704A] to-[#00A862]",
      });
    });

    // Add recent stock changes
    stockHistory.slice(0, 2).forEach((stock) => {
      const isRestock = stock.changeType === "Restock";
      result.push({
        id: `stock-${stock.id}`,
        type: "stock",
        title: isRestock ? "Restock Bahan" : "Penggunaan Bahan",
        description: `${stock.materialName} ${isRestock ? "+" : "-"}${stock.quantityChanged} ${stock.unit}`,
        timestamp: stock.date,
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        color: isRestock ? "from-[#CBA258] to-[#D4A574]" : "from-[#6B5D52] to-[#8B7D72]",
      });
    });

    // Add recent attendance
    const today = new Date().toISOString().slice(0, 10);
    const todayAttendance = attendance.filter((a) => a.date === today).slice(0, 2);
    todayAttendance.forEach((att) => {
      result.push({
        id: `attendance-${att.id}`,
        type: "attendance",
        title: "Check-in Staff",
        description: `${att.employeeName} - ${att.checkIn}${att.isLate ? " (Terlambat)" : ""}`,
        timestamp: `${att.date}T${att.checkIn}`,
        icon: (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        ),
        color: att.isLate ? "from-[#D4A574] to-[#CBA258]" : "from-[#1E3932] to-[#2A4F47]",
      });
    });

    // Sort by timestamp (most recent first)
    return result.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 8);
  }, [orders, stockHistory, attendance]);

  return (
    <Card className="starbucks-card">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">
          Recent Activities
        </p>
        <h3 className="mt-1 text-xl font-bold text-[#1E3932]">
          Aktivitas terbaru
        </h3>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
        {activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DDD3]">
              <svg className="h-6 w-6 text-[#6B5D52]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-[#9B8B7E]">Belum ada aktivitas</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-start gap-3 rounded-xl border border-[#D4C5B9]/30 bg-white p-3 transition-all duration-300 hover:shadow-md"
            >
              <div className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${activity.color} text-white`}>
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#1E3932] text-sm truncate">
                  {activity.title}
                </p>
                <p className="text-xs text-[#6B5D52] mt-1 line-clamp-2">
                  {activity.description}
                </p>
                <p className="text-xs text-[#9B8B7E] mt-1">
                  {new Date(activity.timestamp).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(30, 57, 50, 0.2);
          border-radius: 999px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(30, 57, 50, 0.3);
        }
      `}</style>
    </Card>
  );
}
