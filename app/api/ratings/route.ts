import { NextResponse } from "next/server";
import { createRating, getRatings } from "@/lib/server/data-store";

export const runtime = "nodejs";

export async function GET() {
  const ratings = await getRatings();

  return NextResponse.json(ratings);
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const rating = await createRating(payload);

    return NextResponse.json(rating, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Gagal mengirim penilaian.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}

