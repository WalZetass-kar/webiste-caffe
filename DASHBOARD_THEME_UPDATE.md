# Dashboard Theme Update - Brown/Coffee Theme

Dokumentasi perubahan tema dashboard menjadi brown/coffee theme seperti referensi gambar.

## Perubahan yang Dilakukan

### 1. Dashboard Color Scheme

**Warna Utama:**
- Background Cards: `#3d3229` (dark brown)
- Border: `#5a4a3a` (medium brown)
- Inner Cards: `#2d2419` (darker brown)
- Text Primary: `#ffffff` (white)
- Text Secondary: `#c9b89f` (light brown)
- Text Tertiary: `#b8a890` (medium light brown)

### 2. Summary Cards
**File:** `components/dashboard/summary-card.tsx`

- Background gradient menggunakan brown tones
- Text colors disesuaikan untuk kontras yang baik
- Hover effect tetap smooth dengan lift animation

**Gradient Colors:**
```typescript
from-[#5d4e3f] via-[#6b5a47] to-[#7a6854]
from-[#4a3d30] via-[#5a4a3a] to-[#6a5744]
from-[#6d5d4d] via-[#7d6a57] to-[#8d7761]
// ... dan seterusnya
```

### 3. Section Grid Components
**File:** `components/dashboard/section-grid.tsx`

**Perubahan:**
- Background cards: `#3d3229/95`
- Border: `#5a4a3a`
- Inner items: `#2d2419`
- Text truncation untuk mencegah overflow
- Responsive layout dengan `min-w-0` dan `flex-1`

**Text Overflow Fix:**
```tsx
<p className="font-medium text-white truncate">{item.materialName}</p>
<p className="mt-1 text-xs text-[#b8a890] truncate">...</p>
```

### 4. Sales Chart
**File:** `components/dashboard/sales-chart.tsx`

**Perubahan:**
- Card background: `#3d3229/95`
- Legend color: `#d4c4b0`
- Axis ticks: `#b8a890`, `#c9b89f`
- Grid lines: `rgba(200,162,124,0.12)`

### 5. Order Kanban
**File:** `components/dashboard/order-kanban.tsx`

**Perubahan:**
- Card background: `#3d3229/95`
- Column background: `#2d2419`
- Order items: `#3d3229`
- Hover state: `#4d4239`
- Text truncation untuk order code dan nama

### 6. Customer Reviews
**File:** `components/dashboard/customer-reviews.tsx`

**Perubahan:**
- Card background: `#3d3229/95`
- Badge backgrounds: `#2d2419`, `#4d4239`
- Text colors disesuaikan untuk readability

### 7. Branch Filter Card
**File:** `components/pages/dashboard-page.tsx`

**Perubahan:**
- Card background: `#3d3229/95`
- Select input: `#2d2419`
- Border: `#5a4a3a`
- Focus ring: `#8d7761`

---

## Homepage Background Video

### File: `components/pages/home-page.tsx`

**Fitur Baru:**
- Background video dari Pixabay (barista making coffee)
- Video autoplay, loop, muted
- Opacity 30% untuk tidak mengganggu konten
- Fallback ke static image jika video gagal load
- Z-index layering untuk proper stacking

**Implementation:**
```tsx
<video
  autoPlay
  loop
  muted
  playsInline
  className="h-full w-full object-cover opacity-30"
>
  <source
    src="https://cdn.pixabay.com/video/2023/05/02/160547-822902404_large.mp4"
    type="video/mp4"
  />
</video>
```

**Video Source:**
- URL: Pixabay free stock video
- Content: Barista making coffee in cafe
- Format: MP4
- Size: Large (optimized for web)

---

## Text Overflow Fixes

Semua komponen dashboard sekarang menggunakan `truncate` class untuk mencegah text overflow:

```tsx
// Before
<p className="font-medium text-white">{item.name}</p>

// After
<p className="font-medium text-white truncate">{item.name}</p>
```

**Komponen yang diperbaiki:**
- Material names
- Branch names
- Employee names & emails
- Order codes
- Customer names
- Timestamps

---

## Responsive Improvements

**Flex Layout Fix:**
```tsx
<div className="flex-1 min-w-0">
  <p className="truncate">Long text here</p>
</div>
```

- `flex-1`: Allows item to grow
- `min-w-0`: Allows item to shrink below content size
- `truncate`: Adds ellipsis for overflow

---

## Color Palette Reference

```css
/* Primary Browns */
--dark-brown: #2d2419;
--medium-dark-brown: #3d3229;
--medium-brown: #4d4239;
--border-brown: #5a4a3a;

/* Text Colors */
--text-primary: #ffffff;
--text-secondary: #d4c4b0;
--text-tertiary: #c9b89f;
--text-muted: #b8a890;

/* Accent */
--accent-brown: #8d7761;
```

---

## Testing Checklist

- [x] Dashboard cards display correctly
- [x] Text tidak overflow dari container
- [x] Colors kontras dan readable
- [x] Hover states berfungsi
- [x] Responsive di mobile, tablet, desktop
- [x] Background video autoplay di homepage
- [x] Video fallback ke image jika gagal
- [x] Animations tetap smooth
- [x] Chart colors readable

---

## Browser Compatibility

**Video Background:**
- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (dengan playsInline)
- Mobile browsers: ✅ Supported (muted autoplay)

**CSS Features:**
- Truncate: ✅ All modern browsers
- Flexbox: ✅ All modern browsers
- Backdrop blur: ✅ All modern browsers

---

## Performance Notes

1. **Video Loading:**
   - Video loads asynchronously
   - Fallback image loads immediately
   - No blocking of page render

2. **CSS Animations:**
   - Using GPU-accelerated transforms
   - Smooth 60fps animations
   - No layout thrashing

3. **Text Rendering:**
   - Truncation happens in CSS (no JS)
   - No reflow on text overflow
   - Efficient rendering

---

## Future Improvements

1. Add video preload options
2. Consider multiple video sources for different screen sizes
3. Add user preference for video on/off
4. Implement lazy loading for dashboard cards
5. Add skeleton loading states

---

## Files Modified

1. `components/dashboard/summary-card.tsx`
2. `components/dashboard/section-grid.tsx`
3. `components/dashboard/sales-chart.tsx`
4. `components/dashboard/order-kanban.tsx`
5. `components/dashboard/customer-reviews.tsx`
6. `components/pages/dashboard-page.tsx`
7. `components/pages/home-page.tsx`

Total: 7 files
