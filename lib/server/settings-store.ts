import "server-only";

import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  cafeSettingsPayloadSchema,
  type CafeSettingsPayload,
  type CafeSettingsRecord,
  type SettingKey,
  type SettingsEntryRecord,
} from "@/lib/models";

const settingFieldMap: Record<SettingKey, keyof Omit<CafeSettingsRecord, "updatedAt">> = {
  logo_url: "logoUrl",
  cafe_name: "cafeName",
  address: "address",
  phone: "phone",
  email: "email",
  footer_text: "footerText",
  instagram_url: "instagramUrl",
  tiktok_url: "tiktokUrl",
  whatsapp_url: "whatsappUrl",
};

const defaultCafeSettings: CafeSettingsRecord = {
  logoUrl: "",
  cafeName: "CafeFlow",
  address: "Jl. Kopi No. 8, Jakarta",
  phone: "+62 812 3456 7890",
  email: "hello@cafeflow.id",
  footerText: "Premium public website, modern mobile ordering flow, dan sistem operasional cafe yang tetap kuat di belakang layar.",
  instagramUrl: "https://instagram.com/cafeflow.id",
  tiktokUrl: "https://tiktok.com/@cafeflow.id",
  whatsappUrl: "https://wa.me/6281234567890",
  updatedAt: new Date().toISOString(),
};

// In-memory storage for production environments (Vercel)
let memorySettings: CafeSettingsRecord | null = null;

function getSettingsFilePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "settings.json");
}

function toSettingsEntries(settings: CafeSettingsRecord): SettingsEntryRecord[] {
  return (Object.entries(settingFieldMap) as Array<[SettingKey, keyof Omit<CafeSettingsRecord, "updatedAt">]>).map(
    ([key, field]) => ({
      key,
      value: settings[field],
      updatedAt: settings.updatedAt,
    }),
  );
}

async function isFileSystemWritable(): Promise<boolean> {
  try {
    const testPath = path.join(/* turbopackIgnore: true */ process.cwd(), "data");
    await mkdir(testPath, { recursive: true });
    return true;
  } catch {
    return false;
  }
}

async function ensureSettingsFile() {
  const writable = await isFileSystemWritable();
  
  if (!writable) {
    // Production environment (Vercel) - use in-memory storage
    if (!memorySettings) {
      memorySettings = { ...defaultCafeSettings };
    }
    return;
  }

  const filePath = getSettingsFilePath();
  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(toSettingsEntries(defaultCafeSettings), null, 2), "utf8");
  }
}

function normalizeCafeSettings(entries: SettingsEntryRecord[] | null | undefined): CafeSettingsRecord {
  const base: CafeSettingsRecord = { ...defaultCafeSettings };

  if (!entries || entries.length === 0) {
    return base;
  }

  let updatedAt = defaultCafeSettings.updatedAt;

  for (const entry of entries) {
    const field = settingFieldMap[entry.key];

    if (!field) {
      continue;
    }

    base[field] = entry.value;
    if (entry.updatedAt > updatedAt) {
      updatedAt = entry.updatedAt;
    }
  }

  return {
    ...base,
    updatedAt,
  };
}

export async function getCafeSettings() {
  await ensureSettingsFile();
  
  const writable = await isFileSystemWritable();
  
  if (!writable) {
    // Return in-memory settings for production
    return memorySettings || defaultCafeSettings;
  }

  try {
    const raw = await readFile(getSettingsFilePath(), "utf8");
    return normalizeCafeSettings(JSON.parse(raw) as SettingsEntryRecord[]);
  } catch {
    return defaultCafeSettings;
  }
}

export async function updateCafeSettings(input: CafeSettingsPayload) {
  const payload = cafeSettingsPayloadSchema.parse(input);
  const nextSettings: CafeSettingsRecord = {
    ...payload,
    updatedAt: new Date().toISOString(),
  };

  const writable = await isFileSystemWritable();
  
  if (!writable) {
    // Store in memory for production
    memorySettings = nextSettings;
    return nextSettings;
  }

  try {
    await writeFile(getSettingsFilePath(), JSON.stringify(toSettingsEntries(nextSettings), null, 2), "utf8");
  } catch {
    // Fallback to memory if write fails
    memorySettings = nextSettings;
  }

  return nextSettings;
}
