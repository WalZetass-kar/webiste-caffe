import { NextResponse } from "next/server";
import { createEmployeeItem, getEmployeeItems } from "@/lib/server/data-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await getEmployeeItems();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const item = await createEmployeeItem(payload);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan karyawan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
