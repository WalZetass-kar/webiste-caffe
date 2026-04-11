import { NextResponse } from "next/server";
import { getCafeSettings, updateCafeSettings } from "@/lib/server/settings-store";

export async function GET() {
  const settings = await getCafeSettings();

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    const payload = await request.json();
    const settings = await updateCafeSettings(payload);

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui pengaturan cafe." },
      { status: 400 },
    );
  }
}
