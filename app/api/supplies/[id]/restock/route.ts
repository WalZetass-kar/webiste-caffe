import { NextResponse } from "next/server";
import { restockSupplyItem } from "@/lib/server/data-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const item = await restockSupplyItem(id, payload.quantity, payload.note);

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan restock.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
