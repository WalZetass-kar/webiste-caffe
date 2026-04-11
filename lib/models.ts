import { z } from "zod";

export const DEFAULT_BRANCH_ID = "branch-1";
export const DEFAULT_BRANCH_NAME = "CafeFlow Pekanbaru";

export const menuCategoryOptions = ["Coffee", "Food", "Dessert", "Drink"] as const;
export const menuStatusOptions = ["Aktif", "Promo", "Spesial"] as const;
export const supplyUnitOptions = ["kg", "liter", "pcs"] as const;
export const usageUnitOptions = ["g", "ml", "pcs"] as const;
export const employeePositionOptions = ["Barista", "Cashier", "Kitchen", "Manager"] as const;
export const assetCategoryOptions = ["Equipment", "Furniture", "Machine"] as const;
export const assetConditionOptions = ["Good", "Maintenance", "Broken"] as const;
export const orderStatusOptions = ["Pramusaji", "Dapur", "Siap Antar", "Selesai"] as const;
export const stockChangeTypeOptions = ["Order", "Restock", "Manual Update"] as const;
export const paymentMethodOptions = ["Cash", "QRIS", "Transfer"] as const;
export const attendanceMethodOptions = ["Manual", "QR Attendance"] as const;
export const settingKeys = [
  "logo_url",
  "cafe_name",
  "address",
  "phone",
  "email",
  "footer_text",
  "instagram_url",
  "tiktok_url",
  "whatsapp_url",
] as const;
export const realtimeEventTypeOptions = ["order", "stock", "attendance", "payment", "system"] as const;
export const realtimeEventToneOptions = ["success", "warning", "info", "error"] as const;
export const auditActionOptions = ["create", "update", "delete", "export", "login", "logout"] as const;
export const auditEntityOptions = ["menu", "supply", "employee", "asset", "order", "rating", "branch", "settings", "attendance"] as const;

export type MenuCategory = (typeof menuCategoryOptions)[number];
export type MenuStatus = (typeof menuStatusOptions)[number];
export type SupplyUnit = (typeof supplyUnitOptions)[number];
export type UsageUnit = (typeof usageUnitOptions)[number];
export type EmployeePosition = (typeof employeePositionOptions)[number];
export type AssetCategory = (typeof assetCategoryOptions)[number];
export type AssetCondition = (typeof assetConditionOptions)[number];
export type OrderStatus = (typeof orderStatusOptions)[number];
export type StockChangeType = (typeof stockChangeTypeOptions)[number];
export type PaymentMethod = (typeof paymentMethodOptions)[number];
export type AttendanceMethod = (typeof attendanceMethodOptions)[number];
export type SettingKey = (typeof settingKeys)[number];
export type RealtimeEventType = (typeof realtimeEventTypeOptions)[number];
export type RealtimeEventTone = (typeof realtimeEventToneOptions)[number];
export type AuditAction = (typeof auditActionOptions)[number];
export type AuditEntity = (typeof auditEntityOptions)[number];

export type BranchRecord = {
  id: string;
  name: string;
  address: string;
  manager: string;
  phoneNumber: string;
  createdAt: string;
  updatedAt: string;
};

export type PaymentSettingsRecord = {
  id: string;
  qrisImage: string;
  qrisLabel: string;
  transferBank: string;
  transferAccountNumber: string;
  transferAccountName: string;
  cashNote: string;
  qrisNote: string;
  transferNote: string;
  updatedAt: string;
};

export type SettingsEntryRecord = {
  key: SettingKey;
  value: string;
  updatedAt: string;
};

export type CafeSettingsRecord = {
  logoUrl: string;
  cafeName: string;
  address: string;
  phone: string;
  email: string;
  footerText: string;
  instagramUrl: string;
  tiktokUrl: string;
  whatsappUrl: string;
  updatedAt: string;
};

export type MenuRecipeItem = {
  id: string;
  supplyId: string;
  ingredientName: string;
  quantity: number;
  usageUnit: UsageUnit;
};

