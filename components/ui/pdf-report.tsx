"use client";

import { Button } from "@/components/ui/button";

export function PdfReportButton() {
  return (
    <Button
      variant="glass"
      onClick={() => {
        window.print();
      }}
    >
      Cetak Laporan PDF
    </Button>
  );
}
