"use client";

import { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/models";

type PeakHoursChartProps = {
  orders: OrderRecord[];
};

export function PeakHoursChart({ orders }: PeakHoursChartProps) {
  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i.toString().padStart(2, "0")}:00`,
      orders: 0,
      revenue: 0,
    }));

    orders.forEach((order) => {
      const date = new Date(order.createdAt);
      const hour = date.getHours();
      hours[hour].orders += 1;
      hours[hour].revenue += order.total;
    });

    // Filter only hours with activity (6 AM to 11 PM)
    return hours.filter((h) => h.hour >= 6 && h.hour <= 23);
  }, [orders]);

  const maxOrders = Math.max(...hourlyData.map((h) => h.orders), 1);
  const peakHour = hourlyData.reduce((prev, current) => 
    current.orders > prev.orders ? current : prev
  );

  return (
    <Card className="starbucks-card">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">
            Peak Hours
          </p>
          <h3 className="mt-1 text-xl font-bold text-[#1E3932]">
            Jam sibuk cafe
          </h3>
        </div>
        <div className="rounded-lg border border-[#D4C5B9]/40 bg-[#F7F5F2] px-4 py-2">
          <p className="text-xs text-[#6B5D52]">Jam tersibuk</p>
          <p className="text-lg font-bold text-[#00704A]">
            {peakHour.label} ({peakHour.orders} orders)
          </p>
        </div>
      </div>

      <div className="h-[280px]">
        <Bar
          data={{
            labels: hourlyData.map((h) => h.label),
            datasets: [
              {
                label: "Orders per Jam",
                data: hourlyData.map((h) => h.orders),
                backgroundColor: hourlyData.map((h) => 
                  h.orders === maxOrders 
                    ? "rgba(203, 162, 88, 0.8)" 
                    : "rgba(0, 112, 74, 0.6)"
                ),
                borderColor: hourlyData.map((h) => 
                  h.orders === maxOrders 
                    ? "#CBA258" 
                    : "#00704A"
                ),
                borderWidth: 2,
                borderRadius: 8,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  afterLabel: (context) => {
                    const index = context.dataIndex;
                    const revenue = hourlyData[index].revenue;
                    return `Revenue: Rp ${revenue.toLocaleString("id-ID")}`;
                  },
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#00704A",
                  font: {
                    family: "Poppins, sans-serif",
                    size: 11,
                  },
                },
              },
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: "#1E3932",
                  font: {
                    family: "Poppins, sans-serif",
                  },
                },
                grid: {
                  color: "rgba(212, 197, 185, 0.3)",
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
