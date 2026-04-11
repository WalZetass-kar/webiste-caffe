"use client";

import * as React from "react";
import Image from "next/image";
import Compressor from "compressorjs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ImageUpload() {
  const [preview, setPreview] = React.useState<string | null>(null);

  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-cafe-text">Upload Gambar Menu</h3>
        <p className="text-xs text-cafe-accent/70">Kompresi otomatis dengan CompressorJS untuk preview ringan.</p>
      </div>
      <label className="block">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (!file) {
              return;
            }

            new Compressor(file, {
              quality: 0.7,
              success(result) {
                setPreview(URL.createObjectURL(result));
              },
            });
          }}
        />
        <Button variant="glass" className="w-full">
          Upload Gambar
        </Button>
      </label>
      <div className="relative h-48 overflow-hidden rounded-xl border border-cafe-line bg-cafe-surface shadow-sm">
        {preview ? (
          <Image src={preview} alt="Preview gambar menu" fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center bg-cafe-secondary/25 text-sm text-cafe-accent/60">
            Preview gambar akan tampil di sini
          </div>
        )}
      </div>
    </Card>
  );
}
