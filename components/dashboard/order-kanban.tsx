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
    <Card className="space-y-5 bg-cafe-surface/95">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Manajemen Pesanan</p>
        <h3 className="mt-1 text-xl font-semibold text-cafe-text">Antrian order live per status</h3>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {columns.map((column) => (
          <div key={column} className="rounded-xl border border-cafe-line bg-cafe-secondary/22 p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-cafe-text">{column}</h4>
              <Badge tone={getTone(column)}>{orders.filter((item) => item.status === column).length}</Badge>
            </div>
            <div className="space-y-3">
              {orders
                .filter((item) => item.status === column)
                .slice(0, 4)
                .map((item) => (
                  <div key={item.id} className="rounded-xl border border-cafe-line/70 bg-cafe-surface p-3 shadow-sm transition-colors hover:bg-[#f8f1e8]">
                    <p className="font-medium text-cafe-text">{item.tableNumber}</p>
                    <p className="mt-1 text-sm text-cafe-accent/80">{item.customerName}</p>
                    <p className="mt-1 text-xs text-cafe-accent/65">{item.branchName}</p>
                    <div className="mt-2 flex items-center justify-between text-xs text-cafe-accent/65">
                      <span>{item.items.reduce((sum, orderItem) => sum + orderItem.quantity, 0)} item</span>
                      <span className="font-mono">{item.orderCode}</span>
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
