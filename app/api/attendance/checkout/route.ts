import { NextResponse } from "next/server";
import { checkOutEmployee } from "@/lib/server/attendance-store";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const item = await checkOutEmployee(payload);

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan check out.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
