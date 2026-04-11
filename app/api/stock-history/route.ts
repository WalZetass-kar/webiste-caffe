import { NextResponse } from "next/server";
import { getStockHistory } from "@/lib/server/data-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limitValue = searchParams.get("limit");
  const limit = limitValue ? Number(limitValue) : undefined;
  const history = await getStockHistory(Number.isFinite(limit) ? limit : undefined);

  return NextResponse.json(history);
}
