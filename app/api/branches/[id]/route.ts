import { NextResponse } from "next/server";
import { deleteBranchItem, updateBranchItem } from "@/lib/server/branch-store";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const payload = await request.json();
    const { id } = await context.params;
    const item = await updateBranchItem(id, payload);

    return NextResponse.json(item);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal memperbarui cabang.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await deleteBranchItem(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menghapus cabang.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
