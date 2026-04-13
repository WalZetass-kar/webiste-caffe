# 📚 Dashboard Features - User Guide

## 🎯 Panduan Lengkap Fitur Dashboard Baru

Dashboard cafe management sekarang dilengkapi dengan 6 fitur baru yang powerful untuk membantu Anda mengelola cafe dengan lebih efisien.

---

## 1. 🚀 Quick Actions - Akses Cepat

### Apa itu?
Panel dengan 6 tombol akses cepat ke fitur-fitur yang paling sering digunakan.

### Fitur yang Tersedia:
```
┌─────────────┬─────────────┬─────────────┐
│ Buat        │ Kelola      │ Stok        │
│ Pesanan     │ Menu        │ Bahan       │
├─────────────┼─────────────┼─────────────┤
│ Kelola      │ Laporan     │ Pengaturan  │
│ Staff       │             │             │
└─────────────┴─────────────┴─────────────┘
```

### Cara Menggunakan:
1. Klik tombol yang diinginkan
2. Langsung diarahkan ke halaman terkait
3. Tidak perlu navigasi manual

### Kapan Menggunakan:
- Saat ingin cepat membuat order baru
- Perlu edit menu atau harga
- Cek stok bahan
- Kelola jadwal staff
- Export laporan
- Ubah pengaturan cafe

---

## 2. 📈 Today's Performance - Performa Hari Ini

### Apa itu?
4 metrik penting yang menunjukkan performa cafe hari ini secara real-time.

### Metrik yang Ditampilkan:

#### 📊 Revenue Hari Ini
- Total pendapatan hari ini
- Jumlah order yang masuk
- Update otomatis setiap ada order baru

#### 💰 Rata-rata Order
- Average order value
- Membantu track spending per customer
- Indikator pricing strategy

#### ✅ Order Selesai
- Berapa order yang sudah selesai
- Berapa yang masih pending
- Completion rate

#### ⏰ Jam Terakhir
- Berapa order dalam 1 jam terakhir
- Revenue jam terakhir
- Indikator jam sibuk

### Cara Membaca:
```
┌──────────────────────────────────────┐
│ Revenue Hari Ini                     │
│ Rp 2.450.000                         │
│ 45 orders                            │
└──────────────────────────────────────┘
```

### Kapan Menggunakan:
- Pagi hari: Cek target harian
- Siang hari: Monitor progress
- Sore hari: Evaluasi performa
- Malam hari: Review hasil

---

## 3. 🏆 Top Selling Items - Menu Terlaris

### Apa itu?
Ranking 5 menu terlaris berdasarkan jumlah yang terjual.

### Informasi yang Ditampilkan:
- **Ranking** (1st, 2nd, 3rd, 4th, 5th)
- **Nama menu**
- **Jumlah terjual**
- **Total revenue**
- **Progress bar** perbandingan

### Visual Ranking:
```
🥇 1st - Gold badge
🥈 2nd - Green badge  
🥉 3rd - Gray badge
   4th - Gray badge
   5th - Gray badge
```

### Cara Membaca:
```
┌──────────────────────────────────────┐
│ 🥇 1  Cappuccino                     │
│       45 terjual                     │
│       ████████████████████ 100%      │
│       Rp 450.000                     │
├──────────────────────────────────────┤
│ 🥈 2  Latte                          │
│       38 terjual                     │
│       ███████████████░░░░░ 84%       │
│       Rp 380.000                     │
└──────────────────────────────────────┘
```

### Manfaat:
- **Inventory Planning**: Stock lebih banyak untuk best sellers
- **Marketing**: Promosikan menu favorit
- **Menu Development**: Pahami selera customer
- **Pricing Strategy**: Optimize harga menu populer

### Kapan Menggunakan:
- Setiap hari: Monitor tren
- Mingguan: Evaluasi menu
- Bulanan: Strategi marketing
- Restock: Prioritas bahan

---

## 4. ⏰ Peak Hours Chart - Jam Sibuk

