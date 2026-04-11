import { NextResponse } from "next/server";
import {
  getPaymentSettings,
  updatePaymentSettings,
} from "@/lib/server/payment-settings-store";

export const runtime = "nodejs";

export async function GET() {
  const settings = await getPaymentSettings();

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const settings = await updatePaymentSettings(payload);

    return NextResponse.json(settings);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memperbarui pengaturan pembayaran.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
