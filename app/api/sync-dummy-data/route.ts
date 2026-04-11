import { NextResponse } from "next/server";
import { syncDummyData } from "@/lib/server/dummy-seeder";

export async function POST() {
  try {
    const result = await syncDummyData();

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal sinkron dummy data." },
      { status: 500 },
    );
  }
}
