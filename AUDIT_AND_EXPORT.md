# Audit Logging & Data Export

Dokumentasi untuk fitur Audit Logging dan Data Export yang baru ditambahkan ke CafeFlow.

## 📋 Fitur Audit Logging

### Apa itu Audit Logging?

Audit logging adalah sistem yang mencatat semua aktivitas penting yang dilakukan user di dalam aplikasi. Setiap kali ada perubahan data (create, update, delete), sistem akan mencatat:

- **Siapa** yang melakukan aksi (user ID, nama, role)
- **Apa** yang dilakukan (create/update/delete/export)
- **Kapan** dilakukan (timestamp)
- **Entitas apa** yang diubah (menu, supply, employee, dll)
- **Perubahan apa** yang terjadi (old value vs new value)
- **IP Address** dan **User Agent** (opsional)

### File yang Ditambahkan

1. **lib/server/audit-log-store.ts**
   - Fungsi untuk create dan read audit logs
   - Menyimpan logs di `data/audit-logs.json`
   - Filter logs berdasarkan user, action, entity, tanggal

2. **lib/server/auth-helper.ts**
   - Helper untuk mendapatkan info user dari request
   - Mendapatkan IP address dan user agent

3. **app/api/audit-logs/route.ts**
   - API endpoint untuk mengambil audit logs
   - Support filtering dengan query parameters

4. **components/management/audit-log-viewer.tsx**
   - UI component untuk menampilkan audit logs
   - Filter berdasarkan action, entity, tanggal
   - Tampilan tabel dengan detail perubahan

### Cara Menggunakan Audit Logging

#### Di Backend (Data Store)

Audit logging sudah terintegrasi di fungsi-fungsi berikut:

```typescript
// Create menu dengan audit
await createMenuItem(payload, {
  id: "user-123",
  name: "John Doe",
  role: "owner"
});

// Update menu dengan audit
await updateMenuItem(id, payload, {
  id: "user-123",
  name: "John Doe",
  role: "owner"
});

// Delete menu dengan audit
await deleteMenuItem(id, {
  id: "user-123",
  name: "John Doe",
  role: "owner"
});
```

#### Di API Routes

```typescript
import { getAuditUser } from "@/lib/server/auth-helper";

export async function POST(request: Request) {
  const auditUser = await getAuditUser();
  const item = await createMenuItem(payload, auditUser);
  // ...
}
```

#### Mengambil Audit Logs

```typescript
import { getAuditLogs } from "@/lib/server/audit-log-store";

// Ambil semua logs
const logs = await getAuditLogs();

// Dengan filter
const logs = await getAuditLogs({
  userId: "user-123",
  action: "delete",
  entity: "menu",
  startDate: "2024-01-01",
  endDate: "2024-12-31",
  limit: 50
});
```

### API Endpoints

**GET /api/audit-logs**

Query Parameters:
- `userId` - Filter by user ID
- `action` - Filter by action (create/update/delete/export)
- `entity` - Filter by entity (menu/supply/employee/asset/order/rating)
- `startDate` - Filter from date (ISO format)
- `endDate` - Filter to date (ISO format)
- `limit` - Limit results

Response:
```json
[
  {
    "id": "log-123",
    "userId": "user-owner",
    "userName": "Owner",
    "userRole": "owner",
    "action": "create",
    "entity": "menu",
    "entityId": "menu-456",
    "entityName": "Cappuccino",
    "changes": null,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## 📤 Fitur Data Export

### Apa itu Data Export?

Fitur untuk mengekspor data dari aplikasi ke format CSV yang bisa dibuka di Excel atau Google Sheets.

### File yang Ditambahkan

1. **lib/server/export-service.ts**
   - Fungsi untuk convert data ke format CSV
   - Support export untuk semua entitas
   - Generate filename dengan timestamp

2. **app/api/export/route.ts**
   - API endpoint untuk export data
   - Return file CSV sebagai download
   - Otomatis log ke audit logs

3. **components/management/data-export.tsx**
   - UI component untuk export data
   - Pilih jenis data yang ingin diexport
   - Download langsung ke browser

### Entitas yang Bisa Diexport

1. **Menus** - Daftar menu dan resep
2. **Supplies** - Inventori bahan baku
3. **Employees** - Data karyawan
4. **Assets** - Daftar aset cafe
5. **Orders** - Riwayat pesanan
6. **Ratings** - Rating dan review pelanggan
7. **Stock History** - Histori perubahan stok
8. **Audit Logs** - Log aktivitas sistem

### Cara Menggunakan Export

#### Via API

```typescript
// Export menus
const response = await fetch('/api/export?entity=menus&format=csv&userId=user-123&userName=John&userRole=owner');
const blob = await response.blob();
// Download file...
```

#### Via UI

1. Buka halaman `/audit`
2. Pilih jenis data yang ingin diexport
3. Klik tombol "Export ke CSV"
4. File akan otomatis terdownload

### API Endpoint

**GET /api/export**

Query Parameters:
- `entity` (required) - Jenis data (menus/supplies/employees/assets/orders/ratings/stock-history/audit-logs)
- `format` - Format export (saat ini hanya "csv")
- `userId` - User ID untuk audit log
- `userName` - User name untuk audit log
- `userRole` - User role untuk audit log

Response:
- Content-Type: `text/csv; charset=utf-8`
- Content-Disposition: `attachment; filename="cafeflow-menus-2024-01-15T10-30-00.csv"`

### Format CSV

Setiap entitas memiliki kolom yang berbeda:

**Menus:**
```csv
ID,Nama,Kategori,Harga,Deskripsi,Stok,Status,Rating,Waktu Persiapan,Featured,Dibuat,Diupdate
menu-1,Cappuccino,Coffee,35000,Kopi dengan susu,10,Aktif,4.8,5 min,Ya,2024-01-01T00:00:00Z,2024-01-15T10:30:00Z
```

**Orders:**
```csv
ID,Kode Order,Cabang,Nama Pelanggan,Nomor Meja,Status,Metode Pembayaran,Subtotal,Biaya Layanan,Total,Catatan,Dibuat,Diupdate
order-1,INV-CAFE-042,CafeFlow Pekanbaru,John Doe,A1,Selesai,Cash,35000,6000,41000,Extra sugar,2024-01-15T10:00:00Z,2024-01-15T10:30:00Z
```

---

## 🎯 Halaman Audit & Export

Akses halaman: `/audit`

Halaman ini hanya bisa diakses oleh:
- Owner
- Manager

Fitur di halaman ini:
1. **Export Data** - Export berbagai jenis data ke CSV
2. **Audit Logs Viewer** - Lihat dan filter audit logs

---

## 🔧 Implementasi di API Routes Lain

Untuk menambahkan audit logging di API routes lain:

```typescript
import { getAuditUser } from "@/lib/server/auth-helper";
import { createAuditLog } from "@/lib/server/audit-log-store";

