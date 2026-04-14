"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type RatingRecord = {
  id: string;
  customerName: string;
  serviceRating: number;
  foodRating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
};

type PenilaianClientProps = {
  initialRatings: RatingRecord[];
  mode?: "form" | "list";
};

type FormState = {
  customerName: string;
  serviceRating: string;
  foodRating: string;
  comment: string;
};

const initialFormState: FormState = {
  customerName: "",
  serviceRating: "5",
  foodRating: "5",
  comment: "",
};

function getRatingLabel(value: number) {
  if (value >= 5) return "Istimewa";
  if (value >= 4) return "Bagus";
  if (value >= 3) return "Cukup";
  if (value >= 2) return "Perlu perhatian";
  return "Kurang";
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function RatingPill({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[24px] border border-[#eadfce] bg-white/80 px-4 py-3 shadow-soft">
      <p className="text-[11px] uppercase tracking-[0.24em] text-cafe-accent/60">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-2xl font-semibold text-cafe-text">{value}/5</p>
        <span className="rounded-full bg-cafe-secondary/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cafe-accent whitespace-nowrap flex-shrink-0">
          {getRatingLabel(value)}
        </span>
      </div>
    </div>
  );
}

export function PenilaianClient({
  initialRatings,
  mode = "form",
}: PenilaianClientProps) {
  const [ratings, setRatings] = useState(initialRatings);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const averageScores = useMemo(() => {
    if (ratings.length === 0) {
      return { service: 0, food: 0 };
    }

    const totals = ratings.reduce(
      (acc, item) => {
        acc.service += item.serviceRating;
        acc.food += item.foodRating;
        return acc;
      },
      { service: 0, food: 0 },
    );

    return {
      service: Number((totals.service / ratings.length).toFixed(1)),
      food: Number((totals.food / ratings.length).toFixed(1)),
    };
  }, [ratings]);

  const handleChange = (field: keyof FormState, value: string) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          serviceRating: Number(form.serviceRating),
          foodRating: Number(form.foodRating),
          comment: form.comment.trim(),
        }),
      });

      const payload = (await response.json()) as {
        data?: RatingRecord;
        message?: string;
      };

      if (!response.ok || !payload.data) {
        setError(payload.message ?? "Penilaian gagal dikirim.");
        return;
      }

      setRatings((current) => [payload.data as RatingRecord, ...current]);
      setForm(initialFormState);
      setSuccessMessage("Terima kasih, masukan Anda berhasil dikirim.");
    } catch {
      setError("Terjadi kendala saat mengirim penilaian.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (mode === "list") {
    return (
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <RatingPill label="Rata-rata pelayanan" value={averageScores.service || 0} />
          <RatingPill label="Rata-rata makanan" value={averageScores.food || 0} />
        </div>

        {ratings.length === 0 ? (
          <Card className="bg-[#fffaf5]">
            <p className="text-sm leading-7 text-cafe-accent/80">
              Belum ada penilaian yang masuk. Jadilah pelanggan pertama yang memberikan masukan.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {ratings.map((rating) => (
              <Card key={rating.id} className="bg-[#fffaf5]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs uppercase tracking-[0.28em] text-cafe-accent/65 truncate">
                      {rating.customerName || "Pelanggan"}
                    </p>
                    <h3 className="mt-2 text-lg font-semibold text-cafe-text break-words">
                      Pelayanan {rating.serviceRating}/5 • Makanan {rating.foodRating}/5
                    </h3>
                  </div>
                  <span className="rounded-full bg-cafe-secondary/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-cafe-accent whitespace-nowrap flex-shrink-0">
                    {formatDate(rating.updatedAt)}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <RatingPill label="Pelayanan" value={rating.serviceRating} />
                  <RatingPill label="Makanan" value={rating.foodRating} />
                </div>
                <p className="mt-4 text-sm leading-7 text-cafe-text break-words">
                  {rating.comment || "Pelanggan tidak menambahkan komentar tambahan."}
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-6 space-y-5">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label htmlFor="customerName" className="text-sm font-medium text-cafe-text">
            Nama pelanggan
          </label>
          <Input
            id="customerName"
            value={form.customerName}
            onChange={(event) => handleChange("customerName", event.target.value)}
            placeholder="Contoh: Rina"
            maxLength={100}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="serviceRating" className="text-sm font-medium text-cafe-text">
              Rating pelayanan
            </label>
            <Input
              id="serviceRating"
              type="number"
              min={1}
              max={5}
              value={form.serviceRating}
              onChange={(event) => handleChange("serviceRating", event.target.value)}
            />
            <p className="text-xs text-cafe-accent/70">Gunakan skor 1 sampai 5.</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="foodRating" className="text-sm font-medium text-cafe-text">
              Rating makanan
            </label>
            <Input
              id="foodRating"
              type="number"
              min={1}
              max={5}
              value={form.foodRating}
              onChange={(event) => handleChange("foodRating", event.target.value)}
            />
            <p className="text-xs text-cafe-accent/70">Gunakan skor 1 sampai 5.</p>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="comment" className="text-sm font-medium text-cafe-text">
            Komentar
          </label>
          <Textarea
            id="comment"
            value={form.comment}
            onChange={(event) => handleChange("comment", event.target.value)}
            placeholder="Ceritakan pengalaman Anda selama berkunjung."
            maxLength={500}
          />
          <p className="text-xs text-cafe-accent/70">Komentar bersifat opsional.</p>
        </div>

        {error ? (
          <div className="rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {successMessage ? (
          <div className="rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        ) : null}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Mengirim..." : "Kirim penilaian"}
        </Button>
      </form>
    </div>
  );
}