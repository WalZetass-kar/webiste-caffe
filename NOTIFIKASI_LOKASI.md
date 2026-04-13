# 🔔 Lokasi Notifikasi - Visual Guide

## ✅ NOTIFIKASI SUDAH AKTIF!

Sistem notifikasi real-time **SUDAH ADA** dan **BERFUNGSI** di aplikasi. Berikut lokasi dan cara kerjanya:

---

## 📍 4 Tempat Notifikasi Muncul

### 1. **Toast Notification** (Pojok Kanan Atas)
```
                                    ┌──────────────────────────┐
                                    │ ✓ Pesanan Baru Masuk     │
                                    │                          │
                                    │ Table 07 - John Doe      │
                                    │                          │
                                    │ ▓▓▓▓▓▓▓▓░░░░░░░░░  [X]  │
                                    └──────────────────────────┘
                                              ↑
                                    Muncul di sini (top-right)
```

**Lokasi**: Fixed position, top-right corner
**Kapan muncul**: Saat ada pesanan baru
**Durasi**: 5 detik (auto-dismiss)
**Warna**: Green background (success)

---

### 2. **Browser Notification** (Native OS)
```
┌─────────────────────────────────────┐
│ Pesanan Baru Masuk                  │  ← Muncul di pojok layar
│                                     │     (Windows/Mac/Linux)
│ Table 07 - John Doe                 │
│ 3 item(s)                           │
│                                     │
│ [App Icon]                    [X]   │
└─────────────────────────────────────┘
```

**Lokasi**: System notification area (pojok layar)
**Kapan muncul**: Saat ada pesanan baru (jika permission granted)
**Durasi**: 5 detik (auto-close)
**Bekerja**: Bahkan saat tab tidak aktif

---

### 3. **Badge "BARU"** (Di Card Order)
```
Order Kanban:
┌─────────────────────────────────────┐
│                          [BARU] ←── Badge hijau dengan pulse
│  ┌──────────────────────────────┐  │
│  │ Table 07                     │  │
│  │ John Doe                     │  │ ← Card dengan border hijau
│  │ LP3I Cafe                    │  │
│  │                              │  │
│  │ ITEM PESANAN                 │  │
│  │ 2x Cappuccino                │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

**Lokasi**: Di pojok kanan atas card order
**Kapan muncul**: Saat ada pesanan baru
**Durasi**: 10 detik
**Visual**: Green badge dengan pulse animation

---

### 4. **Card Highlight** (Visual Indicator)
```
Normal Card:
┌──────────────────┐
│ Order Details    │  ← Gray border
└──────────────────┘

New Order Card:
┌══════════════════┐
║ Order Details    ║  ← Green border + green background + ring
└══════════════════┘
```

**Lokasi**: Card order yang baru masuk
**Kapan muncul**: Saat ada pesanan baru
**Durasi**: 10 detik
**Visual**: Green border, light green background, ring effect

---

## 🎬 Timeline Notifikasi

Ketika pesanan baru masuk:

```
T+0ms:    Order terdeteksi oleh sistem
          ↓
T+10ms:   Browser notification muncul (pojok layar)
          ↓
T+20ms:   Sound beep diputar (800 Hz, 0.5 detik)
          ↓
T+30ms:   Toast notification slide-in (pojok kanan atas)
          ↓
T+40ms:   Badge "BARU" muncul di card
          ↓
T+50ms:   Card di-highlight dengan border hijau
          ↓
          ⋮
          ↓
T+5000ms: Toast & browser notification hilang
          ↓
          ⋮
          ↓
T+10000ms: Badge "BARU" & highlight hilang
          ↓
          Normal state
```

---

## 📱 Cara Melihat Notifikasi

### Desktop:
1. Buka dashboard: `http://localhost:3000/dashboard`
2. Tunggu pesanan baru masuk (atau buat pesanan baru)
3. Notifikasi akan muncul di 4 tempat:
   - **Toast**: Pojok kanan atas (slide-in)
   - **Browser**: Pojok layar (native notification)
   - **Badge**: "BARU" di card order
   - **Highlight**: Card dengan border hijau

### Mobile:
1. Buka dashboard di mobile browser
2. Toast akan muncul di top-right
3. Browser notification (jika supported)
4. Badge dan highlight di card

---

## 🔧 Cara Mengaktifkan Browser Notification

### Jika Belum Muncul:

**Otomatis:**
Browser akan meminta permission saat pertama kali ada order baru.

**Manual:**
1. Klik icon 🔒 di address bar
2. Pilih "Site settings"
3. Cari "Notifications"
4. Set ke "Allow"

**Atau di Chrome:**
1. Settings → Privacy and security
2. Site Settings → Notifications
3. Tambahkan `localhost:3000` ke "Allowed"

---

## 🎨 Visual Examples

