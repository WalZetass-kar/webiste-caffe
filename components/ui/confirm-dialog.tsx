"use client";

import { Modal } from "./modal";
import { Button } from "./button";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Hapus",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal open={open} title={title} onClose={onCancel} className="sm:max-w-md">
      <div className="space-y-5">
        <p className="text-sm leading-relaxed text-cafe-accent/80">{message}</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={onCancel} disabled={loading} className="sm:w-auto">
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} disabled={loading} className="bg-red-600 hover:bg-red-700 sm:w-auto">
            {loading ? "Menghapus..." : confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
