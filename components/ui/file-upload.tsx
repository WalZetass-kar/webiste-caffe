"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type FileUploadProps = {
  label: string;
  accept?: string;
};

export function FileUpload({ label, accept }: FileUploadProps) {
  const [fileName, setFileName] = React.useState("Belum ada file dipilih");

  return (
    <Card className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-cafe-text">{label}</p>
        <p className="text-xs text-cafe-accent/70">Upload dokumen penting dalam format aman.</p>
      </div>
      <label className="block">
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setFileName(file?.name ?? "Belum ada file dipilih");
          }}
        />
        <Button variant="glass" className="w-full" type="button">
          Pilih File
        </Button>
      </label>
      <div className="rounded-lg border border-dashed border-cafe-line bg-cafe-secondary/25 px-4 py-3 text-xs text-cafe-accent/80">
        {fileName}
      </div>
    </Card>
  );
}