export type MenuRecord = {
  id: string;
  slug: string;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  image: string;
  stock: number;
  status: MenuStatus;
  story: string;
  rating: number;
  prepTime: string;
  pairing: string;
  ingredients: string[];
  recipe: MenuRecipeItem[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SupplyRecord = {
  id: string;
  branchId: string;
  branchName: string;
  materialName: string;
  supplier: string;
  stockQuantity: number;
  unit: SupplyUnit;
  purchasePrice: number;
  lastRestockDate: string;
  lowStockThreshold: number;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeRecord = {
  id: string;
  branchId: string;
  branchName: string;
  employeeName: string;
  position: EmployeePosition;
  phoneNumber: string;
  email: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
};

export type AssetRecord = {
  id: string;
  assetName: string;
  category: AssetCategory;
  purchaseDate: string;
  purchasePrice: number;
  condition: AssetCondition;
  photo: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemRecord = {
  id: string;
  menuId: string;
  menuName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderRecord = {
  id: string;
  branchId: string;
  branchName: string;
  orderCode: string;
  customerName: string;
  tableNumber: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  items: OrderItemRecord[];
  notes: string;
  subtotal: number;
  serviceFee: number;
  total: number;
  createdAt: string;
  updatedAt: string;
};

export type RatingRecord = {
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

export type RecommendedMenuRecord = MenuRecord & {
  orderCount: number;
};

export type StockHistoryRecord = {
  id: string;
  branchId: string;
  branchName: string;
  supplyId: string;
  materialName: string;
  changeType: StockChangeType;
  quantityChanged: number;
  unit: string;
  resultingStock: number;
  supplyUnit: SupplyUnit;
  date: string;
  reference: string;
};

export type AttendanceRecord = {
  id: string;
  employeeId: string;
  employeeName: string;
  position: EmployeePosition;
  branchId: string;
  branchName: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  totalWorkingHours: number;
  method: AttendanceMethod;
  isLate: boolean;
  createdAt: string;
  updatedAt: string;
};

export type RealtimeEventRecord = {
  id: string;
  type: RealtimeEventType;
  tone: RealtimeEventTone;
  title: string;
  message: string;
  href?: string;
  createdAt: string;
};

export type AuditLogRecord = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: AuditAction;
  entity: AuditEntity;
  entityId?: string;
  entityName?: string;
  changes?: Record<string, { old?: unknown; new?: unknown }>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
};

export const menuRecipeItemSchema = z.object({
  supplyId: z.string().min(1, "Bahan wajib dipilih"),
  ingredientName: z.string().min(1, "Nama bahan wajib diisi"),
  quantity: z.coerce.number().positive("Quantity bahan harus lebih dari 0"),
  usageUnit: z.enum(usageUnitOptions),
});

export const menuPayloadSchema = z.object({
  name: z.string().min(2, "Nama menu wajib diisi"),
  category: z.enum(menuCategoryOptions),
  price: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  description: z.string().min(5, "Deskripsi minimal 5 karakter"),
  image: z.string().min(1, "Gambar menu wajib diunggah"),
  stock: z.coerce.number().int().min(0).default(0),
  status: z.enum(menuStatusOptions).default("Aktif"),
  story: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).default(4.8),
  prepTime: z.string().default("5 min"),
  pairing: z.string().default("Rekomendasi pairing belum ditambahkan."),
  ingredients: z.array(z.string()).default([]),
  recipe: z.array(menuRecipeItemSchema).default([]),
  featured: z.boolean().default(false),
});

export const branchPayloadSchema = z.object({
  name: z.string().min(2, "Nama cabang wajib diisi"),
  address: z.string().min(5, "Alamat cabang wajib diisi"),
  manager: z.string().min(2, "Nama manager wajib diisi"),
  phoneNumber: z.string().min(8, "Nomor telepon cabang tidak valid"),
});

export const supplyPayloadSchema = z.object({
  branchId: z.string().min(1).default(DEFAULT_BRANCH_ID),
  materialName: z.string().min(2, "Nama bahan wajib diisi"),
  supplier: z.string().min(2, "Supplier wajib diisi"),
  stockQuantity: z.coerce.number().min(0, "Stok tidak boleh negatif"),
  unit: z.enum(supplyUnitOptions),
  purchasePrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  lastRestockDate: z.string().min(1, "Tanggal restock wajib diisi"),
  lowStockThreshold: z.coerce.number().min(0, "Ambang stok minimum tidak boleh negatif").optional(),
});

export const supplyStockAdjustmentSchema = z.object({
  quantity: z.coerce.number().positive("Jumlah restock harus lebih dari 0"),
  note: z.string().optional(),
});

export const employeePayloadSchema = z.object({
  branchId: z.string().min(1).default(DEFAULT_BRANCH_ID),
  employeeName: z.string().min(2, "Nama karyawan wajib diisi"),
  position: z.enum(employeePositionOptions),
  phoneNumber: z.string().min(8, "Nomor telepon tidak valid"),
  email: z.string().email("Email tidak valid"),
  photo: z.string().min(1, "Foto karyawan wajib diunggah"),
});

export const assetPayloadSchema = z.object({
  assetName: z.string().min(2, "Nama aset wajib diisi"),
  category: z.enum(assetCategoryOptions),
  purchaseDate: z.string().min(1, "Tanggal pembelian wajib diisi"),
  purchasePrice: z.coerce.number().min(0, "Harga tidak boleh negatif"),
  condition: z.enum(assetConditionOptions),
  photo: z.string().min(1, "Foto aset wajib diunggah"),
});

export const orderItemPayloadSchema = z.object({
  menuId: z.string().min(1, "Menu wajib dipilih"),
  quantity: z.coerce.number().int().positive("Jumlah item harus lebih dari 0"),
});

export const orderPayloadSchema = z.object({
  branchId: z.string().min(1).default(DEFAULT_BRANCH_ID),
  customerName: z.string().min(2, "Nama pelanggan wajib diisi"),
  tableNumber: z.string().min(1, "Nomor meja atau pickup wajib diisi"),
  paymentMethod: z.enum(paymentMethodOptions).optional().default("Cash"),
  notes: z.string().optional(),
  items: z.array(orderItemPayloadSchema).min(1, "Minimal ada satu item dalam pesanan"),
});

export const paymentSettingsPayloadSchema = z.object({
  qrisImage: z.string().optional().default(""),
  qrisLabel: z.string().min(2, "Label QRIS wajib diisi"),
  transferBank: z.string().optional().default(""),
  transferAccountNumber: z.string().optional().default(""),
  transferAccountName: z.string().optional().default(""),
  cashNote: z.string().optional().default(""),
  qrisNote: z.string().optional().default(""),
  transferNote: z.string().optional().default(""),
});

export const cafeSettingsPayloadSchema = z.object({
  logoUrl: z.string().optional().default(""),
  cafeName: z.string().min(2, "Nama cafe wajib diisi"),
  address: z.string().min(5, "Alamat cafe wajib diisi"),
  phone: z.string().min(8, "Nomor telepon cafe tidak valid"),
  email: z.string().email("Email cafe tidak valid"),
  footerText: z.string().min(8, "Footer text minimal 8 karakter"),
  instagramUrl: z.string().url("URL Instagram tidak valid").optional().or(z.literal("")).default(""),
  tiktokUrl: z.string().url("URL TikTok tidak valid").optional().or(z.literal("")).default(""),
  whatsappUrl: z.string().url("URL WhatsApp tidak valid").optional().or(z.literal("")).default(""),
});

export const ratingPayloadSchema = z.object({
  customerName: z.string().trim().min(2, "Nama pelanggan wajib diisi"),
  serviceRating: z.coerce.number().int().min(1, "Rating pelayanan minimal 1").max(5, "Rating pelayanan maksimal 5"),
  foodRating: z.coerce.number().int().min(1, "Rating makanan minimal 1").max(5, "Rating makanan maksimal 5"),
  comment: z.string().trim().optional().default(""),
  orderId: z.string().optional(),
  tableNumber: z.string().trim().optional(),
});

export const attendanceActionPayloadSchema = z.object({
  employeeId: z.string().min(1, "Karyawan wajib dipilih"),
  method: z.enum(attendanceMethodOptions).optional().default("Manual"),
});

export const auditLogPayloadSchema = z.object({
  userId: z.string().min(1, "User ID wajib diisi"),
  userName: z.string().min(1, "User name wajib diisi"),
  userRole: z.string().min(1, "User role wajib diisi"),
  action: z.enum(auditActionOptions),
  entity: z.enum(auditEntityOptions),
  entityId: z.string().optional(),
  entityName: z.string().optional(),
  changes: z.record(z.object({ old: z.unknown().optional(), new: z.unknown().optional() })).optional(),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export type MenuPayload = z.infer<typeof menuPayloadSchema>;
export type BranchPayload = z.infer<typeof branchPayloadSchema>;
export type SupplyPayload = z.infer<typeof supplyPayloadSchema>;
export type SupplyStockAdjustmentPayload = z.infer<typeof supplyStockAdjustmentSchema>;
export type EmployeePayload = z.infer<typeof employeePayloadSchema>;
export type AssetPayload = z.infer<typeof assetPayloadSchema>;
export type OrderPayload = z.infer<typeof orderPayloadSchema>;
export type PaymentSettingsPayload = z.infer<typeof paymentSettingsPayloadSchema>;
export type CafeSettingsPayload = z.infer<typeof cafeSettingsPayloadSchema>;
export type RatingPayload = z.infer<typeof ratingPayloadSchema>;
export type AttendanceActionPayload = z.infer<typeof attendanceActionPayloadSchema>;
export type AuditLogPayload = z.infer<typeof auditLogPayloadSchema>;
