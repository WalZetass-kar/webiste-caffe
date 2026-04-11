"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  className?: string;
};

export function Modal({ open, title, children, onClose, className }: ModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#3a3a3a]/24 p-0 backdrop-blur-sm sm:p-4">
      <div className="flex min-h-full items-end justify-center sm:items-center">
        <div
          className={cn(
            "w-full max-h-[92vh] overflow-hidden rounded-t-xl border border-cafe-line bg-cafe-surface shadow-glass sm:max-h-[90vh] sm:max-w-2xl sm:rounded-xl",
            className,
          )}
        >
          <div className="max-h-[92vh] overflow-y-auto px-4 pb-4 pt-4 sm:max-h-[90vh] sm:px-6 sm:pb-6 sm:pt-6">
            <div className="sticky top-0 z-10 mb-4 flex items-start justify-between gap-3 bg-cafe-surface pb-4">
              <h3 className="text-lg font-semibold leading-snug text-cafe-text sm:text-xl">{title}</h3>
              <button
                onClick={onClose}
                className="shrink-0 rounded-lg border border-cafe-line bg-cafe-secondary/35 px-3 py-1 text-sm text-cafe-accent transition hover:bg-cafe-secondary/65"
              >
                Tutup
              </button>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
