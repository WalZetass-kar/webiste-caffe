import { Card } from "@/components/ui/card";
import type { RatingRecord } from "@/lib/models";

type CustomerReviewsProps = {
  ratings: RatingRecord[];
};

function renderStars(score: number) {
  const rounded = Math.round(score);

  return (
    <div className="flex items-center gap-1 text-amber-400">
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index}>{index < rounded ? "*" : "."}</span>
      ))}
    </div>
  );
}

export function CustomerReviews({ ratings }: CustomerReviewsProps) {
  const averageRating = ratings.length
    ? Number(
        (
          ratings.reduce((sum, rating) => sum + (rating.serviceRating + rating.foodRating) / 2, 0) /
          ratings.length
        ).toFixed(1),
      )
    : 0;

  return (
    <section className="space-y-6">
      <div className="grid gap-4 md:grid-cols-[1.25fr_0.75fr]">
        <Card className="bg-[#F5EFE7] border-[#9F8B6C]/30">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6B5D4F]">Customer Reviews</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#3D3428]">Review pelanggan terbaru</h2>
          <p className="mt-4 text-sm leading-7 text-[#6B5D4F]">
            Semua penilaian pelanggan tersimpan bersama nomor meja dan order ID. Gunakan ini untuk memantau kepuasan layanan.
          </p>
        </Card>
        <Card className="bg-[#F5EFE7] border-[#9F8B6C]/30">
          <p className="text-xs uppercase tracking-[0.24em] text-[#6B5D4F]">Average rating</p>
          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="text-5xl font-semibold text-[#3D3428]">{averageRating}</p>
              <p className="text-sm text-[#6B5D4F]">Based on {ratings.length} reviews</p>
            </div>
            <div className="text-2xl text-amber-400">{renderStars(averageRating)}</div>
          </div>
        </Card>
      </div>

      {ratings.length === 0 ? (
        <Card className="bg-[#F5EFE7] border-[#9F8B6C]/30">
          <p className="text-sm text-[#6B5D4F]">Belum ada review pelanggan. Nanti review akan muncul setelah pesanan selesai.</p>
        </Card>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {ratings.slice(0, 6).map((rating) => (
            <Card key={rating.id} className="bg-[#F5EFE7] border-[#9F8B6C]/30">
              <div className="flex flex-wrap items-center gap-3">
                <div className="rounded-lg border border-[#9F8B6C]/30 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6B5D4F]">
                  {rating.tableNumber ?? "Unknown table"}
                </div>
                <div className="rounded-lg border border-[#9F8B6C]/30 bg-[#FFF9F0] px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#6B5D4F]">
                  Order {rating.orderId ?? "N/A"}
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm uppercase tracking-[0.22em] text-[#8B7D6F]">Rating</p>
                  <div className="mt-2 text-lg font-semibold text-[#3D3428]">
                    {((rating.serviceRating + rating.foodRating) / 2).toFixed(1)} / 5
                  </div>
                </div>
                <div className="text-xl text-amber-400">
                  {renderStars((rating.serviceRating + rating.foodRating) / 2)}
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-[#6B5D4F]">{rating.comment || "Tidak ada komentar."}</p>
              <p className="mt-4 text-xs uppercase tracking-[0.24em] text-[#8B7D6F]">
                {new Date(rating.updatedAt).toLocaleDateString("id-ID", { dateStyle: "medium" })}
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
