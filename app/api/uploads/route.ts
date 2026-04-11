import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { slugify } from "@/lib/utils";

export const runtime = "nodejs";

const allowedBuckets = ["menus", "employees", "assets", "payments", "branding"] as const;
const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const bucket = formData.get("bucket");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File upload wajib diisi." }, { status: 400 });
    }

    if (typeof bucket !== "string" || !allowedBuckets.includes(bucket as (typeof allowedBuckets)[number])) {
      return NextResponse.json({ error: "Bucket upload tidak valid." }, { status: 400 });
    }

    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json({ error: "Format file harus jpg, png, atau webp." }, { status: 400 });
    }

    const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
    const fileName = `${slugify(file.name.replace(/\.[^.]+$/, "")) || "upload"}-${randomUUID().slice(0, 8)}.${extension}`;
    const relativePath = path.join("uploads", bucket, fileName);
    const absoluteDirectory = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "uploads", bucket);
    const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", relativePath);
    const bytes = Buffer.from(await file.arrayBuffer());

    await mkdir(absoluteDirectory, { recursive: true });
    await writeFile(absolutePath, bytes);

    return NextResponse.json({
      path: `/${relativePath.replace(/\\/g, "/")}`,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal mengunggah file." }, { status: 500 });
  }
}