### Apa itu?
Bar chart yang menunjukkan jam-jam sibuk cafe berdasarkan jumlah order.

### Informasi yang Ditampilkan:
- Orders per jam (6 AM - 11 PM)
- Jam tersibuk (highlighted gold)
- Revenue per jam (tooltip)

### Cara Membaca Chart:
```
Orders
  │
40│     ████
  │     ████
30│     ████  ████
  │     ████  ████
20│ ██  ████  ████  ██
  │ ██  ████  ████  ██
10│ ██  ████  ████  ██  ██
  │ ██  ████  ████  ██  ██
 0└─┴───┴────┴────┴──┴──┴──
   6   9    12   15  18  21
        Jam (Hour)
```

### Manfaat:
- **Staff Scheduling**: Tambah staff di jam sibuk
- **Inventory**: Siapkan bahan lebih banyak
- **Pricing**: Happy hour di jam sepi
- **Capacity**: Manage antrian

### Contoh Penggunaan:

#### Scenario 1: Jam Sibuk Pagi
```
Peak: 09:00 (35 orders)
Action: 
- Tambah barista shift pagi
- Stock bahan breakfast menu
- Siapkan pastry lebih banyak
```

#### Scenario 2: Jam Sepi Sore
```
Low: 15:00 (8 orders)
Action:
- Kurangi staff
- Promo afternoon tea
- Maintenance equipment
```

---

## 5. 📝 Recent Activities - Aktivitas Terbaru

### Apa itu?
Timeline 8 aktivitas terbaru dari berbagai modul sistem.

### Tipe Aktivitas:

#### 🟢 Pesanan Baru
```
┌──────────────────────────────────────┐
│ 📋 Pesanan Baru                      │
│ Meja 5 - John Doe (3 items)         │
│ 13 Apr, 14:30                        │
└──────────────────────────────────────┘
```

#### 🟡 Perubahan Stok
```
┌──────────────────────────────────────┐
│ 📦 Restock Bahan                     │
│ Kopi Arabica +5 kg                   │
│ 13 Apr, 10:00                        │
└──────────────────────────────────────┘
```

#### 🔵 Check-in Staff
```
┌──────────────────────────────────────┐
│ 👤 Check-in Staff                    │
│ Jane Smith - 08:00                   │
│ 13 Apr, 08:00                        │
└──────────────────────────────────────┘
```

### Manfaat:
- Monitor operasional real-time
- Audit trail sederhana
- Koordinasi tim
- Detect anomali cepat

### Kapan Menggunakan:
- **Owner**: Review aktivitas harian
- **Manager**: Monitor operasional
- **Staff**: Koordinasi tugas
- **Audit**: Track perubahan

---

## 6. 👥 Staff Performance - Performa Karyawan

### Apa itu?
Evaluasi performa karyawan dalam 30 hari terakhir dengan 3 metrik utama.

### Metrik yang Diukur:

#### 📊 Attendance Rate
- Persentase kehadiran (0-100%)
- Dihitung dari 30 hari terakhir
- Target: ≥90% = Excellent

#### ⏰ Late Count
- Jumlah keterlambatan
- Target: ≤2x = Excellent
- >5x = Needs Improvement

#### 📋 Orders Handled
- Jumlah order yang ditangani
- Untuk role Cashier/Barista
- Indikator produktivitas

### Status Badge:

#### 🟢 Excellent
```
Kriteria:
- Attendance ≥90%
- Late ≤2x
- Performa konsisten
```

#### 🔵 Good
```
Kriteria:
- Attendance 70-89%
- Late 3-5x
- Performa standar
```

#### 🟡 Needs Improvement
```
Kriteria:
- Attendance <70%
- Late >5x
- Perlu coaching
```

### Cara Membaca:
```
┌──────────────────────────────────────┐
│ 👤 John Doe                          │
│ Barista                    🟢 Excellent│
├──────────────────────────────────────┤
│ Attendance  │ Late  │ Orders         │
│    95%      │  1x   │   120          │
├──────────────────────────────────────┤
│ ████████████████████░ 95%            │
└──────────────────────────────────────┘
```

