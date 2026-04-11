import { NextResponse } from "next/server";
import { deleteSupplyItem, updateSupplyItem } from "@/lib/server/data-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const item = await updateSupplyItem(id, payload);

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui bahan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteSupplyItem(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus bahan.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
