import "server-only";

import { mkdir, readFile, writeFile, access } from "fs/promises";
import path from "path";
import {
  paymentSettingsPayloadSchema,
  type PaymentSettingsPayload,
  type PaymentSettingsRecord,
} from "@/lib/models";

const defaultPaymentSettings: PaymentSettingsRecord = {
  id: "payment-settings",
  qrisImage: "",
  qrisLabel: "CafeFlow QRIS",
  transferBank: "BCA",
  transferAccountNumber: "1234567890",
  transferAccountName: "PT CafeFlow Nusantara",
  cashNote: "Silakan lakukan pembayaran tunai di kasir setelah pesanan dikonfirmasi.",
  qrisNote: "Scan QRIS yang ditampilkan lalu tunjukkan bukti pembayaran ke kasir.",
  transferNote: "Lakukan transfer terlebih dahulu dan simpan bukti pembayaran untuk verifikasi.",
  updatedAt: new Date().toISOString(),
};

function getPaymentSettingsFilePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "payment-settings.json");
}

async function ensurePaymentSettingsFile() {
  const filePath = getPaymentSettingsFilePath();

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(defaultPaymentSettings, null, 2), "utf8");
  }
}

function normalizePaymentSettings(
  input: Partial<PaymentSettingsRecord> | null | undefined,
): PaymentSettingsRecord {
  return {
    id: "payment-settings",
    qrisImage: input?.qrisImage ?? defaultPaymentSettings.qrisImage,
    qrisLabel: input?.qrisLabel ?? defaultPaymentSettings.qrisLabel,
    transferBank: input?.transferBank ?? defaultPaymentSettings.transferBank,
    transferAccountNumber:
      input?.transferAccountNumber ?? defaultPaymentSettings.transferAccountNumber,
    transferAccountName:
      input?.transferAccountName ?? defaultPaymentSettings.transferAccountName,
    cashNote: input?.cashNote ?? defaultPaymentSettings.cashNote,
    qrisNote: input?.qrisNote ?? defaultPaymentSettings.qrisNote,
    transferNote: input?.transferNote ?? defaultPaymentSettings.transferNote,
    updatedAt: input?.updatedAt ?? defaultPaymentSettings.updatedAt,
  };
}

export async function getPaymentSettings() {
  await ensurePaymentSettingsFile();
  const filePath = getPaymentSettingsFilePath();
  const raw = await readFile(filePath, "utf8");

  return normalizePaymentSettings(JSON.parse(raw) as Partial<PaymentSettingsRecord>);
}

export async function updatePaymentSettings(input: PaymentSettingsPayload) {
  const payload = paymentSettingsPayloadSchema.parse(input);
  const record = normalizePaymentSettings({
    ...payload,
    updatedAt: new Date().toISOString(),
  });

  await writeFile(
    getPaymentSettingsFilePath(),
    JSON.stringify(record, null, 2),
    "utf8",
  );

  return record;
}
