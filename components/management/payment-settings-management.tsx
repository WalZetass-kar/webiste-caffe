"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageDropzone } from "@/components/management/image-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestJson, uploadImage } from "@/lib/client-api";
import type { PaymentSettingsPayload, PaymentSettingsRecord } from "@/lib/models";

type PaymentSettingsManagementProps = {
  initialSettings: PaymentSettingsRecord;
};

type PaymentFormState = {
  qrisImage: string;
  qrisLabel: string;
  transferBank: string;
  transferAccountNumber: string;
  transferAccountName: string;
  cashNote: string;
  qrisNote: string;
  transferNote: string;
};

function toFormState(settings: PaymentSettingsRecord): PaymentFormState {
  return {
    qrisImage: settings.qrisImage,
    qrisLabel: settings.qrisLabel,
    transferBank: settings.transferBank,
    transferAccountNumber: settings.transferAccountNumber,
    transferAccountName: settings.transferAccountName,
    cashNote: settings.cashNote,
    qrisNote: settings.qrisNote,
    transferNote: settings.transferNote,
  };
}

export function PaymentSettingsManagement({
  initialSettings,
}: PaymentSettingsManagementProps) {
  const [settings, setSettings] = useState(initialSettings);
  const [form, setForm] = useState<PaymentFormState>(toFormState(initialSettings));
  const [qrisFile, setQrisFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccessMessage("");

    try {
      const qrisImage = qrisFile
        ? await uploadImage(qrisFile, "payments")
        : form.qrisImage;
      const payload: PaymentSettingsPayload = {
        qrisImage,
        qrisLabel: form.qrisLabel,
        transferBank: form.transferBank,
        transferAccountNumber: form.transferAccountNumber,
        transferAccountName: form.transferAccountName,
        cashNote: form.cashNote,
        qrisNote: form.qrisNote,
        transferNote: form.transferNote,
      };
      const nextSettings = await requestJson<PaymentSettingsRecord>(
        "/api/payment-settings",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        },
      );

      setSettings(nextSettings);
      setForm(toFormState(nextSettings));
      setQrisFile(null);
      setSuccessMessage("Pengaturan pembayaran berhasil diperbarui.");
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Gagal menyimpan pengaturan pembayaran.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5 bg-[#fffaf5]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">
                Payment management
              </p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Atur QRIS, rekening transfer, dan instruksi pembayaran pelanggan
              </h3>
            </div>
            <Badge tone="cream">Dashboard configurable</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                label: "QRIS label",
                value: settings.qrisLabel,
              },
              {
                label: "Bank transfer",
                value: settings.transferBank || "Belum diisi",
              },
              {
                label: "No. rekening",
                value: settings.transferAccountNumber || "Belum diisi",
              },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-[#fbf4ec] p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">
                  {item.label}
                </p>
                <p className="mt-2 text-base font-semibold text-cafe-text">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 bg-[#fffaf5]">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">
              Preview pelanggan
            </p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">
              Informasi yang muncul di popup checkout
            </h3>
          </div>
          <div className="space-y-3 rounded-[24px] bg-[#fbf4ec] p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-cafe-text">QRIS</p>
              <Badge tone="green">{settings.qrisImage ? "Siap" : "Belum ada gambar"}</Badge>
            </div>
            {settings.qrisImage ? (
              <div className="relative h-44 overflow-hidden rounded-[24px] bg-white">
                <Image
                  src={settings.qrisImage}
                  alt={settings.qrisLabel}
                  fill
                  className="object-contain p-3"
                />
              </div>
            ) : (
              <div className="rounded-[22px] border border-dashed border-[#e2d3c1] bg-white/70 px-4 py-6 text-sm text-cafe-accent/75">
                Upload gambar QRIS agar pelanggan bisa scan saat memilih pembayaran QRIS.
              </div>
            )}
            <div className="rounded-[22px] bg-white/80 p-4 text-sm text-cafe-accent/80">
              <p className="font-semibold text-cafe-text">{settings.transferBank || "Bank belum diisi"}</p>
              <p className="mt-2">{settings.transferAccountNumber || "Nomor rekening belum diisi"}</p>
              <p className="mt-1">{settings.transferAccountName || "Nama rekening belum diisi"}</p>
            </div>
          </div>
        </Card>
      </section>

      <Card className="bg-[#fffaf5]">
        <form className="space-y-6" onSubmit={saveSettings}>
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <ImageDropzone
                label="Upload QRIS"
                description="Masukkan gambar QRIS resmi yang nanti tampil di popup pembayaran pelanggan."
                initialImage={form.qrisImage}
                onChange={setQrisFile}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">QRIS Label</label>
                <Input
                  value={form.qrisLabel}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, qrisLabel: event.target.value }))
                  }
                  placeholder="Contoh: CafeFlow QRIS"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Catatan Cash</label>
                <Textarea
                  value={form.cashNote}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, cashNote: event.target.value }))
                  }
                  placeholder="Instruksi pembayaran tunai"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">Bank Transfer</label>
                  <Input
                    value={form.transferBank}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        transferBank: event.target.value,
                      }))
                    }
                    placeholder="Contoh: BCA"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">Nomor Rekening</label>
                  <Input
                    value={form.transferAccountNumber}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        transferAccountNumber: event.target.value,
                      }))
                    }
                    placeholder="Masukkan nomor rekening"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Nama Pemilik Rekening</label>
                <Input
                  value={form.transferAccountName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      transferAccountName: event.target.value,
                    }))
                  }
                  placeholder="Contoh: PT CafeFlow Nusantara"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Catatan QRIS</label>
                <Textarea
                  value={form.qrisNote}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, qrisNote: event.target.value }))
                  }
                  placeholder="Instruksi untuk pembayaran QRIS"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Catatan Transfer</label>
                <Textarea
                  value={form.transferNote}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      transferNote: event.target.value,
                    }))
                  }
                  placeholder="Instruksi untuk pembayaran transfer"
                />
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}
          {successMessage ? <p className="text-sm text-emerald-700">{successMessage}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Pengaturan Pembayaran"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
