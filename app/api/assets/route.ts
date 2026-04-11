import { NextResponse } from "next/server";
import { createAssetItem, getAssetItems } from "@/lib/server/data-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await getAssetItems();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const item = await createAssetItem(payload);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal menambahkan aset.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
