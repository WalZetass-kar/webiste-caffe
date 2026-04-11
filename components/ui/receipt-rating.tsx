"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { requestJson } from "@/lib/client-api";
import { StarRating } from "@/components/ui/star-rating";
import type { RatingRecord } from "@/lib/models";

type ReceiptRatingProps = {
  orderId: string;
  orderCode: string;
  customerName: string;
  tableNumber: string;
  orderStatus: string;
  existingRating?: RatingRecord | null;
};

export function ReceiptRating({
  orderId,
  orderCode,
  customerName,
  tableNumber,
  orderStatus,
  existingRating,
}: ReceiptRatingProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [savedRating, setSavedRating] = useState<RatingRecord | null>(existingRating ?? null);

  const averageRating = savedRating
    ? Number(((savedRating.serviceRating + savedRating.foodRating) / 2).toFixed(1))
    : null;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const payload = await requestJson<RatingRecord>("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName,
          serviceRating: rating,
          foodRating: rating,
          comment: comment.trim(),
          orderId,
          tableNumber,
        }),
      });

      setSavedRating(payload);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim rating.");
    } finally {
      setSubmitting(false);
    }
  };

  if (savedRating) {
    return (
      <Card className="space-y-4 bg-white p-6 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.26em] text-cafe-accent/60">Customer Review</p>
            <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Thank you for your feedback</h2>
          </div>
          <div className="rounded-full bg-[#fef5e9] px-4 py-2 text-sm font-semibold text-[#b27a36]">
            {averageRating} ⭐
          </div>
        </div>
        <div className="rounded-[28px] border border-[#efe1d1] bg-[#fffaf5] p-5">
          <p className="text-sm text-cafe-accent/80">Order ID</p>
          <p className="mt-2 font-semibold text-cafe-text">{orderCode}</p>
          <p className="mt-2 text-sm text-cafe-accent/80">Table</p>
          <p className="mt-1 font-semibold text-cafe-text">{tableNumber}</p>
        </div>
        <div className="space-y-3 rounded-[28px] border border-[#efe1d1] bg-white p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cafe-accent/60">Overall score</p>
              <p className="mt-2 text-lg font-semibold text-cafe-text">{averageRating} / 5</p>
            </div>
            <div className="text-amber-400">
              {Array.from({ length: 5 }, (_, index) => (
                <span key={index}>{index < Math.round(averageRating ?? 0) ? "★" : "☆"}</span>
              ))}
            </div>
          </div>
          <p className="text-sm leading-7 text-cafe-accent/78">{savedRating.comment || "Pelanggan tidak menambahkan komentar tambahan."}</p>
        </div>
      </Card>
    );
  }

  if (orderStatus !== "Selesai") {
    return (
      <Card className="space-y-4 bg-white p-6 shadow-soft">
        <div>
          <p className="text-xs uppercase tracking-[0.26em] text-cafe-accent/60">Rating tersedia setelah pesanan selesai</p>
          <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Berikan ulasan setelah order selesai</h2>
        </div>
        <p className="text-sm leading-7 text-cafe-accent/80">
          Order kamu saat ini berstatus <span className="font-semibold text-cafe-text">{orderStatus}</span>. Silakan kembali ke halaman ini ketika pesanan sudah selesai untuk membagikan rating pengalaman.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-6 bg-white p-6 shadow-soft">
      <div>
        <p className="text-xs uppercase tracking-[0.26em] text-cafe-accent/60">Customer Rating</p>
        <h2 className="mt-2 text-2xl font-semibold text-cafe-text">How was your experience?</h2>
        <p className="mt-2 text-sm leading-7 text-cafe-accent/80">
          Beri rating 1 sampai 5 bintang, lalu tuliskan komentar singkat bila ingin.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <StarRating value={rating} onChange={setRating} label="Your rating" />
        </div>
        <div className="space-y-2">
          <label htmlFor="reviewComment" className="text-sm font-medium text-cafe-text">
            Review comment (opsional)
          </label>
          <Textarea
            id="reviewComment"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Great coffee and fast service!"
            className="min-h-[120px]"
          />
        </div>
        {error ? (
          <p className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        ) : null}
        {success ? (
          <p className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Terima kasih! Rating Anda telah tersimpan.
          </p>
        ) : null}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" disabled={submitting} className="flex-1">
            {submitting ? "Menyimpan..." : "Submit Review"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
