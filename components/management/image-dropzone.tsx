"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type ImageDropzoneProps = {
  label: string;
  description: string;
  initialImage?: string;
  onChange: (file: File | null) => void;
};

const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];

export function ImageDropzone({ label, description, initialImage, onChange }: ImageDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [objectUrl, setObjectUrl] = useState("");
  const preview = objectUrl || initialImage || "";

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  const handleFile = (file: File | null) => {
    if (!file) {
      return;
    }

    if (!acceptedTypes.includes(file.type)) {
      window.alert("Format gambar harus jpg, png, atau webp.");
      return;
    }

    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }

    const nextPreview = URL.createObjectURL(file);

    setObjectUrl(nextPreview);
    onChange(file);
  };

  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={inputId} className="text-sm font-medium text-cafe-text">
          {label}
        </label>
        <p className="mt-1 text-xs text-cafe-accent/72">{description}</p>
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        className="hidden"
        onChange={(event) => handleFile(event.target.files?.[0] ?? null)}
      />
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            inputRef.current?.click();
          }
        }}
        onDragEnter={() => setDragActive(true)}
        onDragLeave={() => setDragActive(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setDragActive(true);
        }}
        onDrop={(event) => {
          event.preventDefault();
          setDragActive(false);
          handleFile(event.dataTransfer.files?.[0] ?? null);
        }}
        className={`w-full rounded-xl border border-dashed px-4 py-5 text-left transition ${
          dragActive
            ? "border-cafe-accent bg-cafe-secondary/45"
            : "border-cafe-line bg-cafe-surface hover:bg-cafe-secondary/25"
        }`}
      >
        <div className="grid gap-4 md:grid-cols-[1fr_180px] md:items-center">
          <div>
            <p className="text-sm font-semibold text-cafe-text">Drag & drop gambar di sini</p>
            <p className="mt-2 text-sm leading-7 text-cafe-accent/78">
              Atau klik area ini untuk memilih file. Format yang didukung: jpg, png, webp.
            </p>
            <div className="mt-4">
              <Button variant="secondary" type="button">
                Pilih Gambar
              </Button>
            </div>
          </div>
          <div className="relative h-40 overflow-hidden rounded-xl border border-cafe-line bg-cafe-secondary/25">
            {preview ? (
              <Image src={preview} alt={label} fill sizes="180px" unoptimized className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-cafe-accent/60">
                Preview gambar
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
