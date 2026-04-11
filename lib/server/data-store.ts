import "server-only";

import { randomUUID } from "crypto";
import { access, mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import {
  DEFAULT_BRANCH_ID,
  DEFAULT_BRANCH_NAME,
  assetPayloadSchema,
  employeePayloadSchema,
  menuPayloadSchema,
  orderPayloadSchema,
  ratingPayloadSchema,
  supplyPayloadSchema,
  supplyStockAdjustmentSchema,
  type AssetPayload,
  type AssetRecord,
  type EmployeePayload,
  type EmployeeRecord,
  type MenuPayload,
  type MenuRecord,
  type OrderPayload,
  type OrderRecord,
  type RatingPayload,
  type RatingRecord,
  type RecommendedMenuRecord,
  type StockChangeType,
  type StockHistoryRecord,
  type SupplyPayload,
  type SupplyRecord,
} from "@/lib/models";
import {
  assetSeedData,
  employeeSeedData,
  menuSeedData,
  orderSeedData,
  ratingSeedData,
  stockHistorySeedData,
  supplySeedData,
} from "@/lib/data";
import {
  getDefaultLowStockThreshold,
  getReceiptLink,
  getUsageUnitsForSupplyUnit,
  isLowStock,
  parsePaymentMethodFromNotes,
  resolvePublicMenuImage,
  slugify,
} from "@/lib/utils";
import { resolveBranch } from "@/lib/server/branch-store";
import { calculateOrderTotals } from "@/lib/services/order";
import { applyStockDeductions, calculateStockDeductions, getAutomaticReorderItems } from "@/lib/services/stock";
import { appendRealtimeEvent } from "@/lib/server/realtime-events-store";
import { createAuditLog } from "@/lib/server/audit-log-store";
import type { UserRole } from "@/lib/auth/roles";

type CollectionKey = "menus" | "supplies" | "employees" | "assets" | "orders" | "ratings" | "stockHistory";

const collectionConfig = {
  menus: { seed: menuSeedData },
  supplies: { seed: supplySeedData },
  employees: { seed: employeeSeedData },
  assets: { seed: assetSeedData },
  orders: { seed: orderSeedData },
  ratings: { seed: ratingSeedData },
  stockHistory: { seed: stockHistorySeedData },
} as const;

function getCollectionFilePath(key: CollectionKey) {
  switch (key) {
    case "menus":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "menus.json");
    case "supplies":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "supplies.json");
    case "employees":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "employees.json");
    case "assets":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "assets.json");
    case "orders":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "orders.json");
    case "ratings":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "ratings.json");
    case "stockHistory":
      return path.join(/* turbopackIgnore: true */ process.cwd(), "data", "stock-history.json");
  }
}

async function ensureCollectionFile<T>(key: CollectionKey, seed: T) {
  const filePath = getCollectionFilePath(key);

  await mkdir(path.dirname(filePath), { recursive: true });

  try {
    await access(filePath);
  } catch {
    await writeFile(filePath, JSON.stringify(seed, null, 2), "utf8");
  }
}

async function readCollection<T>(key: CollectionKey, seed: T): Promise<T> {
  await ensureCollectionFile(key, seed);
  const filePath = getCollectionFilePath(key);
  const content = await readFile(filePath, "utf8");

  return JSON.parse(content) as T;
}

