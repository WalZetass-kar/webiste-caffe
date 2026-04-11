import { NextResponse } from "next/server";
import { getAuditLogs } from "@/lib/server/audit-log-store";

export const runtime = "nodejs";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || undefined;
    const action = searchParams.get("action") || undefined;
    const entity = searchParams.get("entity") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;
    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined;

    const logs = await getAuditLogs({
      userId,
      action,
      entity,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengambil audit logs.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
