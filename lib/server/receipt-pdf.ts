import "server-only";

import type { OrderRecord } from "@/lib/models";
import { formatCurrency, formatDateTime, stripPaymentMethodFromNotes } from "@/lib/utils";

function escapePdfText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/[^\x20-\x7E]/g, "?");
}

function normalizeLine(value: string) {
  return escapePdfText(value.replace(/\u00A0/g, " "));
}

export function buildReceiptPdf(order: OrderRecord) {
  const cleanNotes = stripPaymentMethodFromNotes(order.notes);
  const lines = [
    "CafeFlow Digital Receipt",
    "",
    `Order ID: ${order.orderCode}`,
    `Branch: ${order.branchName || "-"}`,
    `Customer: ${order.customerName || "-"}`,
    `Table: ${order.tableNumber || "-"}`,
    `Payment: ${order.paymentMethod}`,
    `Date: ${formatDateTime(order.createdAt).replace(/\u00A0/g, " ")}`,
    "",
    "Items",
    ...order.items.map((item) => {
      const itemTotal = formatCurrency(item.quantity * item.unitPrice).replace(/\u00A0/g, " ");
      const itemPrice = formatCurrency(item.unitPrice).replace(/\u00A0/g, " ");

      return `- ${item.menuName} x${item.quantity} @ ${itemPrice} = ${itemTotal}`;
    }),
    "",
    `Subtotal: ${formatCurrency(order.subtotal).replace(/\u00A0/g, " ")}`,
    `Service Fee: ${formatCurrency(order.serviceFee).replace(/\u00A0/g, " ")}`,
    `Total: ${formatCurrency(order.total).replace(/\u00A0/g, " ")}`,
    ...(cleanNotes ? ["", `Notes: ${cleanNotes}`] : []),
  ];

  const content = [
    "BT",
    "/F1 12 Tf",
    "48 790 Td",
    ...lines.flatMap((line, index) => (index === 0 ? [`(${normalizeLine(line)}) Tj`] : ["0 -18 Td", `(${normalizeLine(line)}) Tj`])),
    "ET",
  ].join("\n");

  const objects = [
    "1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n",
    "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n",
    "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n",
    `4 0 obj\n<< /Length ${Buffer.byteLength(content, "utf8")} >>\nstream\n${content}\nendstream\nendobj\n`,
    "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += object;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");

  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return Buffer.from(pdf, "utf8");
}
