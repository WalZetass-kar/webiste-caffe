"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/models";
import { formatCurrency } from "@/lib/utils";

type TopSellingItemsProps = {
  orders: OrderRecord[];
};

type MenuSales = {
  menuName: string;
  quantity: number;
  revenue: number;
};

export function TopSellingItems({ orders }: TopSellingItemsProps) {
  const topItems = useMemo(() => {
    const salesMap = new Map<string, MenuSales>();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const existing = salesMap.get(item.menuName);
        if (existing) {
          existing.quantity += item.quantity;
          existing.revenue += item.unitPrice * item.quantity;
        } else {
          salesMap.set(item.menuName, {
            menuName: item.menuName,
            quantity: item.quantity,
            revenue: item.unitPrice * item.quantity,
          });
        }
      });
    });

    return Array.from(salesMap.values())
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [orders]);

  if (topItems.length === 0) {
    return null;
  }

  const maxQuantity = topItems[0]?.quantity ?? 1;

  return (
    <Card className="starbucks-card">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#6B5D52]">
          Best Sellers
        </p>
        <h3 className="mt-1 text-xl font-bold text-[#3d3027]">
          Menu terlaris periode ini
        </h3>
      </div>

      <div className="space-y-4">
        {topItems.map((item, index) => {
          const percentage = (item.quantity / maxQuantity) * 100;
          
          return (
            <div key={item.menuName} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#5a4a3a] font-bold text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#3d3027] truncate">
                      {item.menuName}
                    </p>
                    <p className="text-xs text-[#6B5D52]">
                      {item.quantity} terjual
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-[#5a4a3a]">
                    {formatCurrency(item.revenue)}
                  </p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#E8DDD3]">
                <div
                  className="h-full rounded-full bg-[#5a4a3a] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
