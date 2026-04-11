"use client";

import { Line } from "react-chartjs-2";
import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/models";
import { formatCompactNumber } from "@/lib/utils";

type SalesChartProps = {
  orders: OrderRecord[];
  branchLabel?: string;
};

function createSeries(orders: OrderRecord[]) {
  const formatter = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
  });
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);

    return {
      key,
      label: formatter.format(date),
      sales: 0,
      orders: 0,
    };
  });
  const seriesByDay = new Map(days.map((item) => [item.key, item]));

  orders.forEach((order) => {
    const key = order.createdAt.slice(0, 10);
    const target = seriesByDay.get(key);

    if (!target) {
      return;
    }

    target.sales += order.total;
    target.orders += 1;
  });

  return days;
}

export function SalesChart({ orders, branchLabel = "Semua Branch" }: SalesChartProps) {
  const series = createSeries(orders);

  return (
    <Card className="h-full bg-cafe-surface/95">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Laporan Penjualan</p>
          <h3 className="mt-1 text-lg font-semibold text-cafe-text">Tren penjualan 7 hari terakhir</h3>
        </div>
        <div className="rounded-lg border border-cafe-line bg-cafe-secondary/25 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cafe-accent/72 shadow-sm">
          {branchLabel}
        </div>
      </div>
      <div className="h-[240px] sm:h-[300px] lg:h-[320px]">
        <Line
          data={{
            labels: series.map((item) => item.label),
            datasets: [
              {
                label: "Gross Sales",
                data: series.map((item) => item.sales),
                borderColor: "#8b6f47",
                backgroundColor: "rgba(200,162,124,0.16)",
                fill: true,
                tension: 0.35,
                yAxisID: "currency",
              },
              {
                label: "Orders",
                data: series.map((item) => item.orders),
                borderColor: "#c8a27c",
                backgroundColor: "rgba(232,216,196,0.22)",
                fill: false,
                tension: 0.35,
                yAxisID: "count",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  usePointStyle: true,
                  color: "#6d5a45",
                },
              },
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "#7d6a55",
                },
              },
              currency: {
                type: "linear",
                position: "left",
                ticks: {
                  callback: (value) => formatCompactNumber(Number(value)),
                  color: "#7d6a55",
                },
                grid: {
                  color: "rgba(200,162,124,0.18)",
                },
              },
              count: {
                type: "linear",
                position: "right",
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: "#9b8669",
                },
                grid: {
                  drawOnChartArea: false,
                },
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
