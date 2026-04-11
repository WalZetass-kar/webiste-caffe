import { AppShell } from "@/components/layout/app-shell";
import { PageHeader } from "@/components/sections/page-header";
import { Card } from "@/components/ui/card";
import { PenilaianClient } from "./penilaian-client";
import { getRatings } from "@/lib/server/data-store";

type RatingRecord = {
  id: string;
  customerName: string;
  serviceRating: number;
  foodRating: number;
  comment: string;
  orderId?: string;
  tableNumber?: string;
  createdAt: string;
  updatedAt: string;
};

async function fetchRatings(): Promise<RatingRecord[]> {
  try {
    return await getRatings();
  } catch {
    return [];
  }
}

export default async function PenilaianPage() {
  const ratings = await fetchRatings();

  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          eyebrow="Sistem Penilaian"
          title="Masukan pelanggan untuk pelayanan dan makanan"
          description="Kumpulkan penilaian pelanggan secara langsung untuk memantau kualitas pelayanan, rasa makanan, dan pengalaman kunjungan di kafe."
        />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
          <Card className="bg-[#fffaf5]">
            <div className="space-y-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Form penilaian</p>
                <h2 className="mt-2 text-2xl font-semibold text-cafe-text">Bagikan pengalaman Anda</h2>
              </div>
              <p className="text-sm leading-7 text-cafe-accent/80">
                Isi nama, beri skor 1 sampai 5 untuk pelayanan dan makanan, lalu tambahkan komentar bila
                diperlukan.
              </p>
            </div>
            <PenilaianClient initialRatings={ratings} />
          </Card>

          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-[28px] border border-white/70 bg-white/60 px-5 py-4 shadow-soft">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Daftar masukan</p>
                <h2 className="mt-1 text-xl font-semibold text-cafe-text">Penilaian terbaru pelanggan</h2>
              </div>
              <div className="rounded-full bg-cafe-secondary/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cafe-accent">
                {ratings.length} ulasan
              </div>
            </div>
            <PenilaianClient initialRatings={ratings} mode="list" />
          </div>
        </div>
      </div>
    </AppShell>
  );
}