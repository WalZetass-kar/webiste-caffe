import { NextResponse } from "next/server";
import { getEmployeeItems, getMenuItems, getOrders } from "@/lib/server/data-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (query.length < 2) {
    return NextResponse.json([]);
  }

  const [menus, orders, employees] = await Promise.all([getMenuItems(), getOrders(), getEmployeeItems()]);

  const menuResults = menus
    .filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query),
    )
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      type: "menu" as const,
      title: item.name,
      subtitle: item.category,
      meta: "Menu",
      href: `/order/${item.slug}`,
    }));

  const orderResults = orders
    .filter(
      (item) =>
        item.orderCode.toLowerCase().includes(query) || item.customerName.toLowerCase().includes(query),
    )
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      type: "order" as const,
      title: item.orderCode,
      subtitle: `${item.customerName} • ${item.branchName}`,
      meta: "Order",
      href: `/receipt/${encodeURIComponent(item.orderCode)}`,
    }));

  const staffResults = employees
    .filter(
      (item) =>
        item.employeeName.toLowerCase().includes(query) || item.position.toLowerCase().includes(query),
    )
    .slice(0, 4)
    .map((item) => ({
      id: item.id,
      type: "staff" as const,
      title: item.employeeName,
      subtitle: `${item.position} • ${item.branchName}`,
      meta: "Staff",
      href: `/staff?employee=${encodeURIComponent(item.id)}`,
    }));

  return NextResponse.json([...menuResults, ...orderResults, ...staffResults]);
}