export async function POST(request: Request) {
  const auditUser = await getAuditUser();
  
  // Your logic here...
  
  // Manual audit log
  await createAuditLog({
    userId: auditUser.id,
    userName: auditUser.name,
    userRole: auditUser.role,
    action: "create",
    entity: "order",
    entityId: order.id,
    entityName: order.orderCode,
  });
}
```

---

## 📊 Maintenance

### Membersihkan Old Audit Logs

```typescript
import { clearOldAuditLogs } from "@/lib/server/audit-log-store";

// Hapus logs lebih dari 90 hari
const result = await clearOldAuditLogs(90);
console.log(`Removed ${result.removed} logs, ${result.remaining} remaining`);
```

### Backup Audit Logs

Audit logs disimpan di `data/audit-logs.json`. Pastikan file ini di-backup secara berkala.

---

## 🚀 Next Steps

1. **Implementasi Authentication** - Saat ini user info diambil dari cookie role. Sebaiknya gunakan JWT atau session yang proper.

2. **Tambahkan Audit di Semua API Routes** - Saat ini baru menu yang punya audit logging. Tambahkan ke:
   - Supplies
   - Employees
   - Assets
   - Orders
   - Ratings
   - Settings

3. **Export ke Excel** - Saat ini hanya CSV. Bisa ditambahkan export ke Excel (.xlsx) menggunakan library seperti `exceljs`.

4. **Scheduled Cleanup** - Buat cron job untuk otomatis cleanup old audit logs.

5. **Advanced Filtering** - Tambahkan filter lebih detail di UI (search by user name, entity name, dll).

---

## 📝 Contoh Use Cases

### Use Case 1: Tracking Perubahan Harga Menu

```typescript
// User mengubah harga menu
await updateMenuItem("menu-123", {
  ...menuData,
  price: 40000 // dari 35000
}, auditUser);

// Audit log akan mencatat:
{
  action: "update",
  entity: "menu",
  entityName: "Cappuccino",
  changes: {
    price: { old: 35000, new: 40000 }
  }
}
```

### Use Case 2: Export Laporan Bulanan

```typescript
// Export semua orders bulan ini
const response = await fetch('/api/export?entity=orders&format=csv');
// Buka di Excel, buat pivot table, analisis penjualan
```

### Use Case 3: Investigasi Masalah

```typescript
// Cari siapa yang menghapus menu tertentu
const logs = await getAuditLogs({
  action: "delete",
  entity: "menu",
  entityId: "menu-123"
});

console.log(`Deleted by: ${logs[0].userName} at ${logs[0].timestamp}`);
```

---

## ⚠️ Important Notes

1. **Performance**: Audit logs akan terus bertambah. Pastikan ada mekanisme cleanup.

2. **Privacy**: Audit logs berisi informasi sensitif. Pastikan hanya owner/manager yang bisa akses.

3. **Storage**: File JSON tidak scalable untuk production. Pertimbangkan migrasi ke database.

4. **Async Logging**: Audit logging tidak boleh mengganggu operasi utama. Jika gagal, hanya log error tapi jangan fail operasi utama.

---

## 🎉 Summary

Fitur Audit Logging dan Data Export sudah berhasil ditambahkan! Sekarang Anda bisa:

✅ Track semua perubahan data (siapa, kapan, apa)
✅ Export data ke CSV untuk analisis di Excel
✅ Filter dan search audit logs
✅ Compliance dan accountability yang lebih baik

Akses halaman `/audit` untuk mulai menggunakan fitur ini!