### Toast Notification (Pojok Kanan Atas):
```
Screen Layout:
┌─────────────────────────────────────────────┐
│ [Logo] Dashboard              [User] [Menu] │
├─────────────────────────────────────────────┤
│                                             │
│  Dashboard Content                          │
│                                             │
│                          ┌────────────────┐ │
│                          │ ✓ Pesanan Baru │ │ ← Toast di sini
│                          │ Table 07       │ │
│                          │ ▓▓▓▓▓░░░  [X] │ │
│                          └────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

### Badge "BARU" di Card:
```
Order Kanban Section:
┌─────────────────────────────────────────────┐
│ MANAJEMEN PESANAN                           │
│ Antrian order live per status               │
│                                             │
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │Pramu-│ │Dapur │ │Siap  │ │Sele- │       │
│ │saji  │ │      │ │Antar │ │sai   │       │
│ │      │ │      │ │      │ │      │       │
│ │ [BARU]│ │      │ │      │ │      │       │ ← Badge di sini
│ │┌────┐│ │      │ │      │ │      │       │
│ ││Card││ │      │ │      │ │      │       │
│ │└────┘│ │      │ │      │ │      │       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
└─────────────────────────────────────────────┘
```

---

## 🔊 Sound Notification

**Suara beep otomatis akan diputar:**
- Frequency: 800 Hz
- Duration: 0.5 detik
- Volume: 30%
- Type: Sine wave (smooth beep)

**Tidak perlu setting apapun**, sound akan otomatis play saat ada order baru.

---

## ✅ Cara Test Notifikasi

### Opsi 1: Buat Order Baru
1. Buka halaman order: `http://localhost:3000/order`
2. Buat pesanan baru
3. Submit order
4. Kembali ke dashboard
5. Notifikasi akan muncul!

### Opsi 2: Refresh Dashboard
1. Buka dashboard
2. Buat order di tab lain
3. Refresh dashboard
4. Order baru akan terdeteksi
5. Notifikasi muncul!

### Opsi 3: Simulasi (Dev Mode)
Jika ingin test tanpa membuat order real, bisa tambahkan dummy order ke state.

---

## 📊 Status Notifikasi

### ✅ Yang Sudah Aktif:

1. **Toast Notification** ✅
   - Lokasi: Top-right corner
   - Status: AKTIF
   - File: `components/ui/toast-notification.tsx`

2. **Browser Notification** ✅
   - Lokasi: System notification area
   - Status: AKTIF (perlu permission)
   - File: `hooks/use-order-notifications.ts`

3. **Sound Alert** ✅
   - Type: Beep sound
   - Status: AKTIF
   - File: `hooks/use-order-notifications.ts`

4. **Visual Indicator** ✅
   - Badge: "BARU"
   - Highlight: Green border + background
   - Status: AKTIF
   - File: `components/dashboard/order-kanban.tsx`

---

## 🎯 Lokasi di Dashboard

```
Dashboard Page:
┌─────────────────────────────────────────────┐
│ Branch Filter                               │
├─────────────────────────────────────────────┤
│ Summary Cards (6 cards)                     │
├─────────────────────────────────────────────┤
│ Sales Chart (Full Width)                    │
├─────────────────────────────────────────────┤
│ Order Kanban (Full Width)                   │ ← NOTIFIKASI DI SINI!
│ - Toast muncul di pojok kanan atas          │
│ - Badge "BARU" di card order                │
│ - Card highlight dengan border hijau        │
│ - Browser notification di system tray       │
├─────────────────────────────────────────────┤
│ Customer Reviews                            │
├─────────────────────────────────────────────┤
│ Section Grid (4 cards)                      │
└─────────────────────────────────────────────┘
```

---

## 🔍 Troubleshooting

### Toast Tidak Muncul?
- Cek console browser untuk error
- Pastikan `ToastContainer` ada di component
- Refresh halaman

### Browser Notification Tidak Muncul?
- Cek permission di browser settings
- Allow notifications untuk localhost:3000
- Test dengan klik "Allow" saat diminta

### Sound Tidak Terdengar?
- Cek volume browser/system
- Pastikan tidak di-mute
- Coba klik di halaman dulu (browser policy)

### Badge "BARU" Tidak Muncul?
- Pastikan order benar-benar baru
- Cek apakah order ID berbeda
- Refresh dashboard

---

## 📝 Code Reference

### Toast Implementation:
```tsx
// Di order-kanban.tsx
const { toasts, addToast, removeToast } = useToast();

useOrderNotifications({
  orders,
  onNewOrder: (order) => {
    addToast(
      "Pesanan Baru Masuk",
      `${order.tableNumber} - ${order.customerName}`,
      "success",
      5000
    );
  },
});

return (
  <>
    <ToastContainer toasts={toasts} onRemove={removeToast} />
    {/* ... rest of component */}
  </>
);
```

---

## 🎉 Kesimpulan

### Notifikasi SUDAH ADA di:

1. ✅ **Pojok Kanan Atas** - Toast notification
2. ✅ **System Tray** - Browser notification
3. ✅ **Card Order** - Badge "BARU" + highlight
4. ✅ **Audio** - Sound beep

### Cara Lihat:
1. Buka `http://localhost:3000/dashboard`
2. Buat order baru atau tunggu order masuk
3. Notifikasi akan muncul otomatis!

**Status**: ✅ FULLY FUNCTIONAL
**Location**: Order Kanban section (di bawah Sales Chart)

---

**Last Updated**: Context Transfer Session
