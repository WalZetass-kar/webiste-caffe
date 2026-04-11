import { NextResponse } from "next/server";
import { createBranchItem, getBranchItems } from "@/lib/server/branch-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await getBranchItems();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const item = await createBranchItem(payload);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan cabang.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
