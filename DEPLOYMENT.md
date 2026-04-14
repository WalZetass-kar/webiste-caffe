# Deployment Notes / Catatan Deployment

## 🇬🇧 English Version

### Production Considerations

#### File System Storage
This template uses local file system storage for development. In production environments like Vercel, the file system is read-only.

**What's handled automatically:**
- Settings (cafe branding, contact info) - Falls back to in-memory storage in production
- All data stores gracefully handle read-only file systems

**For production use:**
Consider migrating to a proper database solution:
- PostgreSQL (Vercel Postgres, Supabase)
- MongoDB (MongoDB Atlas)
- MySQL (PlanetScale)

#### Environment Variables
No environment variables are required for the template to run. However, for production deployments, consider adding:

```env
# Optional: Database connection
DATABASE_URL=your_database_url

# Optional: File upload storage
NEXT_PUBLIC_UPLOAD_URL=your_cdn_url
```

#### Vercel Deployment
The template is ready to deploy to Vercel:

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy (no configuration needed)

**Note:** Settings changes in production will persist only during the current deployment. For permanent storage, integrate a database.

#### Features Working in Production
- All UI components
- Menu management
- Order tracking
- Staff management
- Reports and analytics
- Rating system
- PWA functionality

#### Features Requiring Database for Production
- Persistent settings across deployments
- Data persistence between deployments
- Multi-instance data synchronization

### Template Purpose
This is a **template for sale** - buyers can customize and integrate their preferred database solution based on their needs.

---

## 🇮🇩 Versi Indonesia

### Pertimbangan Production

#### Penyimpanan File System
Template ini menggunakan penyimpanan file system lokal untuk development. Di environment production seperti Vercel, file system bersifat read-only.

**Yang sudah ditangani otomatis:**
- Settings (branding cafe, info kontak) - Fallback ke in-memory storage di production
- Semua data store menangani file system read-only dengan baik

**Untuk penggunaan production:**
Pertimbangkan migrasi ke solusi database yang proper:
- PostgreSQL (Vercel Postgres, Supabase)
- MongoDB (MongoDB Atlas)
- MySQL (PlanetScale)

#### Environment Variables
Tidak ada environment variable yang wajib untuk menjalankan template. Namun, untuk deployment production, pertimbangkan menambahkan:

```env
# Opsional: Koneksi database
DATABASE_URL=your_database_url

# Opsional: Storage upload file
NEXT_PUBLIC_UPLOAD_URL=your_cdn_url
```

#### Deployment ke Vercel
Template siap di-deploy ke Vercel:

1. Push code Anda ke GitHub
2. Import project di Vercel
3. Deploy (tidak perlu konfigurasi tambahan)

**Catatan:** Perubahan settings di production hanya bertahan selama deployment saat ini. Untuk penyimpanan permanen, integrasikan database.

#### Fitur yang Berfungsi di Production
- Semua komponen UI
- Manajemen menu
- Tracking pesanan
- Manajemen staff
- Laporan dan analytics
- Sistem rating
- Fungsionalitas PWA

#### Fitur yang Memerlukan Database untuk Production
- Settings persisten antar deployment
- Persistensi data antar deployment
- Sinkronisasi data multi-instance

### Tujuan Template
Ini adalah **template untuk dijual** - pembeli dapat menyesuaikan dan mengintegrasikan solusi database pilihan mereka sesuai kebutuhan.
