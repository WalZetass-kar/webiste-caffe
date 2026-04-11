import { NextResponse } from "next/server";
import { getOrderByCode } from "@/lib/server/data-store";
import { buildReceiptPdf } from "@/lib/server/receipt-pdf";

export const runtime = "nodejs";

type ReceiptPdfRouteProps = {
  params: Promise<{ orderCode: string }>;
};

export async function GET(_: Request, { params }: ReceiptPdfRouteProps) {
  const { orderCode } = await params;
  const order = await getOrderByCode(decodeURIComponent(orderCode));

  if (!order) {
    return NextResponse.json({ error: "Receipt tidak ditemukan." }, { status: 404 });
  }

  const pdfBuffer = buildReceiptPdf(order);

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${order.orderCode}.pdf"`,
      "Cache-Control": "no-store",
    },
  });
}