async function writeCollection<T>(key: CollectionKey, data: T) {
  const filePath = getCollectionFilePath(key);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

function sortByUpdatedAt<T extends { updatedAt: string }>(items: T[]) {
  return [...items].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
}

function sortByDate<T extends { date: string }>(items: T[]) {
  return [...items].sort((left, right) => right.date.localeCompare(left.date));
}

function maybeLocalUpload(filePath: string) {
  return filePath.startsWith("/uploads/");
}

async function deleteUploadIfLocal(filePath?: string) {
  if (!filePath || !maybeLocalUpload(filePath)) {
    return;
  }

  const absolutePath = path.join(/* turbopackIgnore: true */ process.cwd(), "public", filePath.replace(/^\//, ""));

  try {
    await unlink(absolutePath);
  } catch {
    // Ignore missing files so deletes stay resilient.
  }
}

function getTodayDateString() {
  return new Date().toISOString().slice(0, 10);
}

async function logAudit(params: {
  userId: string;
  userName: string;
  userRole: UserRole;
  action: "create" | "update" | "delete";
  entity: "menu" | "supply" | "employee" | "asset" | "order" | "rating";
  entityId?: string;
  entityName?: string;
  changes?: Record<string, { old: unknown; new: unknown }>;
}) {
  try {
    await createAuditLog({
      userId: params.userId,
      userName: params.userName,
      userRole: params.userRole,
      action: params.action,
      entity: params.entity,
      entityId: params.entityId,
      entityName: params.entityName,
      changes: params.changes,
    });
  } catch (error) {
    // Log error but don't fail the main operation
    console.error("Failed to create audit log:", error);
  }
}

function createOrderCode(existingOrders: OrderRecord[]) {
  const lastSequence = existingOrders.reduce((max, order) => {
    const match = order.orderCode.match(/(\d+)$/);
    const value = match ? Number(match[1]) : 0;

    return Math.max(max, value);
  }, 41);

  return `INV-CAFE-${String(lastSequence + 1).padStart(3, "0")}`;
}

function normalizeBranchIdentity(input?: { branchId?: string; branchName?: string }) {
  if (input?.branchId && input?.branchName) {
    return {
      branchId: input.branchId,
      branchName: input.branchName,
    };
  }

  return {
    branchId: input?.branchId ?? DEFAULT_BRANCH_ID,
    branchName: input?.branchName ?? DEFAULT_BRANCH_NAME,
  };
}

function normalizeMenuRecord(item: Partial<MenuRecord> & { id: string; name: string; category: MenuRecord["category"] }): MenuRecord {
  const recipe = Array.isArray(item.recipe)
    ? item.recipe.map((entry, index) => ({
        id: entry.id ?? `recipe-${item.id}-${index + 1}`,
        supplyId: entry.supplyId,
        ingredientName: entry.ingredientName,
        quantity: Number(entry.quantity ?? 0),
        usageUnit: entry.usageUnit,
      }))
    : [];

  return {
    id: item.id,
    slug: item.slug ?? `${slugify(item.name)}-${item.id.slice(0, 8)}`,
    name: item.name,
    category: item.category,
    price: Number(item.price ?? 0),
    description: item.description ?? "",
    image: resolvePublicMenuImage(item.image, item.category),
    stock: Number(item.stock ?? 0),
    status: item.status ?? "Aktif",
    story: item.story ?? item.description ?? "",
    rating: Number(item.rating ?? 4.8),
    prepTime: item.prepTime ?? "5 min",
    pairing: item.pairing ?? "Rekomendasi pairing belum ditambahkan.",
    ingredients: recipe.length > 0
      ? recipe.map((entry) => entry.ingredientName)
      : Array.isArray(item.ingredients)
        ? item.ingredients
        : [],
    recipe,
    featured: Boolean(item.featured),
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeSupplyRecord(item: Partial<SupplyRecord> & { id: string; materialName: string; unit: SupplyRecord["unit"] }): SupplyRecord {
  const branch = normalizeBranchIdentity(item);

  return {
    id: item.id,
    branchId: branch.branchId,
    branchName: branch.branchName,
    materialName: item.materialName,
    supplier: item.supplier ?? "",
    stockQuantity: Number(item.stockQuantity ?? 0),
    unit: item.unit,
    purchasePrice: Number(item.purchasePrice ?? 0),
    lastRestockDate: item.lastRestockDate ?? getTodayDateString(),
    lowStockThreshold: Number(item.lowStockThreshold ?? getDefaultLowStockThreshold(item.unit)),
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeEmployeeRecord(item: Partial<EmployeeRecord> & { id: string; employeeName: string }): EmployeeRecord {
  const branch = normalizeBranchIdentity(item);

  return {
    id: item.id,
    branchId: branch.branchId,
    branchName: branch.branchName,
    employeeName: item.employeeName,
    position: item.position ?? "Barista",
    phoneNumber: item.phoneNumber ?? "",
    email: item.email ?? "",
    photo: item.photo ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeAssetRecord(item: Partial<AssetRecord> & { id: string; assetName: string }): AssetRecord {
  return {
    id: item.id,
    assetName: item.assetName,
    category: item.category ?? "Equipment",
    purchaseDate: item.purchaseDate ?? getTodayDateString(),
    purchasePrice: Number(item.purchasePrice ?? 0),
    condition: item.condition ?? "Good",
    photo: item.photo ?? "",
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeOrderRecord(item: Partial<OrderRecord> & { id: string; orderCode: string }): OrderRecord {
  const branch = normalizeBranchIdentity(item);

  return {
    id: item.id,
    branchId: branch.branchId,
    branchName: branch.branchName,
    orderCode: item.orderCode,
    customerName: item.customerName ?? "",
    tableNumber: item.tableNumber ?? "",
    status: item.status ?? "Pramusaji",
    paymentMethod: item.paymentMethod ?? parsePaymentMethodFromNotes(item.notes ?? ""),
    items: Array.isArray(item.items)
      ? item.items.map((entry, index) => ({
          id: entry.id ?? `${item.id}-item-${index + 1}`,
          menuId: entry.menuId,
          menuName: entry.menuName,
          quantity: Number(entry.quantity ?? 0),
          unitPrice: Number(entry.unitPrice ?? 0),
        }))
      : [],
    notes: item.notes ?? "",
    subtotal: Number(item.subtotal ?? 0),
    serviceFee: Number(item.serviceFee ?? 6000),
    total: Number(item.total ?? 0),
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeRatingRecord(item: Partial<RatingRecord> & { id: string; customerName: string }): RatingRecord {
  return {
    id: item.id,
    customerName: item.customerName,
    serviceRating: Number(item.serviceRating ?? 5),
    foodRating: Number(item.foodRating ?? 5),
    comment: item.comment ?? "",
    orderId: item.orderId,
    tableNumber: item.tableNumber,
    createdAt: item.createdAt ?? new Date().toISOString(),
    updatedAt: item.updatedAt ?? item.createdAt ?? new Date().toISOString(),
  };
}

function normalizeStockHistoryRecord(item: Partial<StockHistoryRecord> & { id: string; supplyId: string; materialName: string }): StockHistoryRecord {
  const branch = normalizeBranchIdentity(item);

  return {
    id: item.id,
    branchId: branch.branchId,
    branchName: branch.branchName,
    supplyId: item.supplyId,
    materialName: item.materialName,
    changeType: item.changeType ?? "Manual Update",
    quantityChanged: Number(item.quantityChanged ?? 0),
    unit: item.unit ?? "pcs",
    resultingStock: Number(item.resultingStock ?? 0),
    supplyUnit: item.supplyUnit ?? "pcs",
    date: item.date ?? new Date().toISOString(),
    reference: item.reference ?? "System update",
  };
}

async function readMenusCollection() {
  const items = await readCollection<MenuRecord[]>("menus", collectionConfig.menus.seed);

  return sortByUpdatedAt(items.map((item) => normalizeMenuRecord(item)));
}

async function readSuppliesCollection() {
  const items = await readCollection<SupplyRecord[]>("supplies", collectionConfig.supplies.seed);

  return sortByUpdatedAt(items.map((item) => normalizeSupplyRecord(item)));
}

async function readEmployeesCollection() {
  const items = await readCollection<EmployeeRecord[]>("employees", collectionConfig.employees.seed);

  return sortByUpdatedAt(items.map((item) => normalizeEmployeeRecord(item)));
}

async function readAssetsCollection() {
  const items = await readCollection<AssetRecord[]>("assets", collectionConfig.assets.seed);

  return sortByUpdatedAt(items.map((item) => normalizeAssetRecord(item)));
}

async function readOrdersCollection() {
  const items = await readCollection<OrderRecord[]>("orders", collectionConfig.orders.seed);

  return sortByUpdatedAt(items.map((item) => normalizeOrderRecord(item)));
}

async function readRatingsCollection() {
  const items = await readCollection<RatingRecord[]>("ratings", collectionConfig.ratings.seed);

  return sortByUpdatedAt(items.map((item) => normalizeRatingRecord(item)));
}

async function readStockHistoryCollection() {
  const items = await readCollection<StockHistoryRecord[]>("stockHistory", collectionConfig.stockHistory.seed);

  return sortByDate(items.map((item) => normalizeStockHistoryRecord(item)));
}

function createMenuRecord(input: MenuPayload, existing?: MenuRecord): MenuRecord {
  const now = new Date().toISOString();
  const id = existing?.id ?? randomUUID();
  const recipe = input.recipe.map((entry, index) => ({
    id: existing?.recipe[index]?.id ?? randomUUID(),
    supplyId: entry.supplyId,
    ingredientName: entry.ingredientName,
    quantity: entry.quantity,
    usageUnit: entry.usageUnit,
  }));

  return {
    id,
    slug: existing?.slug && existing.name === input.name ? existing.slug : `${slugify(input.name)}-${id.slice(0, 8)}`,
    name: input.name,
    category: input.category,
    price: input.price,
    description: input.description,
    image: input.image,
    stock: input.stock,
    status: input.status,
    story: input.story?.trim() || input.description,
    rating: input.rating,
    prepTime: input.prepTime,
    pairing: input.pairing,
    ingredients: recipe.length > 0 ? recipe.map((entry) => entry.ingredientName) : input.ingredients,
    recipe,
    featured: input.featured,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function createSupplyRecord(
  input: SupplyPayload,
  branch: { id: string; name: string },
  existing?: SupplyRecord,
): SupplyRecord {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    branchId: branch.id,
    branchName: branch.name,
    materialName: input.materialName,
    supplier: input.supplier,
    stockQuantity: input.stockQuantity,
    unit: input.unit,
    purchasePrice: input.purchasePrice,
    lastRestockDate: input.lastRestockDate,
    lowStockThreshold: Number(input.lowStockThreshold ?? existing?.lowStockThreshold ?? getDefaultLowStockThreshold(input.unit)),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function createEmployeeRecord(
  input: EmployeePayload,
  branch: { id: string; name: string },
  existing?: EmployeeRecord,
): EmployeeRecord {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    branchId: branch.id,
    branchName: branch.name,
    employeeName: input.employeeName,
    position: input.position,
    phoneNumber: input.phoneNumber,
    email: input.email,
    photo: input.photo,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function createAssetRecord(input: AssetPayload, existing?: AssetRecord): AssetRecord {
  const now = new Date().toISOString();

  return {
    id: existing?.id ?? randomUUID(),
    assetName: input.assetName,
    category: input.category,
    purchaseDate: input.purchaseDate,
    purchasePrice: input.purchasePrice,
    condition: input.condition,
    photo: input.photo,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function createRatingRecord(input: RatingPayload & { orderId?: string }): RatingRecord {
  const now = new Date().toISOString();

  return {
    id: randomUUID(),
    customerName: input.customerName,
    serviceRating: input.serviceRating,
    foodRating: input.foodRating,
    comment: input.comment,
    orderId: input.orderId,
    tableNumber: input.tableNumber,
    createdAt: now,
    updatedAt: now,
  };
}

async function _getRatingByOrderId(orderId: string) {
  const ratings = await readRatingsCollection();

  return ratings.find((item) => item.orderId === orderId) ?? null;
}

async function _getTopRatings(count: number) {
  const ratings = await readRatingsCollection();

  return ratings.filter((rating) => rating.comment?.trim().length > 0).slice(0, count);
}

function createStockHistoryEntry(params: {
  branchId: string;
  branchName: string;
  supplyId: string;
  materialName: string;
  changeType: StockChangeType;
  quantityChanged: number;
  unit: string;
  resultingStock: number;
  supplyUnit: SupplyRecord["unit"];
  reference: string;
  date?: string;
}) {
  return normalizeStockHistoryRecord({
    id: randomUUID(),
    branchId: params.branchId,
    branchName: params.branchName,
    supplyId: params.supplyId,
    materialName: params.materialName,
    changeType: params.changeType,
    quantityChanged: params.quantityChanged,
    unit: params.unit,
    resultingStock: params.resultingStock,
    supplyUnit: params.supplyUnit,
    reference: params.reference,
    date: params.date ?? new Date().toISOString(),
  });
}

export async function getMenuItems() {
  return readMenusCollection();
}

export async function getSupplyItems() {
  return readSuppliesCollection();
}

export async function getEmployeeItems() {
  return readEmployeesCollection();
}

export async function getAssetItems() {
  return readAssetsCollection();
}

export async function getOrders() {
  return readOrdersCollection();
}

export async function getRatings() {
  return readRatingsCollection();
}

export async function getRatingByOrderId(orderId: string) {
  return _getRatingByOrderId(orderId);
}

export async function getTopRatings(count = 3) {
  return _getTopRatings(count);
}

export async function getOrderByCode(orderCode: string) {
  const items = await getOrders();

  return items.find((item) => item.orderCode === orderCode) ?? null;
}

export async function getStockHistory(limit?: number) {
  const items = await readStockHistoryCollection();

  return typeof limit === "number" ? items.slice(0, limit) : items;
}

export async function getMenuItemBySlug(slug: string) {
  const items = await getMenuItems();

  return items.find((item) => item.slug === slug) ?? null;
}

export async function getLowStockSupplies() {
  const items = await getSupplyItems();

  return items.filter((item) => isLowStock(item));
}

export async function getRecommendedMenuItems(limit = 4, excludeMenuId?: string): Promise<RecommendedMenuRecord[]> {
  const [menus, orders] = await Promise.all([getMenuItems(), getOrders()]);
  const orderCountByMenu = new Map<string, number>();

  orders.forEach((order) => {
    order.items.forEach((item) => {
      orderCountByMenu.set(item.menuId, (orderCountByMenu.get(item.menuId) ?? 0) + item.quantity);
    });
  });

  const rankedMenus = menus
    .filter((item) => item.id !== excludeMenuId)
    .map((item) => ({
      ...item,
      orderCount: orderCountByMenu.get(item.id) ?? 0,
    }))
    .sort((left, right) => {
      if (right.orderCount !== left.orderCount) {
        return right.orderCount - left.orderCount;
      }

      if (right.featured !== left.featured) {
        return Number(right.featured) - Number(left.featured);
      }

      if (right.rating !== left.rating) {
        return right.rating - left.rating;
      }

      return right.updatedAt.localeCompare(left.updatedAt);
    });

  return rankedMenus.slice(0, limit);
}

export async function createMenuItem(input: MenuPayload, auditUser?: { id: string; name: string; role: UserRole }) {
  const payload = menuPayloadSchema.parse(input);
  const items = await readMenusCollection();
  const supplies = await readSuppliesCollection();

  payload.recipe.forEach((entry) => {
    const supply = supplies.find((item) => item.id === entry.supplyId);

    if (!supply) {
      throw new Error(`Bahan untuk resep tidak ditemukan: ${entry.ingredientName}`);
    }

    if (!getUsageUnitsForSupplyUnit(supply.unit).includes(entry.usageUnit)) {
      throw new Error(`Satuan resep ${entry.usageUnit} tidak cocok untuk stok ${supply.materialName}.`);
    }
  });

  const record = createMenuRecord(payload);
  const nextItems = sortByUpdatedAt([record, ...items]);

  await writeCollection("menus", nextItems);

  if (auditUser) {
    await logAudit({
      userId: auditUser.id,
      userName: auditUser.name,
      userRole: auditUser.role,
      action: "create",
      entity: "menu",
      entityId: record.id,
      entityName: record.name,
    });
  }

  return record;
}

export async function updateMenuItem(id: string, input: MenuPayload, auditUser?: { id: string; name: string; role: UserRole }) {
  const payload = menuPayloadSchema.parse(input);
  const items = await readMenusCollection();
  const supplies = await readSuppliesCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Menu tidak ditemukan.");
  }

  payload.recipe.forEach((entry) => {
    const supply = supplies.find((item) => item.id === entry.supplyId);

    if (!supply) {
      throw new Error(`Bahan untuk resep tidak ditemukan: ${entry.ingredientName}`);
    }

    if (!getUsageUnitsForSupplyUnit(supply.unit).includes(entry.usageUnit)) {
      throw new Error(`Satuan resep ${entry.usageUnit} tidak cocok untuk stok ${supply.materialName}.`);
    }
  });

  const record = createMenuRecord(payload, current);
  const nextItems = sortByUpdatedAt(items.map((item) => (item.id === id ? record : item)));

  await writeCollection("menus", nextItems);

  if (current.image !== record.image) {
    await deleteUploadIfLocal(current.image);
  }

  if (auditUser) {
    const changes: Record<string, { old: unknown; new: unknown }> = {};
    if (current.name !== record.name) changes.name = { old: current.name, new: record.name };
    if (current.price !== record.price) changes.price = { old: current.price, new: record.price };
    if (current.category !== record.category) changes.category = { old: current.category, new: record.category };
    if (current.status !== record.status) changes.status = { old: current.status, new: record.status };

    await logAudit({
      userId: auditUser.id,
      userName: auditUser.name,
      userRole: auditUser.role,
      action: "update",
      entity: "menu",
      entityId: record.id,
      entityName: record.name,
      changes: Object.keys(changes).length > 0 ? changes : undefined,
    });
  }

  return record;
}

export async function deleteMenuItem(id: string, auditUser?: { id: string; name: string; role: UserRole }) {
  const items = await readMenusCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Menu tidak ditemukan.");
  }

  await writeCollection(
    "menus",
    items.filter((item) => item.id !== id),
  );
  await deleteUploadIfLocal(current.image);

  if (auditUser) {
    await logAudit({
      userId: auditUser.id,
      userName: auditUser.name,
      userRole: auditUser.role,
      action: "delete",
      entity: "menu",
      entityId: current.id,
      entityName: current.name,
    });
  }
}

export async function createSupplyItem(input: SupplyPayload) {
  const payload = supplyPayloadSchema.parse(input);
  const items = await readSuppliesCollection();
  const branch = await resolveBranch(payload.branchId);
  const record = createSupplyRecord(payload, branch);

  await writeCollection("supplies", sortByUpdatedAt([record, ...items]));

  return record;
}

export async function updateSupplyItem(id: string, input: SupplyPayload) {
  const payload = supplyPayloadSchema.parse(input);
  const supplies = await readSuppliesCollection();
  const history = await readStockHistoryCollection();
  const current = supplies.find((item) => item.id === id);

  if (!current) {
    throw new Error("Bahan tidak ditemukan.");
  }

  const branch = await resolveBranch(payload.branchId);
  const record = createSupplyRecord(payload, branch, current);
  const nextHistory = [...history];
  const delta = Number((record.stockQuantity - current.stockQuantity).toFixed(3));

  if (delta !== 0) {
    nextHistory.unshift(
      createStockHistoryEntry({
        branchId: record.branchId,
        branchName: record.branchName,
        supplyId: record.id,
        materialName: record.materialName,
        changeType: "Manual Update",
        quantityChanged: delta,
        unit: record.unit,
        resultingStock: record.stockQuantity,
        supplyUnit: record.unit,
        reference: "Edit supply form",
      }),
    );
  }

  await writeCollection(
    "supplies",
    sortByUpdatedAt(supplies.map((item) => (item.id === id ? record : item))),
  );
  await writeCollection("stockHistory", sortByDate(nextHistory));

  return record;
}

export async function restockSupplyItem(id: string, quantity: number, note?: string) {
  const payload = supplyStockAdjustmentSchema.parse({ quantity, note });
  const supplies = await readSuppliesCollection();
  const history = await readStockHistoryCollection();
  const current = supplies.find((item) => item.id === id);

  if (!current) {
    throw new Error("Bahan tidak ditemukan.");
  }

  const now = new Date().toISOString();
  const updated: SupplyRecord = {
    ...current,
    stockQuantity: Number((current.stockQuantity + payload.quantity).toFixed(3)),
    lastRestockDate: now.slice(0, 10),
    updatedAt: now,
  };

  const nextHistory = [
    createStockHistoryEntry({
      branchId: updated.branchId,
      branchName: updated.branchName,
      supplyId: updated.id,
      materialName: updated.materialName,
      changeType: "Restock",
      quantityChanged: payload.quantity,
      unit: updated.unit,
      resultingStock: updated.stockQuantity,
      supplyUnit: updated.unit,
      reference: payload.note?.trim() || "Restock supplier",
      date: now,
    }),
    ...history,
  ];

  await writeCollection(
    "supplies",
    sortByUpdatedAt(supplies.map((item) => (item.id === id ? updated : item))),
  );
  await writeCollection("stockHistory", sortByDate(nextHistory));

  return updated;
}

export async function deleteSupplyItem(id: string) {
  const supplies = await readSuppliesCollection();
  const menus = await readMenusCollection();
  const current = supplies.find((item) => item.id === id);

  if (!current) {
    throw new Error("Bahan tidak ditemukan.");
  }

  const usedByMenu = menus.find((item) => item.recipe.some((entry) => entry.supplyId === id));

  if (usedByMenu) {
    throw new Error(`Bahan ini masih digunakan oleh menu "${usedByMenu.name}".`);
  }

  await writeCollection(
    "supplies",
    supplies.filter((item) => item.id !== id),
  );
}

export async function createEmployeeItem(input: EmployeePayload) {
  const payload = employeePayloadSchema.parse(input);
  const items = await readEmployeesCollection();
  const branch = await resolveBranch(payload.branchId);
  const record = createEmployeeRecord(payload, branch);

  await writeCollection("employees", sortByUpdatedAt([record, ...items]));

  return record;
}

export async function updateEmployeeItem(id: string, input: EmployeePayload) {
  const payload = employeePayloadSchema.parse(input);
  const items = await readEmployeesCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Karyawan tidak ditemukan.");
  }

  const branch = await resolveBranch(payload.branchId);
  const record = createEmployeeRecord(payload, branch, current);
  await writeCollection(
    "employees",
    sortByUpdatedAt(items.map((item) => (item.id === id ? record : item))),
  );

  if (current.photo !== record.photo) {
    await deleteUploadIfLocal(current.photo);
  }

  return record;
}

export async function deleteEmployeeItem(id: string) {
  const items = await readEmployeesCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Karyawan tidak ditemukan.");
  }

  await writeCollection(
    "employees",
    items.filter((item) => item.id !== id),
  );
  await deleteUploadIfLocal(current.photo);
}

export async function createAssetItem(input: AssetPayload) {
  const payload = assetPayloadSchema.parse(input);
  const items = await readAssetsCollection();
  const record = createAssetRecord(payload);

  await writeCollection("assets", sortByUpdatedAt([record, ...items]));

  return record;
}

export async function updateAssetItem(id: string, input: AssetPayload) {
  const payload = assetPayloadSchema.parse(input);
  const items = await readAssetsCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Aset tidak ditemukan.");
  }

  const record = createAssetRecord(payload, current);
  await writeCollection(
    "assets",
    sortByUpdatedAt(items.map((item) => (item.id === id ? record : item))),
  );

  if (current.photo !== record.photo) {
    await deleteUploadIfLocal(current.photo);
  }

  return record;
}

export async function deleteAssetItem(id: string) {
  const items = await readAssetsCollection();
  const current = items.find((item) => item.id === id);

  if (!current) {
    throw new Error("Aset tidak ditemukan.");
  }

  await writeCollection(
    "assets",
    items.filter((item) => item.id !== id),
  );
  await deleteUploadIfLocal(current.photo);
}

export async function createRating(input: RatingPayload & { orderId?: string }) {
  const payload = ratingPayloadSchema.parse(input);
  const items = await readRatingsCollection();
  const record = createRatingRecord({ ...payload, orderId: input.orderId });

  await writeCollection("ratings", sortByUpdatedAt([record, ...items]));

  return record;
}


export async function createOrder(input: OrderPayload) {
  const payload = orderPayloadSchema.parse(input);
  const orders = await readOrdersCollection();
  const menus = await readMenusCollection();
  const supplies = await readSuppliesCollection();
  const history = await readStockHistoryCollection();
  const branch = await resolveBranch(payload.branchId);
  const now = new Date().toISOString();
  const { deductions, resolvedItems } = calculateStockDeductions(payload.items, menus, supplies, branch.id);
  const orderItems = resolvedItems.map(({ menu, quantity }) => ({
    id: randomUUID(),
    menuId: menu.id,
    menuName: menu.name,
    quantity,
    unitPrice: menu.price,
  }));
  const { subtotal, serviceFee, total } = calculateOrderTotals(orderItems);
  const orderCode = createOrderCode(orders);
  const order: OrderRecord = {
    id: randomUUID(),
    branchId: branch.id,
    branchName: branch.name,
    orderCode,
    customerName: payload.customerName,
    tableNumber: payload.tableNumber,
    status: "Pramusaji",
    paymentMethod: payload.paymentMethod,
    items: orderItems,
    notes: payload.notes?.trim() ?? "",
    subtotal,
    serviceFee,
    total,
    createdAt: now,
    updatedAt: now,
  };

  const nextSupplies = sortByUpdatedAt(applyStockDeductions(supplies, deductions, now));

  const nextHistory = sortByDate([
    ...Array.from(deductions.values()).map((deduction) => {
      const updatedSupply = nextSupplies.find((item) => item.id === deduction.supply.id) ?? deduction.supply;

      return createStockHistoryEntry({
        branchId: deduction.supply.branchId,
        branchName: deduction.supply.branchName,
        supplyId: deduction.supply.id,
        materialName: deduction.supply.materialName,
        changeType: "Order",
        quantityChanged: -deduction.quantityInUsageUnit,
        unit: deduction.usageUnit,
        resultingStock: updatedSupply.stockQuantity,
        supplyUnit: deduction.supply.unit,
        reference: orderCode,
        date: now,
      });
    }),
    ...history,
  ]);

  await writeCollection("orders", sortByUpdatedAt([order, ...orders]));
  await writeCollection("supplies", nextSupplies);
  await writeCollection("stockHistory", nextHistory);

  const autoReorderItems = getAutomaticReorderItems(nextSupplies)
    .filter((item) => item.branchId === branch.id)
    .slice(0, 3);

  await appendRealtimeEvent({
    type: "order",
    tone: "info",
    title: `Order ${order.orderCode} berhasil masuk`,
    message: `Pesanan baru dari ${order.customerName} tercatat untuk ${order.branchName}.`,
    href: getReceiptLink(order.orderCode),
  });
  await appendRealtimeEvent({
    type: "payment",
    tone: "success",
    title: `Pembayaran ${order.orderCode} berhasil`,
    message: `Metode ${order.paymentMethod} dipilih untuk total ${order.total.toLocaleString("id-ID")}.`,
    href: getReceiptLink(order.orderCode),
  });

  for (const item of autoReorderItems) {
    await appendRealtimeEvent({
      type: "stock",
      tone: "warning",
      title: `Stok ${item.materialName} menipis`,
      message: `Stok ${item.materialName} tinggal ${item.stockQuantity} ${item.unit} di ${item.branchName}.`,
      href: "/supply",
    });
  }

  return order;
}
