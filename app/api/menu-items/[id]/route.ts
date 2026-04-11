import { NextResponse } from "next/server";
import { deleteMenuItem, updateMenuItem } from "@/lib/server/data-store";
import { getAuditUser } from "@/lib/server/auth-helper";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const auditUser = await getAuditUser();
    const item = await updateMenuItem(id, payload, auditUser);

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui menu.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const auditUser = await getAuditUser();
    await deleteMenuItem(id, auditUser);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus menu.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
