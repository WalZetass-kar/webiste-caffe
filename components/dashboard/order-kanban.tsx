"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ToastContainer, useToast } from "@/components/ui/toast-notification";
import { useOrderNotifications } from "@/hooks/use-order-notifications";
import type { OrderRecord } from "@/lib/models";
import { cn } from "@/lib/utils";

const columns = ["Pramusaji", "Dapur", "Siap Antar", "Selesai"] as const;

type OrderKanbanProps = {
  orders: OrderRecord[];
};

function getTone(status: (typeof columns)[number]) {
  if (status === "Selesai") {
    return "green";
  }

  if (status === "Dapur") {
    return "cream";
  }

  if (status === "Siap Antar") {
    return "blue";
  }

  return "slate";
}

export function OrderKanban({ orders }: OrderKanbanProps) {
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());
  const { toasts, addToast, removeToast } = useToast();

  // Real-time order notifications
  useOrderNotifications({
    orders,
    onNewOrder: (order) => {
      // Add to new orders set
      setNewOrderIds((prev) => new Set([...prev, order.id]));

      // Show toast notification
      addToast(
        "Pesanan Baru Masuk",
        `${order.tableNumber} - ${order.customerName}`,
        "success",
        5000
      );

      // Remove highlight after 10 seconds
      setTimeout(() => {
        setNewOrderIds((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }, 10000);
    },
  });

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      <Card className="starbucks-card space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#00704A]">
              Manajemen Pesanan
            </p>
            <h3 className="mt-1 text-xl font-bold text-[#1E3932]">
              Antrian order live per status
            </h3>
          </div>
          <div className="flex items-center gap-2 text-sm text-[#6B5D52]">
            <span>Total:</span>
            <span className="font-semibold text-[#1E3932]">{orders.length}</span>
          </div>
        </div>

        {/* Responsive Grid Layout */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => {
            const columnOrders = orders.filter((item) => item.status === column);
            const count = columnOrders.length;

            return (
              <div
                key={column}
                className="flex flex-col rounded-2xl border border-[#D4C5B9]/40 bg-gradient-to-b from-white to-[#F7F5F2] shadow-sm transition-all duration-300 hover:shadow-md"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between gap-2 border-b border-[#D4C5B9]/30 bg-white/80 px-4 py-3 rounded-t-2xl">
                  <h4 className="text-sm font-semibold text-[#1E3932] truncate flex-1">
                    {column}
                  </h4>
                  <Badge tone={getTone(column)} className="flex-shrink-0">
                    {count}
                  </Badge>
                </div>

                {/* Column Content */}
                <div className="flex-1 overflow-hidden">
                  {count === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#E8DDD3]">
                        <span className="text-sm font-semibold text-[#1E3932]/50">{column.charAt(0)}</span>
                      </div>
                      <p className="text-sm text-[#9B8B7E]">Tidak ada pesanan</p>
                    </div>
                  ) : (
                    // Orders List with Smooth Scroll
                    <div className="space-y-3 p-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                      {columnOrders.map((item) => {
                        const isNew = newOrderIds.has(item.id);
                        const totalItems = item.items.reduce(
                          (sum, orderItem) => sum + orderItem.quantity,
                          0
                        );

                        return (
                          <div
                            key={item.id}
                            className={cn(
                              "group relative rounded-2xl border bg-white p-4 shadow-sm transition-all duration-300",
                              "hover:shadow-md hover:-translate-y-0.5",
                              isNew
                                ? "border-[#00A862] bg-[#00A862]/5 ring-2 ring-[#00A862]/20"
                                : "border-[#D4C5B9]/30"
                            )}
                          >
                            {/* New Order Badge */}
                            {isNew && (
                              <div className="absolute -top-2 -right-2 z-10">
                                <span className="relative inline-flex items-center gap-1 rounded-full bg-[#00A862] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00A862] opacity-75"></span>
                                  <span className="relative">BARU</span>
                                </span>
                              </div>
                            )}

                            <div className="space-y-3">
                              {/* Table Number & Order Code */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                  <p className="font-bold text-[#1E3932] text-lg truncate">
                                    {item.tableNumber}
                                  </p>
                                  <p className="text-sm text-[#6B5D52] truncate font-medium mt-1">
                                    {item.customerName}
                                  </p>
                                </div>
                                <span className="font-mono text-xs text-[#6B5D52] bg-[#E8DDD3] px-2 py-1 rounded-lg flex-shrink-0 whitespace-nowrap">
                                  {item.orderCode}
                                </span>
                              </div>

                              {/* Branch Name */}
                              <div className="text-xs text-[#9B8B7E] truncate">
                                {item.branchName}
                              </div>

                              {/* Order Items Preview */}
                              {item.items.length > 0 && (
                                <div className="pt-3 border-t border-[#D4C5B9]/20">
                                  <p className="text-xs font-semibold text-[#00704A] mb-2 uppercase tracking-wider">
                                    Item Pesanan
                                  </p>
                                  <div className="space-y-1.5">
                                    {item.items.slice(0, 2).map((orderItem, idx) => (
                                      <div
                                        key={idx}
                                        className="flex items-start justify-between gap-2 text-sm"
                                      >
                                        <span className="text-[#6B5D52] flex-1 leading-snug">
                                          {orderItem.quantity}x {orderItem.menuName}
                                        </span>
                                      </div>
                                    ))}
                                    {item.items.length > 2 && (
                                      <p className="text-xs text-[#9B8B7E] italic">
                                        +{item.items.length - 2} item lainnya
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Footer Info */}
                              <div className="flex items-center justify-between pt-3 border-t border-[#D4C5B9]/20">
                                <span className="text-xs font-medium text-[#00704A]">
                                  {totalItems} items
                                </span>
                                <span className="text-xs text-[#9B8B7E]">
                                  {new Date(item.createdAt).toLocaleTimeString("id-ID", {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </span>
                              </div>

                              {/* Notes if any */}
                              {item.notes && (
                                <div className="pt-3 border-t border-[#D4C5B9]/20">
                                  <p className="text-xs font-semibold text-[#00704A] mb-1 uppercase tracking-wider">
                                    Catatan
                                  </p>
                                  <p className="text-xs text-[#6B5D52] line-clamp-2 break-words leading-relaxed">
                                    {item.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Scrollbar Styles */}
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
    </>
  );
}
