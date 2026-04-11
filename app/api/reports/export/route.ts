import { NextResponse } from "next/server";
import { filterOrdersByParams } from "@/lib/services/order";
import { getOrders } from "@/lib/server/data-store";
import { formatCurrency } from "@/lib/utils";

function getSingleValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

function escapeCsv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "excel" ? "excel" : "csv";
  const orders = await getOrders();
  const filteredOrders = filterOrdersByParams(orders, {
    from: getSingleValue(searchParams.get("from") ?? undefined) ?? "",
    to: getSingleValue(searchParams.get("to") ?? undefined) ?? "",
    branchId: getSingleValue(searchParams.get("branch") ?? undefined) ?? "all",
  });

  if (format === "excel") {
    const rows = filteredOrders
      .map(
        (order) => `
          <tr>
            <td>${order.orderCode}</td>
            <td>${order.customerName}</td>
            <td>${order.branchName}</td>
            <td>${order.paymentMethod}</td>
            <td>${formatCurrency(order.total)}</td>
            <td>${new Date(order.createdAt).toLocaleString("id-ID")}</td>
          </tr>`,
      )
      .join("");

    const html = `
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Branch</th>
            <th>Payment</th>
            <th>Total</th>
            <th>Waktu</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "application/vnd.ms-excel; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cafeflow-report.xls"',
      },
    });
  }

  const header = ["Order", "Customer", "Branch", "Payment", "Total", "Waktu"];
  const rows = filteredOrders.map((order) =>
    [
      escapeCsv(order.orderCode),
      escapeCsv(order.customerName),
      escapeCsv(order.branchName),
      escapeCsv(order.paymentMethod),
      escapeCsv(String(order.total)),
      escapeCsv(new Date(order.createdAt).toLocaleString("id-ID")),
    ].join(","),
  );

  return new NextResponse([header.join(","), ...rows].join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="cafeflow-report.csv"',
    },
  });
}