### Manfaat:
- **Evaluasi Objektif**: Data-driven assessment
- **Reward System**: Identifikasi top performers
- **Coaching**: Fokus pada yang perlu improvement
- **Scheduling**: Assign shift berdasarkan performa

### Action Items:

#### Untuk Excellent Staff:
- ✅ Berikan reward/bonus
- ✅ Jadikan role model
- ✅ Pertimbangkan promosi
- ✅ Maintain motivasi

#### Untuk Good Staff:
- ✅ Maintain performa
- ✅ Encourage improvement
- ✅ Training tambahan
- ✅ Set target lebih tinggi

#### Untuk Needs Improvement:
- ✅ One-on-one coaching
- ✅ Identifikasi masalah
- ✅ Buat action plan
- ✅ Follow up rutin

---

## 🎯 Tips Menggunakan Dashboard

### Pagi Hari (Opening):
1. ✅ Cek **Today's Performance** - Set target
2. ✅ Review **Staff Performance** - Siapa yang hadir
3. ✅ Lihat **Recent Activities** - Update semalam
4. ✅ Cek **Top Selling Items** - Siapkan bahan

### Siang Hari (Peak Hours):
1. ✅ Monitor **Order Kanban** - Track antrian
2. ✅ Cek **Today's Performance** - Progress target
3. ✅ Gunakan **Quick Actions** - Fast response
4. ✅ Lihat **Peak Hours** - Adjust staffing

### Sore Hari (Afternoon):
1. ✅ Review **Sales Chart** - Tren penjualan
2. ✅ Cek **Low Stock** - Restock besok
3. ✅ Monitor **Recent Activities** - Operasional
4. ✅ Evaluasi **Staff Performance** - Feedback

### Malam Hari (Closing):
1. ✅ Review **Today's Performance** - Hasil hari ini
2. ✅ Cek **Top Selling Items** - Best sellers
3. ✅ Lihat **Customer Reviews** - Feedback
4. ✅ Export **Reports** - Dokumentasi

---

## 📱 Mobile vs Desktop

### Mobile View:
- Semua komponen stacked (1 kolom)
- Quick Actions: 2 kolom
- Scroll untuk lihat semua
- Touch-friendly buttons

### Desktop View:
- Layout 2-3 kolom
- Quick Actions: 6 kolom
- Side-by-side sections
- Hover effects

---

## 🎓 Best Practices

### Daily Routine:
1. **Morning**: Review yesterday, set today's target
2. **Midday**: Monitor real-time, adjust operations
3. **Evening**: Evaluate performance, plan tomorrow

### Weekly Review:
1. **Sales Trend**: Analyze 7-day chart
2. **Best Sellers**: Update menu strategy
3. **Staff Performance**: Team meeting & feedback
4. **Peak Hours**: Optimize scheduling

### Monthly Analysis:
1. **Revenue Growth**: Month-over-month
2. **Menu Performance**: Add/remove items
3. **Staff Evaluation**: Performance review
4. **Operational Efficiency**: Process improvement

---

## 🚀 Quick Reference

### Untuk Owner:
- Focus: Revenue, Staff Performance, Best Sellers
- Frequency: Daily review
- Action: Strategic decisions

### Untuk Manager:
- Focus: Operations, Staff, Inventory
- Frequency: Real-time monitoring
- Action: Tactical adjustments

### Untuk Staff:
- Focus: Orders, Quick Actions, Activities
- Frequency: Continuous
- Action: Execute tasks

---

## 📞 Support

Jika ada pertanyaan atau butuh bantuan:
1. Baca dokumentasi ini
2. Cek tooltip di setiap komponen
3. Lihat Recent Activities untuk contoh
4. Contact support team

---

**Happy Managing! ☕🚀**

Dashboard ini dirancang untuk membuat manajemen cafe Anda lebih mudah, cepat, dan data-driven. Gunakan semua fitur untuk hasil maksimal!
