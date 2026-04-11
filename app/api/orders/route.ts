import { NextResponse } from "next/server";
import { createOrder, getOrders } from "@/lib/server/data-store";

export const runtime = "nodejs";

export async function GET() {
  const orders = await getOrders();

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const order = await createOrder(payload);

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal membuat pesanan.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
