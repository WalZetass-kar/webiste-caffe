"use client";

import { useState } from "react";
import Link from "next/link";
import { useToast } from "@/components/providers/toast-provider";
import { Button, buttonStyles } from "@/components/ui/button";

type ReceiptActionsProps = {
  orderCode: string;
};

export function ReceiptActions({ orderCode }: ReceiptActionsProps) {
  const [copied, setCopied] = useState(false);
  const { pushToast } = useToast();
  const pdfUrl = `/api/receipts/${encodeURIComponent(orderCode)}/pdf`;

  const shareReceipt = async () => {
    const shareUrl = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: `Receipt ${orderCode}`,
        text: `Receipt digital untuk pesanan ${orderCode}`,
        url: shareUrl,
      });
      pushToast({
        title: "Receipt siap dibagikan",
        description: `Link receipt ${orderCode} berhasil dibuka ke dialog share perangkat.`,
        tone: "success",
      });

      return;
    }

    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    pushToast({
      title: "Link receipt disalin",
      description: `Link receipt ${orderCode} sudah ada di clipboard.`,
      tone: "info",
    });
    window.setTimeout(() => setCopied(false), 2000);
  };

  const sendInvoice = () => {
    const shareUrl = window.location.href;
    const subject = encodeURIComponent(`Invoice ${orderCode} dari Cafe`);
    const body = encodeURIComponent(`Halo,\n\nBerikut link receipt untuk pesanan ${orderCode}:\n${shareUrl}\n\nTerima kasih.`);

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
    pushToast({
      title: "Draft invoice dibuka",
      description: "Aplikasi email akan dibuka dengan template invoice dan link receipt.",
      tone: "info",
    });
  };

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
      <Link href={pdfUrl} target="_blank" rel="noreferrer" className={buttonStyles("primary")}>
        Download PDF
      </Link>
      <Button
        variant="secondary"
        onClick={() => {
          window.print();
          pushToast({
            title: "Mode cetak dibuka",
            description: `Receipt ${orderCode} siap dicetak.`,
            tone: "info",
          });
        }}
      >
        Print Receipt
      </Button>
      <Button variant="ghost" onClick={() => void shareReceipt()}>
        {copied ? "Link copied" : "Share Receipt"}
      </Button>
      <Button variant="glass" onClick={sendInvoice}>
        Send Invoice
      </Button>
    </div>
  );
}
