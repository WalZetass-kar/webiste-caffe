# Tortilla Theme Update - Dashboard & Homepage

Dokumentasi lengkap perubahan tema dashboard menjadi Tortilla (warm beige/tan) dan perbaikan background video homepage.

## Warna Tortilla Theme

### Color Palette
```css
/* Primary Tortilla Colors */
--tortilla-lightest: #FFF9F0;  /* Lightest cream */
--tortilla-light: #F5EFE7;     /* Light beige */
--tortilla-medium: #EDE4D8;    /* Medium beige */
--tortilla-base: #9F8B6C;      /* Base tortilla */

/* Text Colors */
--text-primary: #3D3428;       /* Dark brown */
--text-secondary: #6B5D4F;     /* Medium brown */
--text-tertiary: #8B7D6F;      /* Light brown */

/* Borders */
--border-light: rgba(159,139,108,0.2);
--border-medium: rgba(159,139,108,0.3);
```

---

## Dashboard Components Updated

### 1. Summary Cards
**File:** `components/dashboard/summary-card.tsx`

**Changes:**
- Background: Tortilla gradient tones
- Text: Dark brown (#3D3428) for primary
- Secondary text: #6B5D4F
- Border: #9F8B6C/30

**Gradients:**
```typescript
from-[#F5EFE7] via-[#EDE4D8] to-[#E5D9C9]
from-[#F7F1E9] via-[#EFE6DA] to-[#E7DBCB]
from-[#F9F3EB] via-[#F1E8DC] to-[#E9DDCD]
// ... etc
```

### 2. Branch Filter Card
**File:** `components/pages/dashboard-page.tsx`

**Changes:**
- Card background: #F5EFE7
- Select input: White background
- Border: #9F8B6C/30
- Focus ring: #9F8B6C
- Text colors: #3D3428, #6B5D4F

### 3. Section Grid (4 Cards)
**File:** `components/dashboard/section-grid.tsx`

**Changes:**
- Card backgrounds: #F5EFE7
- Inner items: White
- Borders: #9F8B6C/20
- Hover: #FFF9F0
- All text properly truncated

**Cards:**
1. Auto Restock Alert
2. Supply History
3. Digital Receipt
4. Staff

### 4. Order Kanban (MAJOR REDESIGN)
**File:** `components/dashboard/order-kanban.tsx`

**Major Improvements:**
- ✅ Proper layout with max-height and scroll
- ✅ Increased items per column (4 → 8)
- ✅ Better spacing and padding
- ✅ Order code in badge format
- ✅ Cleaner card design
- ✅ All text truncated properly
- ✅ Hover effects smooth

**Layout:**
```tsx
<div className="space-y-3 max-h-[400px] overflow-y-auto">
  {/* Order cards with proper spacing */}
</div>
```

**Card Structure:**
```tsx
<div className="rounded-xl border border-[#9F8B6C]/20 bg-white p-3">
  <div className="space-y-2">
    {/* Table number + Order code badge */}
    {/* Customer name */}
    {/* Branch name */}
    {/* Items count */}
  </div>
</div>
```

### 5. Sales Chart
**File:** `components/dashboard/sales-chart.tsx`

**Changes:**
- Card background: #F5EFE7
- Legend color: #3D3428
- Axis labels: #6B5D4F, #8B7D6F
- Grid lines: rgba(159,139,108,0.15)
- Badge background: White

### 6. Customer Reviews
**File:** `components/dashboard/customer-reviews.tsx`

**Changes:**
- Card backgrounds: #F5EFE7
- Badges: White and #FFF9F0
- Text colors: #3D3428, #6B5D4F, #8B7D6F
- Borders: #9F8B6C/30

---

## Homepage Background Video

### File: `components/pages/home-page.tsx`

**Improvements:**
1. ✅ Added `overflow-hidden` to container
2. ✅ Added `preload="auto"` for faster loading
3. ✅ Added `poster` attribute for fallback image
4. ✅ Multiple video sources for better compatibility
5. ✅ Proper z-index layering
6. ✅ Absolute positioning for full coverage

**Implementation:**
```tsx
<div className="absolute inset-0 z-0 overflow-hidden">
  <video
    autoPlay
    loop
    muted
    playsInline
    preload="auto"
    className="absolute inset-0 h-full w-full object-cover opacity-30"
    poster="https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1800&q=80"
  >
    <source
      src="https://cdn.pixabay.com/video/2023/05/02/160547-822902404_large.mp4"
      type="video/mp4"
    />
    <source
      src="https://videos.pexels.com/video-files/3044127/3044127-uhd_2560_1440_25fps.mp4"
      type="video/mp4"
    />
  </video>
</div>
```

**Video Sources:**
1. Primary: Pixabay - Barista making coffee
2. Fallback: Pexels - Coffee shop video
3. Poster: Unsplash static image

---

## Text Overflow Fixes

### Order Kanban Improvements
```tsx
// Table number - prominent display
<p className="font-semibold text-[#3D3428] text-base">{item.tableNumber}</p>

// Order code - badge format
<span className="font-mono text-xs text-[#6B5D4F] bg-[#F5EFE7] px-2 py-1 rounded">
  {item.orderCode}
</span>

// Customer name - truncated
<p className="text-sm text-[#6B5D4F] truncate">{item.customerName}</p>

// Branch name - truncated
<p className="text-xs text-[#8B7D6F] truncate">{item.branchName}</p>
```

### All Components
- ✅ Material names truncated
- ✅ Branch names truncated
- ✅ Employee names & emails truncated
- ✅ Order codes in badges (no truncation needed)
- ✅ Customer names truncated
- ✅ Timestamps truncated

---

## Responsive Design

### Order Kanban
- Mobile: 1 column
- Tablet (sm): 2 columns
- Desktop (xl): 4 columns
- Max height: 400px with scroll
- Smooth scrolling

### Grid Layouts
```tsx
// Section Grid
grid gap-6 md:grid-cols-2 xl:grid-cols-4

// Summary Cards
grid gap-4 md:grid-cols-2 xl:grid-cols-3

// Customer Reviews
grid gap-4 xl:grid-cols-2
```

---

## Accessibility Improvements

1. **Color Contrast:**
   - Primary text (#3D3428) on light backgrounds: AAA rated
   - Secondary text (#6B5D4F) on light backgrounds: AA rated

2. **Focus States:**
   - Select inputs have visible focus rings
   - Links have hover states
   - Buttons have active states

3. **Video:**
   - Muted by default (autoplay requirement)
   - Poster image for accessibility
   - Fallback sources

---

## Performance Optimizations

### Video Loading
```tsx
preload="auto"           // Preload video for smooth playback
poster="..."             // Show image while loading
opacity-30               // Reduce visual weight
```

### CSS
- Using Tailwind utilities (no custom CSS)
- GPU-accelerated transforms
- Efficient hover transitions

### Layout
- No layout shifts
- Proper z-index stacking
- Overflow handling

---

## Browser Compatibility

### Video Background
- ✅ Chrome/Edge: Full support
- ✅ Firefox: Full support
- ✅ Safari: Full support (playsInline)
- ✅ Mobile: Supported (muted autoplay)

### CSS Features
- ✅ Flexbox: All browsers
- ✅ Grid: All browsers
- ✅ Truncate: All browsers
- ✅ Backdrop blur: All modern browsers

---

## Testing Checklist

Dashboard:
- [x] Summary cards display correctly
- [x] Branch filter works
- [x] Order kanban shows all columns
- [x] Order cards are readable
- [x] Text doesn't overflow
- [x] Sales chart displays
- [x] Customer reviews show
- [x] Section grid cards work
- [x] Responsive on all sizes
- [x] Hover states work
- [x] Colors are consistent

Homepage:
- [x] Video autoplays
- [x] Video loops
- [x] Poster shows while loading
- [x] Fallback sources work
- [x] Content is readable over video
- [x] Z-index layering correct

---

## Files Modified

1. `components/dashboard/summary-card.tsx`
2. `components/dashboard/section-grid.tsx`
3. `components/dashboard/sales-chart.tsx`
4. `components/dashboard/order-kanban.tsx` ⭐ Major redesign
5. `components/dashboard/customer-reviews.tsx`
6. `components/pages/dashboard-page.tsx`
7. `components/pages/home-page.tsx` ⭐ Video fix

**Total:** 7 files modified

---

## Color Reference Quick Guide

```css
/* Backgrounds */
bg-[#F5EFE7]           /* Main card background */
bg-white               /* Inner items */
bg-[#FFF9F0]           /* Hover state */

/* Borders */
border-[#9F8B6C]/20    /* Light border */
border-[#9F8B6C]/30    /* Medium border */

/* Text */
text-[#3D3428]         /* Primary text */
text-[#6B5D4F]         /* Secondary text */
text-[#8B7D6F]         /* Tertiary text */

/* Gradients (Summary Cards) */
from-[#F5EFE7] via-[#EDE4D8] to-[#E5D9C9]
```

---

## Known Issues & Solutions

### Issue: Video not playing
**Solution:** Added multiple sources and poster attribute

### Issue: Text overflow in order kanban
**Solution:** Added truncate class and proper flex layout

### Issue: Order code too long
**Solution:** Moved to badge format with mono font

### Issue: Too few orders visible
**Solution:** Increased from 4 to 8 items with scroll

---

## Future Enhancements

1. Add video quality selector
2. Implement lazy loading for dashboard cards
3. Add skeleton loading states
4. Consider dark mode variant
5. Add print-friendly styles
6. Implement virtual scrolling for large order lists

---

## Deployment Notes

1. Test video playback on production domain
2. Verify CORS for video sources
3. Check mobile performance
4. Test on slow connections
5. Verify color contrast in production
6. Test with real data (long names, etc.)

---

## Support

For issues or questions:
1. Check browser console for errors
2. Verify video sources are accessible
3. Test with different data volumes
4. Check responsive breakpoints
5. Verify color contrast ratios
