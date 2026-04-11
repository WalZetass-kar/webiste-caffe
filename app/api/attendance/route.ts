import { NextResponse } from "next/server";
import { checkInEmployee, getAttendanceRecords } from "@/lib/server/attendance-store";

export const runtime = "nodejs";

export async function GET() {
  const items = await getAttendanceRecords();

  return NextResponse.json(items);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const item = await checkInEmployee(payload);

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal melakukan check in.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
