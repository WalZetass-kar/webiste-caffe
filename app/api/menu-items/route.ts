import { NextResponse } from "next/server";
import { createMenuItem, getMenuItems } from "@/lib/server/data-store";
import { getAuditUser } from "@/lib/server/auth-helper";

export const runtime = "nodejs";

export async function GET() {
  const items = await getMenuItems();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const auditUser = await getAuditUser();
    const item = await createMenuItem(payload, auditUser);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan menu.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
