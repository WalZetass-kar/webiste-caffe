"use client";

import Image from "next/image";
import { useState } from "react";
import { ImageDropzone } from "@/components/management/image-dropzone";
import { useCafeSettings } from "@/components/providers/settings-provider";
import { useToast } from "@/components/providers/toast-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { requestJson, uploadImage } from "@/lib/client-api";
import type { CafeSettingsPayload, CafeSettingsRecord } from "@/lib/models";

type CafeSettingsManagementProps = {
  initialSettings: CafeSettingsRecord;
};

type CafeSettingsFormState = Omit<CafeSettingsRecord, "updatedAt">;

function toFormState(settings: CafeSettingsRecord): CafeSettingsFormState {
  return {
    logoUrl: settings.logoUrl,
    cafeName: settings.cafeName,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    footerText: settings.footerText,
    instagramUrl: settings.instagramUrl,
    tiktokUrl: settings.tiktokUrl,
    whatsappUrl: settings.whatsappUrl,
  };
}

export function CafeSettingsManagement({ initialSettings }: CafeSettingsManagementProps) {
  const { setSettings } = useCafeSettings();
  const { pushToast } = useToast();
  const [settings, setLocalSettings] = useState(initialSettings);
  const [form, setForm] = useState<CafeSettingsFormState>(toFormState(initialSettings));
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const saveSettings = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const logoUrl = logoFile ? await uploadImage(logoFile, "branding") : form.logoUrl;
      const payload: CafeSettingsPayload = {
        ...form,
        logoUrl,
      };
      const nextSettings = await requestJson<CafeSettingsRecord>("/api/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      setLocalSettings(nextSettings);
      setSettings(nextSettings);
      setForm(toFormState(nextSettings));
      setLogoFile(null);
      pushToast({
        title: "Pengaturan cafe diperbarui",
        description: "Branding, footer, dan kontak publik sekarang memakai data terbaru.",
        tone: "success",
      });
    } catch (requestError) {
      const message =
        requestError instanceof Error ? requestError.message : "Gagal menyimpan pengaturan cafe.";

      setError(message);
      pushToast({
        title: "Gagal memperbarui branding",
        description: message,
        tone: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Cafe branding</p>
              <h3 className="mt-2 text-2xl font-semibold text-cafe-text">
                Identitas usaha yang tampil di website publik, dashboard, dan receipt
              </h3>
            </div>
            <Badge tone="slate">Dynamic settings</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Cafe name", value: settings.cafeName },
              { label: "Email", value: settings.email },
              { label: "Phone", value: settings.phone },
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] bg-cafe-secondary/25 p-4">
                <p className="text-xs uppercase tracking-[0.22em] text-cafe-accent/60">{item.label}</p>
                <p className="mt-2 text-base font-semibold text-cafe-text">{item.value}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-cafe-accent/65">Preview brand</p>
            <h3 className="mt-2 text-xl font-semibold text-cafe-text">Tampilan ringkas identitas cafe</h3>
          </div>
          <div className="rounded-[28px] border border-cafe-line bg-cafe-secondary/20 p-5">
            <div className="flex items-center gap-4">
              {settings.logoUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-cafe-line bg-cafe-surface">
                  <Image src={settings.logoUrl} alt={settings.cafeName} fill className="object-cover" />
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cafe-line bg-cafe-surface text-lg font-semibold text-cafe-accent">
                  CF
                </div>
              )}
              <div>
                <p className="text-lg font-semibold text-cafe-text">{settings.cafeName}</p>
                <p className="mt-1 text-sm text-cafe-accent/72">{settings.address}</p>
              </div>
            </div>
            <div className="mt-4 rounded-[22px] bg-cafe-surface/90 p-4 text-sm leading-7 text-cafe-accent/78">
              {settings.footerText}
            </div>
          </div>
        </Card>
      </section>

      <Card>
        <form className="space-y-6" onSubmit={saveSettings}>
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <ImageDropzone
                label="Logo Cafe"
                description="Upload logo untuk navbar, sidebar, dan identitas publik cafe."
                initialImage={form.logoUrl}
                onChange={setLogoFile}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Nama Cafe</label>
                <Input
                  value={form.cafeName}
                  onChange={(event) => setForm((current) => ({ ...current, cafeName: event.target.value }))}
                  placeholder="Contoh: CafeFlow"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Alamat</label>
                <Textarea
                  value={form.address}
                  onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                  placeholder="Alamat utama cafe"
                  required
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">Phone</label>
                  <Input
                    value={form.phone}
                    onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                    placeholder="Nomor telepon cafe"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">Email</label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email utama cafe"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-cafe-text">Footer Text</label>
                <Textarea
                  value={form.footerText}
                  onChange={(event) => setForm((current) => ({ ...current, footerText: event.target.value }))}
                  placeholder="Kalimat singkat yang tampil di footer website."
                  required
                />
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">Instagram URL</label>
                  <Input
                    value={form.instagramUrl}
                    onChange={(event) => setForm((current) => ({ ...current, instagramUrl: event.target.value }))}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">TikTok URL</label>
                  <Input
                    value={form.tiktokUrl}
                    onChange={(event) => setForm((current) => ({ ...current, tiktokUrl: event.target.value }))}
                    placeholder="https://tiktok.com/@..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-cafe-text">WhatsApp URL</label>
                  <Input
                    value={form.whatsappUrl}
                    onChange={(event) => setForm((current) => ({ ...current, whatsappUrl: event.target.value }))}
                    placeholder="https://wa.me/..."
                  />
                </div>
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan Pengaturan Cafe"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
