import type { OrderRecord } from "@/lib/models";

export type OrderFilterParams = {
  from?: string | null;
  to?: string | null;
  branchId?: string | null;
};

type OrderFinancialItem = {
  quantity: number;
  unitPrice: number;
};

function startOfDay(value: string) {
  return new Date(`${value}T00:00:00`).getTime();
}

function endOfDay(value: string) {
  return new Date(`${value}T23:59:59.999`).getTime();
}

export function calculateOrderTotals(items: OrderFinancialItem[], serviceFeeAmount = 6000) {
  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
  const serviceFee = subtotal > 0 ? serviceFeeAmount : 0;

  return {
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
}

export function filterOrdersByParams(orders: OrderRecord[], params: OrderFilterParams) {
  const from = params.from?.trim();
  const to = params.to?.trim();
  const branchId = params.branchId?.trim();

  return orders.filter((order) => {
    const createdAt = new Date(order.createdAt).getTime();

    if (branchId && branchId !== "all" && order.branchId !== branchId) {
      return false;
    }

    if (from && createdAt < startOfDay(from)) {
      return false;
    }

    if (to && createdAt > endOfDay(to)) {
      return false;
    }

    return true;
  });
}

export function getTopMenuSummary(orders: OrderRecord[]) {
  const counts = new Map<string, { menuName: string; quantity: number; revenue: number }>();

  for (const order of orders) {
    for (const item of order.items) {
      const current = counts.get(item.menuId);

      if (current) {
        current.quantity += item.quantity;
        current.revenue += item.quantity * item.unitPrice;
        continue;
      }

      counts.set(item.menuId, {
        menuName: item.menuName,
        quantity: item.quantity,
        revenue: item.quantity * item.unitPrice,
      });
    }
  }

  return [...counts.values()].sort((left, right) => right.quantity - left.quantity)[0] ?? null;
}

export function getBusyHourSummary(orders: OrderRecord[]) {
  const buckets = new Map<number, number>();

  for (const order of orders) {
    const hour = Number(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        hour12: false,
        timeZone: operationalTimeZone,
      }).format(new Date(order.createdAt)),
    );
    buckets.set(hour, (buckets.get(hour) ?? 0) + 1);
  }

  const [hour = 0, count = 0] = [...buckets.entries()].sort((left, right) => right[1] - left[1])[0] ?? [];

  return {
    hour,
    count,
    label: `${String(hour).padStart(2, "0")}:00 - ${String((hour + 1) % 24).padStart(2, "0")}:00`,
  };
}

export function getOperationalSummary(orders: OrderRecord[]) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageTransaction = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const topMenu = getTopMenuSummary(orders);
  const busyHour = getBusyHourSummary(orders);

  return {
    totalOrders,
    totalRevenue,
    averageTransaction,
    topMenu,
    busyHour,
  };
}
const operationalTimeZone = "Asia/Jakarta";
