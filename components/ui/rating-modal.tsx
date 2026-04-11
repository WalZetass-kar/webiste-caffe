"use client";

import { useState, type FormEvent } from "react";
import { Button } from "./button";
import { Card } from "./card";
import { Modal } from "./modal";
import { Textarea } from "./textarea";
import { requestJson } from "@/lib/client-api";
import type { RatingPayload } from "@/lib/models";
import { formatRatingLabel } from "@/lib/utils";
import { StarRating } from "./star-rating";


type RatingModalProps = {
  orderId: string;
  orderCode: string;
  customerName: string;
  tableNumber?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export function RatingModal({
  orderId,
  orderCode,
  customerName,
  tableNumber,
  isOpen,
  onClose,
  onSuccess,
}: RatingModalProps) {
  const [form, setForm] = useState<RatingPayload>({
    customerName,
    serviceRating: 5,
    foodRating: 5,
    comment: "",
    orderId,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      await requestJson("/api/ratings", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          tableNumber,
        }),
      });
      setSuccess(true);
      onSuccess();
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRatingChange = (type: "service" | "food", value: number) => {
    setForm({ ...form, [type + "Rating"]: value });
  };

  if (success) {
    return (
      <Modal open={isOpen} title="Rating berhasil" onClose={onClose}>
        <Card className="text-center p-8">
          <h3 className="text-2xl font-bold mb-4">Terima kasih!</h3>
          <p>Rating untuk {orderCode} berhasil dikirim.</p>
        </Card>
      </Modal>
    );
  }

  return (
    <Modal open={isOpen} title={`Rate order ${orderCode}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <p className="text-sm text-muted-foreground mb-4">How was your experience for order {orderCode}?</p>

          <div className="grid gap-6 mb-6 sm:grid-cols-2">
            <div>
              <StarRating value={form.serviceRating} onChange={(next) => handleRatingChange("service", next)} label="Service" />
              <p className="mt-2 text-xs text-cafe-accent/72">{formatRatingLabel(form.serviceRating)}</p>
            </div>
            <div>
              <StarRating value={form.foodRating} onChange={(next) => handleRatingChange("food", next)} label="Food & Drink" />
              <p className="mt-2 text-xs text-cafe-accent/72">{formatRatingLabel(form.foodRating)}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Komentar (opsional)</label>
            <Textarea
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="Great coffee and fast service!"
              className="min-h-[100px]"
            />
          </div>
        </div>

        {error && <p className="text-sm text-destructive p-3 rounded-md bg-destructive/10 border border-destructive/20">{error}</p>}

        <div className="flex gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Skip
          </Button>
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Mengirim..." : "Kirim Rating"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

