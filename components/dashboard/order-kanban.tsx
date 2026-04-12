import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { OrderRecord } from "@/lib/models";

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
  return (
    <Card className="space-y-5 bg-[#9F8B6C]/10 border-[#9F8B6C]/30">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#6B5D4F]">Manajemen Pesanan</p>
        <h3 className="mt-1 text-xl font-semibold text-[#3D3428]">Antrian order live per status</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div key={column} className="rounded-xl border border-[#9F8B6C]/30 bg-[#F5EFE7] p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-[#3D3428]">{column}</h4>
              <Badge tone={getTone(column)}>{orders.filter((item) => item.status === column).length}</Badge>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {orders
                .filter((item) => item.status === column)
                .slice(0, 8)
                .map((item) => (
                  <div key={item.id} className="rounded-xl border border-[#9F8B6C]/20 bg-white p-3 shadow-sm transition-all duration-200 hover:bg-[#FFF9F0] hover:shadow-md">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-[#3D3428] text-base">{item.tableNumber}</p>
                        <span className="font-mono text-xs text-[#6B5D4F] bg-[#F5EFE7] px-2 py-1 rounded">{item.orderCode}</span>
                      </div>
                      <p className="text-sm text-[#6B5D4F] truncate">{item.customerName}</p>
                      <p className="text-xs text-[#8B7D6F] truncate">{item.branchName}</p>
                      <div className="flex items-center justify-between pt-1 border-t border-[#9F8B6C]/10">
                        <span className="text-xs text-[#8B7D6F]">{item.items.reduce((sum, orderItem) => sum + orderItem.quantity, 0)} items</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
