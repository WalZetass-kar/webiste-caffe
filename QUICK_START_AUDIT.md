# 🚀 Quick Start: Audit Logging & Data Export

## Fitur yang Sudah Ditambahkan

### ✅ 1. Audit Logging System
Sistem untuk tracking semua aktivitas user:
- Mencatat siapa melakukan apa dan kapan
- Tracking perubahan data (old value vs new value)
- Filter logs berdasarkan user, action, entity, tanggal

### ✅ 2. Data Export ke CSV
Export data ke format CSV untuk analisis di Excel:
- Export menus, supplies, employees, assets
- Export orders, ratings, stock history
- Export audit logs
- Download langsung dari browser

## 📁 File yang Ditambahkan

### Backend
- `lib/server/audit-log-store.ts` - CRUD audit logs
- `lib/server/export-service.ts` - Convert data ke CSV
- `lib/server/auth-helper.ts` - Helper untuk user info
- `app/api/audit-logs/route.ts` - API endpoint audit logs
- `app/api/export/route.ts` - API endpoint export data

### Frontend
- `components/management/audit-log-viewer.tsx` - UI untuk lihat audit logs
- `components/management/data-export.tsx` - UI untuk export data
- `app/audit/page.tsx` - Halaman audit & export

### Data & Docs
- `data/audit-logs.json` - Storage audit logs
- `AUDIT_AND_EXPORT.md` - Dokumentasi lengkap
- `QUICK_START_AUDIT.md` - Quick start guide (file ini)

### Updated Files
- `lib/models.ts` - Tambah types untuk audit log
- `lib/auth/roles.ts` - Tambah akses `/audit` untuk owner & manager
- `lib/server/data-store.ts` - Tambah audit logging di menu CRUD
- `app/api/menu-items/route.ts` - Integrasi audit logging
- `app/api/menu-items/[id]/route.ts` - Integrasi audit logging

## 🎯 Cara Menggunakan

### 1. Akses Halaman Audit

Buka browser dan navigasi ke:
```
http://localhost:3000/audit
```

**Note:** Halaman ini hanya bisa diakses oleh role **Owner** dan **Manager**.

### 2. Export Data

Di halaman `/audit`:
1. Scroll ke section "Export Data"
2. Pilih jenis data yang ingin diexport (contoh: Menus)
3. Klik tombol "Export ke CSV"
4. File akan otomatis terdownload

File yang didownload bisa dibuka di:
- Microsoft Excel
- Google Sheets
- LibreOffice Calc
- Atau aplikasi spreadsheet lainnya

### 3. Lihat Audit Logs

Di halaman `/audit`:
1. Scroll ke section "Audit Logs"
2. Gunakan filter untuk mencari logs tertentu:
   - **Aksi**: Create, Update, Delete, Export
   - **Entitas**: Menu, Supply, Employee, Asset, Order, Rating
   - **Dari Tanggal**: Filter dari tanggal tertentu
   - **Sampai Tanggal**: Filter sampai tanggal tertentu

3. Klik "Lihat perubahan" untuk melihat detail perubahan data

### 4. Test Audit Logging

Untuk test apakah audit logging berfungsi:

1. **Buat Menu Baru**
   - Buka `/menu`
   - Tambah menu baru
   - Buka `/audit`
   - Lihat audit log dengan action "create" dan entity "menu"

2. **Update Menu**
   - Edit menu yang sudah ada
   - Ubah harga atau nama
   - Buka `/audit`
   - Lihat audit log dengan action "update"
   - Klik "Lihat perubahan" untuk melihat old vs new value

3. **Delete Menu**
   - Hapus menu
   - Buka `/audit`
   - Lihat audit log dengan action "delete"

4. **Export Data**
   - Export data apapun
   - Buka `/audit`
   - Lihat audit log dengan action "export"

## 📊 Contoh Audit Log

Ketika Anda membuat menu baru, audit log akan mencatat:

