# Animasi Web Cafe

Dokumentasi animasi yang telah ditambahkan ke website cafe untuk meningkatkan user experience.

## Animasi yang Ditambahkan

### 1. **Entrance Animations**
Animasi yang muncul saat elemen pertama kali dimuat:

- **animate-fade-in** - Fade in sederhana (0.6s)
- **animate-reveal-up** - Muncul dari bawah dengan fade (0.85s)
- **animate-slide-in-left** - Slide dari kiri (0.7s)
- **animate-slide-in-right** - Slide dari kanan (0.7s)
- **animate-scale-in** - Scale up dengan fade (0.6s)

### 2. **Continuous Animations**
Animasi yang berjalan terus-menerus:

- **animate-float-slow** - Floating effect naik-turun (12s loop)
- **animate-pulse** - Pulse effect untuk skeleton loading
- **shimmer-effect** - Shimmer loading effect

### 3. **Hover Animations**
Animasi interaktif saat hover:

- **hover-lift** - Terangkat ke atas saat hover
- **hover-scale** - Scale up saat hover
- **image-zoom-hover** - Zoom gambar saat hover pada container

### 4. **Stagger Delays**
Untuk efek berurutan pada grid items:

- **animate-delay-100** hingga **animate-delay-600**
- Digunakan untuk cards, menu items, dan gallery

### 5. **Micro-interactions**

- **Button active state** - Scale down saat diklik (scale 0.98)
- **Focus visible** - Outline untuk accessibility
- **Smooth transitions** - Transisi 0.3s untuk semua interactive elements
- **Navigation hover** - Letter spacing berubah saat hover

### 6. **Scroll Behavior**

- **Smooth scroll** dengan padding-top 80px
- **Sticky header** dengan backdrop blur transition

## Penggunaan

### Entrance Animation dengan Delay
```tsx
<div className="animate-fade-in animate-delay-200">
  Content
</div>
```

### Hover Effect
```tsx
<div className="hover-lift">
  Card content
</div>
```

### Stagger Grid Items
```tsx
{items.map((item, index) => (
  <div key={item.id} className={`animate-scale-in animate-delay-${index * 100}`}>
    {item.content}
  </div>
))}
```

## Lokasi File

- **CSS Animations**: `app/globals.css`
- **Homepage**: `components/pages/home-page.tsx`
- **Dashboard Cards**: `components/dashboard/summary-card.tsx`
- **Dashboard Grid**: `components/dashboard/section-grid.tsx`

## Performa

Semua animasi menggunakan:
- CSS transforms (translateY, scale) untuk performa optimal
- GPU acceleration
- Ease-out timing untuk natural feel
- Durasi yang tidak terlalu lama (0.3s - 0.85s)

## Customization

Untuk mengubah durasi atau timing:
1. Edit keyframes di `app/globals.css`
2. Sesuaikan animation duration di class utilities
3. Ubah delay values sesuai kebutuhan
