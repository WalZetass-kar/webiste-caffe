import "server-only";

import { randomUUID } from "crypto";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_BRANCH_ID,
  DEFAULT_BRANCH_NAME,
  branchPayloadSchema,
  type BranchPayload,
  type BranchRecord,
} from "@/lib/models";
import { branchSeedData } from "@/lib/data";

function getBranchFilePath() {
  return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "branches.json");
}

async function ensureBranchFile() {
  const filePath = getBranchFilePath();

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(branchSeedData, null, 2), "utf8");
  }
}

function sortBranches(items: BranchRecord[]) {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function normalizeBranchRecord(input: Partial<BranchRecord> & { id: string; name: string }): BranchRecord {
  const now = new Date().toISOString();

  return {
    id: input.id,
    name: input.name,
    address: input.address ?? "",
    manager: input.manager ?? "",
    phoneNumber: input.phoneNumber ?? "",
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? input.createdAt ?? now,
  };
}

async function readBranchCollection() {
  await ensureBranchFile();
  const raw = await readFile(getBranchFilePath(), "utf8");
  const items = JSON.parse(raw) as Array<Partial<BranchRecord> & { id: string; name: string }>;

  return sortBranches(items.map((item) => normalizeBranchRecord(item)));
}

async function writeBranchCollection(items: BranchRecord[]) {
  await writeFile(getBranchFilePath(), JSON.stringify(items, null, 2), "utf8");
}

async function readUsageCollection(fileName: string) {
  const filePath = path.join(/* turbopackIgnore: true */ process.cwd(), "data", fileName);

  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Array<{ branchId?: string }>;
  } catch {
    return [];
  }
}

export function getDefaultBranchIdentity() {
  return {
    branchId: DEFAULT_BRANCH_ID,
    branchName: DEFAULT_BRANCH_NAME,
  };
}

export async function getBranchItems() {
  return readBranchCollection();
}

export async function getBranchById(id: string) {
  const items = await readBranchCollection();

  return items.find((item) => item.id === id) ?? null;
}

export async function resolveBranch(branchId?: string | null) {
  const items = await readBranchCollection();

  if (!branchId) {
    return items.find((item) => item.id === DEFAULT_BRANCH_ID) ?? branchSeedData[0];
  }

  return items.find((item) => item.id === branchId) ?? items.find((item) => item.id === DEFAULT_BRANCH_ID) ?? branchSeedData[0];
}

export async function createBranchItem(input: BranchPayload) {
  const payload = branchPayloadSchema.parse(input);
  const items = await readBranchCollection();
  const now = new Date().toISOString();
  const record = normalizeBranchRecord({
    id: randomUUID(),
    ...payload,
    createdAt: now,
    updatedAt: now,
  });

  await writeBranchCollection(sortBranches([record, ...items]));

  return record;
}

export async function updateBranchItem(id: string, input: BranchPayload) {
  const payload = branchPayloadSchema.parse(input);
  const items = await readBranchCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Cabang tidak ditemukan.");
  }

  const record = normalizeBranchRecord({
    ...current,
    ...payload,
    updatedAt: new Date().toISOString(),
  });

  await writeBranchCollection(sortBranches(items.map((item) => (item.id === id ? record : item))));

  return record;
}

export async function deleteBranchItem(id: string) {
  if (id === DEFAULT_BRANCH_ID) {
    throw new Error("Cabang default tidak bisa dihapus.");
  }

  const items = await readBranchCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Cabang tidak ditemukan.");
  }

  const [orders, supplies, employees] = await Promise.all([
    readUsageCollection("orders.json"),
    readUsageCollection("supplies.json"),
    readUsageCollection("employees.json"),
  ]);

  const isUsed = [...orders, ...supplies, ...employees].some(
    (item) => (item.branchId ?? DEFAULT_BRANCH_ID) === id,
  );

  if (isUsed) {
    throw new Error("Cabang masih dipakai oleh order, supply, atau employee.");
  }

  await writeBranchCollection(items.filter((item) => item.id !== id));
}