```json
{
  "id": "log-abc123",
  "userId": "user-owner",
  "userName": "Owner",
  "userRole": "owner",
  "action": "create",
  "entity": "menu",
  "entityId": "menu-xyz789",
  "entityName": "Cappuccino Special",
  "changes": null,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

Ketika Anda update harga menu, audit log akan mencatat:

```json
{
  "id": "log-def456",
  "userId": "user-owner",
  "userName": "Owner",
  "userRole": "owner",
  "action": "update",
  "entity": "menu",
  "entityId": "menu-xyz789",
  "entityName": "Cappuccino Special",
  "changes": {
    "price": {
      "old": 35000,
      "new": 40000
    }
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

## 🔧 API Endpoints

### Get Audit Logs

```bash
GET /api/audit-logs

# Dengan filter
GET /api/audit-logs?action=create&entity=menu&limit=50
```

### Export Data

```bash
GET /api/export?entity=menus&format=csv&userId=user-123&userName=John&userRole=owner
```

## 📝 Entities yang Bisa Diexport

1. `menus` - Daftar menu dan resep
2. `supplies` - Inventori bahan baku
3. `employees` - Data karyawan
4. `assets` - Daftar aset cafe
5. `orders` - Riwayat pesanan
6. `ratings` - Rating dan review pelanggan
7. `stock-history` - Histori perubahan stok
8. `audit-logs` - Log aktivitas sistem

## ⚙️ Konfigurasi

### Audit Log Retention

Secara default, audit logs disimpan selamanya. Untuk cleanup:

```typescript
import { clearOldAuditLogs } from "@/lib/server/audit-log-store";

// Hapus logs lebih dari 90 hari
await clearOldAuditLogs(90);
```

### User Info

Saat ini user info diambil dari cookie `cafeflow-role`. Di production, sebaiknya gunakan:
- JWT token
- Session management
- OAuth/Auth0

## 🎨 Customization

### Tambah Audit Logging di API Route Lain

```typescript
import { getAuditUser } from "@/lib/server/auth-helper";

export async function POST(request: Request) {
  const auditUser = await getAuditUser();
  
  // Your logic...
  const item = await createSupplyItem(payload);
  
  // Manual audit log
  await createAuditLog({
    userId: auditUser.id,
    userName: auditUser.name,
    userRole: auditUser.role,
    action: "create",
    entity: "supply",
    entityId: item.id,
    entityName: item.materialName,
  });
}
```

### Tambah Export Entity Baru

Di `lib/server/export-service.ts`:

```typescript
export function exportMyEntityToCSV(items: MyEntityRecord[]): string {
  const headers = ["ID", "Name", "Created"];
  const rows = items.map(item => [item.id, item.name, item.createdAt]);
  return arrayToCSV(headers, rows);
}
```

Di `app/api/export/route.ts`:

```typescript
case "my-entity": {
  const items = await getMyEntityItems();
  csvContent = exportMyEntityToCSV(items);
  filename = generateExportFilename("my-entity", "csv");
  break;
}
```

## 🐛 Troubleshooting

### Audit logs tidak muncul

1. Pastikan Anda sudah melakukan aksi (create/update/delete)
2. Refresh halaman `/audit`
3. Check file `data/audit-logs.json` apakah ada data

### Export tidak berfungsi

1. Pastikan API route `/api/export` bisa diakses
2. Check console browser untuk error
3. Pastikan entity name benar (menus, supplies, dll)

### Halaman /audit tidak bisa diakses

1. Pastikan role Anda adalah "owner" atau "manager"
2. Check cookie `cafeflow-role` di browser
3. Coba logout dan login lagi dengan role yang benar

## 📚 Dokumentasi Lengkap

Untuk dokumentasi lengkap, lihat file `AUDIT_AND_EXPORT.md`.

## ✨ Summary

Sekarang aplikasi CafeFlow Anda sudah memiliki:

✅ **Audit Logging** - Track semua aktivitas user
✅ **Data Export** - Export data ke CSV untuk analisis
✅ **UI yang User-Friendly** - Halaman `/audit` untuk akses mudah
✅ **Filter & Search** - Cari audit logs dengan mudah
✅ **Compliance Ready** - Siap untuk audit dan compliance

Selamat menggunakan fitur baru! 🎉
