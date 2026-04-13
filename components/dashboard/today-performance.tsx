"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/models";
import { formatCurrency } from "@/lib/utils";

type TodayPerformanceProps = {
  orders: OrderRecord[];
};

export function TodayPerformance({ orders }: TodayPerformanceProps) {
  const today = new Date().toISOString().slice(0, 10);

  const todayStats = useMemo(() => {
    const todayOrders = orders.filter((order) => order.createdAt.startsWith(today));
    
    const totalRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = todayOrders.length;
    const completedOrders = todayOrders.filter((order) => order.status === "Selesai").length;
    const pendingOrders = todayOrders.filter((order) => order.status !== "Selesai").length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    // Calculate hourly trend
    const currentHour = new Date().getHours();
    const lastHourOrders = todayOrders.filter((order) => {
      const orderHour = new Date(order.createdAt).getHours();
      return orderHour === currentHour;
    });
    const lastHourRevenue = lastHourOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      avgOrderValue,
      lastHourOrders: lastHourOrders.length,
      lastHourRevenue,
    };
  }, [orders, today]);

  const metrics = [
    {
      label: "Revenue Hari Ini",
      value: formatCurrency(todayStats.totalRevenue),
      subtext: `${todayStats.totalOrders} orders`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#00704A] to-[#00A862]",
    },
    {
      label: "Rata-rata Order",
      value: formatCurrency(todayStats.avgOrderValue),
      subtext: "per transaksi",
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      color: "from-[#CBA258] to-[#D4A574]",
    },
    {
      label: "Order Selesai",
      value: `${todayStats.completedOrders}/${todayStats.totalOrders}`,
      subtext: `${todayStats.pendingOrders} pending`,
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#1E3932] to-[#2A4F47]",
    },
    {
      label: "Jam Terakhir",
      value: `${todayStats.lastHourOrders} orders`,
      subtext: formatCurrency(todayStats.lastHourRevenue),
      icon: (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "from-[#6B5D52] to-[#8B7D72]",
    },
  ];

  return (
    <Card className="starbucks-card">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">
          Today's Performance
        </p>
        <h3 className="mt-1 text-xl font-bold text-[#1E3932]">
          Performa hari ini - {new Date().toLocaleDateString("id-ID", { 
            weekday: "long", 
            day: "numeric", 
            month: "long" 
          })}
        </h3>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="group relative overflow-hidden rounded-2xl border border-[#D4C5B9]/40 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg"
          >
            <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-[#00704A]/5 blur-2xl" />
            <div className="relative space-y-3">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${metric.color} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}>
                {metric.icon}
              </div>
              <div>
                <p className="text-xs font-medium text-[#6B5D52] mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-bold text-[#1E3932]">
                  {metric.value}
                </p>
                <p className="text-xs text-[#9B8B7E] mt-1">
                  {metric.subtext}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
