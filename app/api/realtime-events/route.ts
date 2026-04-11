import { NextResponse } from "next/server";
import { getRealtimeEvents } from "@/lib/server/realtime-events-store";

export async function GET() {
  const events = await getRealtimeEvents();

  return NextResponse.json(events);
}
